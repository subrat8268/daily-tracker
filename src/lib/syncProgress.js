/**
 * syncProgress.js
 * Single source of truth for syncing any progress key → Supabase `progress` table.
 * Called by useTrackerStore on every toggle/cycle/setStreak action.
 */
import { supabase, isSupabaseEnabled } from './supabase';

// Debounce map — avoids hammering Supabase on rapid clicks
const timers = {};

/**
 * Upsert a single progress item to Supabase.
 * @param {string} category  - 'weekDone' | 'todayChecks' | 'nsDone' | 'streakData' | 'mcDone'
 * @param {string} itemId    - the key used in the store
 * @param {boolean|string|number} val - the value to store
 * @param {number} debounceMs - default 600ms
 */
export function syncItem(category, itemId, val, debounceMs = 600) {
  if (!isSupabaseEnabled) return;

  const key = `${category}::${itemId}`;
  clearTimeout(timers[key]);

  timers[key] = setTimeout(async () => {
    const { error } = await supabase
      .from('progress')
      .upsert(
        {
          item_id: key,
          category,
          is_done: typeof val === 'boolean' ? val : val === 'done' || Number(val) > 0,
          value: String(val),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'item_id' }
      );

    if (error) console.error(`[Supabase] syncItem error [${key}]:`, error.message);
  }, debounceMs);
}

/**
 * Load ALL progress rows from Supabase and return as a map: { category: { itemId: value } }
 * Used on app boot to rehydrate store from cloud.
 */
export async function loadAllProgress() {
  if (!isSupabaseEnabled) return null;

  const { data, error } = await supabase
    .from('progress')
    .select('item_id, category, value, is_done');

  if (error) {
    console.error('[Supabase] loadAllProgress error:', error.message);
    return null;
  }

  const result = {
    weekDone: {},
    mcDone: {},
    todayChecks: {},
    nsDone: {},
    streakData: {},
  };

  data.forEach(({ item_id, category, value, is_done }) => {
    // item_id format is "category::originalKey"
    const originalKey = item_id.replace(`${category}::`, '');

    if (category === 'nsDone') {
      result.nsDone[originalKey] = value || 'none';
    } else if (category === 'streakData') {
      result.streakData[originalKey] = Number(value) || 0;
    } else if (category === 'weekDone' || category === 'mcDone' || category === 'todayChecks') {
      result[category][originalKey] = is_done;
    }
  });

  return result;
}
