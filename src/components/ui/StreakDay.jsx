import { memo } from 'react';

const LEVEL_CLASSES = [
  'bg-slate-100 border-slate-200',
  'bg-green-100 border-green-300',
  'bg-green-300 border-green-400',
  'bg-green-500 border-green-600',
  'bg-green-800 border-green-900',
];

const LEVEL_LABELS = ['not logged', 'light', 'good', 'solid', 'beast'];

export const StreakDay = memo(function StreakDay({ date, level, isToday, onClick }) {
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const label = `${dateStr} — ${LEVEL_LABELS[level] || 'not logged'}`;

  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`w-5 h-5 rounded-[3px] border flex-shrink-0 transition-all duration-100 active:scale-90
        ${LEVEL_CLASSES[level] || LEVEL_CLASSES[0]}
        ${isToday ? '!border-blue-500 !border-2' : ''}
      `}
    />
  );
});
