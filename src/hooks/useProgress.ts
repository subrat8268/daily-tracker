import { useState, useCallback, useMemo, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../lib/supabase';

const STORAGE_KEY = 'roadmap-progress';

type DoneMap = Record<string, boolean>;

function loadLocalDone(): DoneMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DoneMap) : {};
  } catch {
    return {};
  }
}

function saveLocalDone(done: DoneMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
}

export function useProgress(totalCount: number) {
  const [done, setDone] = useState<DoneMap>(loadLocalDone);
  const [synced, setSynced] = useState(false);

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!isSupabaseEnabled || synced) return;
    let cancelled = false;

    supabase!
      .from('progress')
      .select('item_id, is_done')
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        const cloudMap: DoneMap = {};
        data.forEach((row) => {
          cloudMap[row.item_id as string] = row.is_done as boolean;
        });
        setDone(cloudMap);
        saveLocalDone(cloudMap);
        setSynced(true);
      });

    return () => { cancelled = true; };
  }, [synced]);

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      saveLocalDone(next);

      // Upsert to Supabase
      if (isSupabaseEnabled) {
        supabase!
          .from('progress')
          .upsert({ item_id: id, is_done: next[id] }, { onConflict: 'item_id' })
          .then(({ error }) => {
            if (error) console.error('[Supabase] progress upsert error:', error.message);
          });
      }

      return next;
    });
  }, []);

  const isDone = useCallback((id: string) => Boolean(done[id]), [done]);

  const doneCount = useMemo(
    () => Object.values(done).filter(Boolean).length,
    [done]
  );

  const progress = useMemo(
    () => ({
      done: doneCount,
      total: totalCount,
      pct: totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0,
    }),
    [doneCount, totalCount]
  );

  return { isDone, toggleDone, progress };
}
