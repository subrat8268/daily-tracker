/**
 * EmptyState.jsx
 * Reusable empty state with emoji illustration, title, and subtitle.
 * Usage: <EmptyState emoji="📝" title="No logs yet" subtitle="Fill the form above tonight" />
 */
export function EmptyState({ emoji = '📦', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-5xl mb-4 select-none">{emoji}</div>
      {title && <div className="text-[15px] font-semibold text-slate-700 mb-1">{title}</div>}
      {subtitle && <div className="text-[13px] text-slate-400 leading-relaxed max-w-[240px]">{subtitle}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
