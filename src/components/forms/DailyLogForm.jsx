import { useRef, useState, useCallback } from 'react';
import useTrackerStore from '../../store/useTrackerStore';
import { supabase, isSupabaseEnabled } from '../../lib/supabase';

const MOODS = [
  { emoji: '🔥', label: 'Beast mode', streakLevel: 4 },
  { emoji: '✅', label: 'Solid day', streakLevel: 3 },
  { emoji: '😐', label: 'Average', streakLevel: 2 },
  { emoji: '😓', label: 'Tough day', streakLevel: 1 },
  { emoji: '❌', label: 'Skipped', streakLevel: 0 },
];

const KRED_HOURS = [0.5, 1, 1.5, 2, 2.5, 3];
const STUDY_HOURS = [4, 5, 6, 7, 8];

function QuickBtn({ value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`min-w-[44px] h-11 px-3 rounded-xl text-sm font-medium border transition-all
        ${selected
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400'
        }`}
    >
      {value}
    </button>
  );
}

export function DailyLogForm({ onSaved, onLogAdded }) {
  const saveLog = useTrackerStore((s) => s.saveLog);
  const setStreak = useTrackerStore((s) => s.setStreak);

  const today = new Date().toISOString().split('T')[0];
  const [mood, setMood] = useState('✅');
  const [kredHours, setKredHours] = useState(null);
  const [studyHours, setStudyHours] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [date, setDate] = useState(today);
  const [saving, setSaving] = useState(false);

  const dsaRef = useRef();
  const jsRef = useRef();
  const mcRef = useRef();
  const tomorrowRef = useRef();
  const notesRef = useRef();

  const handleSave = useCallback(async () => {
    if (!tomorrowRef.current?.value?.trim() && !dsaRef.current?.value?.trim()) {
      onSaved?.('Fill at least DSA done or Tomorrow task first', 'error');
      return;
    }

    setSaving(true);

    const supabasePayload = {
      date,
      mood,
      study_hours: studyHours ? parseFloat(studyHours) : null,
      kred_hours: kredHours ? parseFloat(kredHours) : null,
      dsa_done: dsaRef.current?.value || '',
      js_rev: jsRef.current?.value || '',
      mc_done: mcRef.current?.value || '',
      tomorrow_task: tomorrowRef.current?.value || '',
      notes: notesRef.current?.value || '',
    };

    let savedId = `${Date.now()}`;

    if (isSupabaseEnabled) {
      // Upsert by date so re-logging same day updates instead of duplicating
      const { data, error } = await supabase
        .from('daily_logs')
        .upsert(supabasePayload, { onConflict: 'date' })
        .select()
        .single();

      if (error) {
        console.error('[Supabase] daily_logs upsert error:', error.message);
        onSaved?.('Saved locally (Supabase error)', 'error');
      } else {
        savedId = data.id;
        onLogAdded?.(data); // notify parent to refresh list
        onSaved?.('Logged to cloud! ☁️🔥', 'success');
      }
    } else {
      onSaved?.('Logged locally (no Supabase)', 'success');
    }

    // Always keep localStorage in sync via store
    const localEntry = {
      id: savedId,
      date,
      mood,
      study: studyHours ?? '',
      kred: kredHours ?? '',
      dsa: dsaRef.current?.value || '',
      js: jsRef.current?.value || '',
      mc: mcRef.current?.value || '',
      tomorrow: tomorrowRef.current?.value || '',
      notes: notesRef.current?.value || '',
    };
    saveLog(localEntry);

    // Auto-update streak from mood
    const d = new Date(date);
    const moodObj = MOODS.find((m) => m.emoji === mood);
    setStreak(d.toDateString(), moodObj?.streakLevel ?? 0);

    setSaving(false);
  }, [date, mood, studyHours, kredHours, onSaved, onLogAdded, saveLog, setStreak]);

  return (
    <div className="space-y-5">
      {/* Date */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Date</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-slate-50"
        />
      </div>

      {/* Mood */}
      <div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">How was today?</div>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() => setMood(m.emoji)}
              title={m.label}
              className={`flex-1 h-12 text-xl rounded-xl border-2 transition-all
                ${mood === m.emoji
                  ? 'border-slate-900 bg-slate-100 scale-110'
                  : 'border-slate-200 hover:border-slate-300'
                }`}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Text inputs */}
      {[
        { label: 'DSA done today', ref: dsaRef, placeholder: 'e.g. Two Sum hashmap, Remove Duplicates', autoFocus: true },
        { label: 'JS / React concept', ref: jsRef, placeholder: 'e.g. Closures + makeCounter, useEffect gotchas' },
        { label: 'Machine coding built', ref: mcRef, placeholder: 'e.g. Search filter UI from scratch' },
        { label: 'Tomorrow at 6 AM ✨', ref: tomorrowRef, placeholder: 'e.g. Valid Anagram + useFetch hook' },
      ].map(({ label, ref, placeholder, autoFocus }) => (
        <div key={label}>
          <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">{label}</label>
          <input
            ref={ref}
            defaultValue=""
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="w-full h-12 border border-slate-200 rounded-xl px-3 text-sm bg-slate-50 text-slate-800
              focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      ))}

      {/* KredBook hours */}
      <div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">KredBook hours</div>
        <div className="flex gap-2 flex-wrap">
          {KRED_HOURS.map((h) => (
            <QuickBtn key={h} value={h} selected={kredHours === h} onClick={setKredHours} />
          ))}
        </div>
      </div>

      {/* Study hours */}
      <div>
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Study hours (total)</div>
        <div className="flex gap-2 flex-wrap">
          {STUDY_HOURS.map((h) => (
            <QuickBtn key={h} value={h} selected={studyHours === h} onClick={setStudyHours} />
          ))}
        </div>
      </div>

      {/* Notes (hidden by default) */}
      {!showNotes ? (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          + Add notes / blockers
        </button>
      ) : (
        <div>
          <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">
            Notes / blockers / what I'd do differently
          </label>
          <textarea
            ref={notesRef}
            defaultValue=""
            rows={3}
            placeholder="Honest reflection. What broke, what clicked, what took too long."
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-800
              focus:outline-none focus:border-blue-400 focus:bg-white transition-colors resize-none"
          />
        </div>
      )}

      {/* Save button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 bg-slate-900 text-white rounded-xl font-semibold text-sm
          hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving…' : 'Save today\'s log →'}
      </button>
    </div>
  );
}
