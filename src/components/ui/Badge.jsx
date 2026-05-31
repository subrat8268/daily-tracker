// Uber-style badge — pill shape, token colours
export function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: { background: 'var(--bg-elevated)', color: 'var(--text-secondary)' },
    success: { background: 'rgba(5,163,87,0.12)', color: '#05A357' },
    warning: { background: 'rgba(255,192,67,0.15)', color: '#B8860B' },
    danger:  { background: 'rgba(225,25,0,0.1)',   color: '#E11900' },
    accent:  { background: 'rgba(39,110,241,0.12)', color: '#276EF1' },
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold ${className}`}
      style={{ ...styles[variant] || styles.default, borderRadius: 'var(--radius-pill)' }}
    >
      {children}
    </span>
  );
}
