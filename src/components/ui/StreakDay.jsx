import { memo } from 'react';

// Uber blue at 4 opacity levels — matches dark & light via CSS var base
const LEVEL_STYLES = [
  { background: 'var(--bg-elevated)', border: 'var(--border)' },
  { background: 'rgba(39,110,241,0.20)', border: 'rgba(39,110,241,0.35)' },
  { background: 'rgba(39,110,241,0.45)', border: 'rgba(39,110,241,0.6)' },
  { background: 'rgba(39,110,241,0.75)', border: 'rgba(39,110,241,0.9)' },
  { background: 'rgba(39,110,241,1)',    border: 'rgba(39,110,241,1)' },
];

const LEVEL_LABELS = ['not logged', 'light', 'good', 'solid', 'beast'];

export const StreakDay = memo(function StreakDay({ date, level, isToday, onClick }) {
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const label = `${dateStr} — ${LEVEL_LABELS[level] || 'not logged'}`;
  const style = LEVEL_STYLES[level] || LEVEL_STYLES[0];

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-5 h-5 flex-shrink-0 transition-all duration-100 active:scale-90
        ${isToday ? 'animate-pulse-slow' : ''}`}
      style={{
        borderRadius: 4,
        border: isToday ? '2px solid var(--accent)' : `1px solid ${style.border}`,
        background: style.background,
        outline: isToday ? '2px solid rgba(39,110,241,0.25)' : 'none',
        outlineOffset: isToday ? 1 : 0,
      }}
    />
  );
});
