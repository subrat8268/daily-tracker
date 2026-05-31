export function ProgressBar({ pct, label, color = 'bg-green-600', className = '' }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      {label && (
        <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{label}</span>
      )}
    </div>
  );
}
