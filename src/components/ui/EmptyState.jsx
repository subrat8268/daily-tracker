export function EmptyState({ emoji = '📦', title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-5xl mb-4 select-none">{emoji}</div>
      {title && (
        <div className="text-[15px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          {title}
        </div>
      )}
      {subtitle && (
        <div className="text-[13px] leading-relaxed max-w-[240px]" style={{ color: 'var(--text-tertiary)' }}>
          {subtitle}
        </div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
