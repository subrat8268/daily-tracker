import { useRef, useState, useCallback, useEffect } from 'react';
import useTrackerStore from '../../store/useTrackerStore';
import { supabase, isSupabaseEnabled } from '../../lib/supabase';

const MOODS = [
  { emoji: '🔥', label: 'Beast mode', streakLevel: 4 },
  { emoji: '✅', label: 'Solid day',  streakLevel: 3 },
  { emoji: '😐', label: 'Average',    streakLevel: 2 },
  { emoji: '😓', label: 'Tough day',  streakLevel: 1 },
  { emoji: '❌', label: 'Skipped',    streakLevel: 0 },
];

const KRED_HOURS  = [0.5, 1, 1.5, 2, 2.5, 3];
const STUDY_HOURS = [4, 5, 6, 7, 8];

function FieldLabel({ children }) {
  return (
    <div
      className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
    >
      {children}
    </div>
  );
}

function QuickBtn({ value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="min-w-[44px] h-11 px-3 text-sm font-medium transition-all duration-150 active:scale-95"
      style={{
        background:   selected ? 'var(--text-primary)' : 'var(--bg-elevated)',
        color:        selected ? 'var(--text-inverse)' : 'var(--text-secondary)',
        border:       `1px solid ${selected ? 'var(--text-primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-card)',
      }}
    >
      {value}
    </button>
  );
}

function TextInput({ inputRef, placeholder, defaultValue = '', autoFocus }) {
  return (
    <input
      ref={inputRef}
      defaultValue={defaultValue}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className="u-input w-full h-12 px-3"
    />
  );
}

export function DailyLogForm({ onSaved, onLogAdded, prefillDsa }) {
  const saveLog   = useTrackerStore((s) => s.saveLog);
  const setStreak = useTrackerStore((s) => s.setStreak);

  const today = new Date().toISOString().split('T')[0];
  const [mood,       setMood]       = useState('✅');
  const [kredHours,  setKredHours]  = useState(null);
  const [studyHours, setStudyHours] = useState(null);
  const [showNotes,  setShowNotes]  = useState(false);
  const [date,       setDate]       = useState(today);
  const [saving,     setSaving]     = useState(false);

  const dsaRef      = useRef();
  const jsRef       = useRef();
  const mcRef       = useRef();
  const tomorrowRef = useRef();
  const notesRef    = useRef();

  useEffect(() => {
    if (prefillDsa && dsaRef.current && !dsaRef.current.value) {
      dsaRef.current.value = prefillDsa;
    }
  }, [prefillDsa]);

  const handleSave = useCallback(async () => {
    if (!tomorrowRef.current?.value?.trim() && !dsaRef.current?.value?.trim()) {
      onSaved?.('Fill at least DSA done or Tomorrow task first', 'error');
      return;
    }

    setSaving(true);

    const supabasePayload = {
      date,
      mood,
      study_hours:   studyHours ? parseFloat(studyHours) : null,
      kred_hours:    kredHours  ? parseFloat(kredHours)  : null,
      dsa_done:      dsaRef.current?.value      || '',
      js_rev:        jsRef.current?.value       || '',
      mc_done:       mcRef.current?.value       || '',
      tomorrow_task: tomorrowRef.current?.value || '',
      notes:         notesRef.current?.value    || '',
    };

    let savedId = `${Date.now()}`;

    if (isSupabaseEnabled) {
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
        onLogAdded?.(data);
        onSaved?.('Logged to cloud! ☁️🔥', 'success');
      }
    } else {
      onSaved?.('Logged! 🔥', 'success');
    }

    const moodObj = MOODS.find((m) => m.emoji === mood);
    const d = new Date(date);
    setStreak(d.toDateString(), moodObj?.streakLevel ?? 0);

    saveLog({
      id: savedId, date, mood,
      study:    studyHours ?? '',
      kred:     kredHours  ?? '',
      dsa:      dsaRef.current?.value      || '',
      js:       jsRef.current?.value       || '',
      mc:       mcRef.current?.value       || '',
      tomorrow: tomorrowRef.current?.value || '',
      notes:    notesRef.current?.value    || '',
    });

    setSaving(false);
  }, [date, mood, studyHours, kredHours, onSaved, onLogAdded, saveLog, setStreak]);

  return (
    <div className="space-y-5">
      {/* Date */}
      <div className="flex items-center gap-3">
        <FieldLabel>Date</FieldLabel>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="u-input px-2 py-1.5 text-sm"
        />
      </div>

      {/* Mood */}
      <div>
        <FieldLabel>How was today?</FieldLabel>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.emoji}
              type="button"
              onClick={() => setMood(m.emoji)}
              title={m.label}
              className="flex-1 h-12 text-xl transition-all duration-150 active:scale-95"
              style={{
                borderRadius: 'var(--radius-card)',
                border: `2px solid ${mood === m.emoji ? 'var(--text-primary)' : 'var(--border)'}`,
                background: mood === m.emoji ? 'var(--bg-elevated)' : 'transparent',
                transform: mood === m.emoji ? 'scale(1.06)' : 'scale(1)',
              }}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Text inputs */}
      {[
        { label: 'DSA done today',      ref: dsaRef,      placeholder: 'e.g. Two Sum hashmap, Remove Duplicates', autoFocus: true },
        { label: 'JS / React concept',  ref: jsRef,       placeholder: 'e.g. Closures, useEffect gotchas' },
        { label: 'Machine coding built', ref: mcRef,      placeholder: 'e.g. Search filter UI from scratch' },
        { label: 'Tomorrow at 6 AM ✨',  ref: tomorrowRef, placeholder: 'e.g. Valid Anagram + useFetch hook' },
      ].map(({ label, ref, placeholder, autoFocus }) => (
        <div key={label}>
          <FieldLabel>{label}</FieldLabel>
          <TextInput inputRef={ref} placeholder={placeholder} autoFocus={autoFocus} />
        </div>
      ))}

      {/* KredBook hours */}
      <div>
        <FieldLabel>KredBook hours</FieldLabel>
        <div className="flex gap-2 flex-wrap">
          {KRED_HOURS.map((h) => (
            <QuickBtn key={h} value={h} selected={kredHours === h} onClick={setKredHours} />
          ))}
        </div>
      </div>

      {/* Study hours */}
      <div>
        <FieldLabel>Study hours (total)</FieldLabel>
        <div className="flex gap-2 flex-wrap">
          {STUDY_HOURS.map((h) => (
            <QuickBtn key={h} value={h} selected={studyHours === h} onClick={setStudyHours} />
          ))}
        </div>
      </div>

      {/* Notes toggle */}
      {!showNotes ? (
        <button
          type="button"
          onClick={() => setShowNotes(true)}
          className="text-sm transition-colors duration-150"
          style={{ color: 'var(--accent)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent)'}
        >
          + Add notes / blockers
        </button>
      ) : (
        <div className="animate-slide-up">
          <FieldLabel>Notes / blockers / what I'd do differently</FieldLabel>
          <textarea
            ref={notesRef}
            defaultValue=""
            rows={3}
            placeholder="Honest reflection. What broke, what clicked, what took too long."
            className="u-input w-full px-3 py-2.5 text-sm resize-none"
            style={{ lineHeight: 1.6 }}
          />
        </div>
      )}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 font-semibold text-sm transition-all duration-150 active:scale-[0.98]"
        style={{
          background: 'var(--text-primary)',
          color: 'var(--text-inverse)',
          borderRadius: 'var(--radius-card)',
          opacity: saving ? 0.6 : 1,
          cursor: saving ? 'not-allowed' : 'pointer',
        }}
      >
        {saving ? 'Saving…' : "Save today's log →"}
      </button>
    </div>
  );
}
