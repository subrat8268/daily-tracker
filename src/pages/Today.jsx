import { useCallback, useEffect } from 'react';
import { Flame, Target, Mic } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { useStreak } from '../hooks/useStreak';
import { useAppToast } from '../components/layout/AppShell';
import { CheckItem } from '../components/ui/CheckItem';
import { StreakDay } from '../components/ui/StreakDay';
import { Card } from '../components/ui/Card';
import { WeeklySummaryCard } from '../components/ui/WeeklySummaryCard';
import { StreakAlertBanner } from '../components/ui/StreakAlertBanner';
import { START_DATE, TOTAL_DAYS } from '../data/constants';

const TODAY_ITEMS = [
  { id: 0, time: '6:00 AM',  label: 'Rewrite one old problem from memory — no AI' },
  { id: 1, time: '8:00 AM',  label: 'Workout done' },
  { id: 2, time: '10:00 AM', label: 'NamasteDev: watch + solve + rewrite' },
  { id: 3, time: '1:00 PM',  label: 'KredBook: ship one visible thing' },
  { id: 4, time: '4:30 PM',  label: '1–2 fresh DSA problems' },
  { id: 5, time: '5:30 PM',  label: "ChatGPT voice quiz on today's JS/React topic" },
  { id: 6, time: '8:30 PM',  label: 'Fill the daily log' },
];

export default function Today() {
  const todayChecks      = useTrackerStore((s) => s.todayChecks);
  const toggleTodayCheck = useTrackerStore((s) => s.toggleTodayCheck);
  const streakData       = useTrackerStore((s) => s.streakData);
  const cycleStreak      = useTrackerStore((s) => s.cycleStreak);
  const setStreak        = useTrackerStore((s) => s.setStreak);
  const nsDone           = useTrackerStore((s) => s.nsDone);
  const qaUser           = useTrackerStore((s) => s.qaUser);
  const streak           = useStreak();
  const addToast         = useAppToast();

  const todayStr = new Date().toDateString();
  const today    = new Date();
  const dayNum   = Math.min(
    Math.floor((today - START_DATE) / (1000 * 60 * 60 * 24)) + 1,
    TOTAL_DAYS,
  );
  const nsDoneCount = Object.values(nsDone).filter((v) => v === 'done').length;
  const checkedToday = Object.entries(todayChecks).filter(([k, v]) => k.includes(todayStr) && v === true).length;

  useEffect(() => {
    const autoLevel = checkedToday >= 6 ? 4 : checkedToday >= 4 ? 3 : checkedToday >= 2 ? 2 : checkedToday >= 1 ? 1 : 0;
    const current   = streakData[todayStr] || 0;
    if (autoLevel > current) setStreak(todayStr, autoLevel);
  }, [todayChecks, todayStr, streakData, setStreak, checkedToday]);

  const handleToggle = useCallback(
    (id) => toggleTodayCheck(`today-${id}`, todayStr),
    [toggleTodayCheck, todayStr],
  );

  const handleStreakClick = useCallback((dateStr) => {
    cycleStreak(dateStr);
    addToast?.('Streak updated!', 'success');
  }, [cycleStreak, addToast]);

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + i);
    return d;
  });

  const stats = [
    { value: dayNum, sub: 'of 90',     label: 'Day',     accent: false },
    { value: streak, sub: 'streak',    label: '🔥',      accent: streak >= 3 },
    { value: nsDoneCount, sub: 'done', label: 'Namaste', accent: false },
    { value: qaUser.length, sub: 'saved', label: 'Q&As', accent: false },
  ];

  return (
    <div>
      <StreakAlertBanner />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {stats.map(({ value, sub, label, accent }) => (
          <div
            key={label}
            className="p-4"
            style={{
              background:   'var(--bg-surface)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow:    'var(--shadow-card)',
            }}
          >
            <div
              className="text-[11px] font-medium mb-1 uppercase tracking-wide"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {label}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-2xl md:text-3xl font-black"
                style={{
                  color:          accent ? 'var(--warning)' : 'var(--text-primary)',
                  letterSpacing:  '-0.03em',
                }}
              >
                {value}
              </span>
              <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{sub}</span>
            </div>
          </div>
        ))}
      </div>

      <WeeklySummaryCard />

      {/* Today checklist */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Today's focus
          </span>
          <span className="ml-auto text-[11px] font-mono" style={{ color: 'var(--text-tertiary)' }}>
            {checkedToday}/{TODAY_ITEMS.length}
          </span>
        </div>
        {TODAY_ITEMS.map(({ id, time, label }) => {
          const key = `today-${id}_${todayStr}`;
          return (
            <CheckItem
              key={id}
              id={id}
              label={`${time} — ${label}`}
              checked={!!todayChecks[key]}
              onToggle={handleToggle}
            />
          );
        })}
      </Card>

      {/* Streak heatmap */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={14} style={{ color: 'var(--warning)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            90-day streak
          </span>
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
            tap to override
          </span>
        </div>
        <div className="flex flex-wrap gap-[3px]">
          {days.map((d) => {
            const key = d.toDateString();
            return (
              <StreakDay
                key={key}
                date={d}
                level={streakData[key] || 0}
                isToday={key === todayStr}
                onClick={() => handleStreakClick(key)}
              />
            );
          })}
        </div>
        <div className="flex gap-3 items-center mt-3 flex-wrap">
          {['none', 'light', 'good', 'solid', 'beast'].map((l, i) => (
            <span key={l} className="flex items-center gap-1">
              <span
                className="w-3 h-3 inline-block"
                style={{
                  borderRadius: 3,
                  background: i === 0
                    ? 'var(--bg-elevated)'
                    : `rgba(39,110,241,${[0.2, 0.45, 0.75, 1][i - 1]})`,
                  border: '1px solid var(--border)',
                }}
              />
              <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{l}</span>
            </span>
          ))}
        </div>
      </Card>

      {/* Senior reminder */}
      <Card accent accentColor="var(--text-tertiary)">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={13} style={{ color: 'var(--text-tertiary)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Senior reminder
          </span>
        </div>
        <p className="text-[13px] leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
          You froze in those interviews because you had zero reps — not because you're not smart.
          Two Sum, filter dashboard — fixable with 30 practice reps, not 30 days of theory.
          You have production code at AU Bank, XPharms, KredBook. What you're adding now is interview muscle.
        </p>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          ChatGPT voice mode for JS/React is smart. Use it like a mock interviewer —
          "quiz me on closures", not "explain closures to me."
        </p>
      </Card>
    </div>
  );
}
