export function ProgressBar({ pct, label, className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: 3, background: 'var(--bg-overlay)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: 'var(--text-primary)' }}
        />
      </div>
      {label && (
        <span
          className="text-[11px] font-mono whitespace-nowrap"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
