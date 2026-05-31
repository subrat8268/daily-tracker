export function Card({ children, className = '', accent = false, accentColor }) {
  return (
    <div
      className={`p-4 mb-3 ${className}`}
      style={{
        background: 'var(--bg-surface)',
        border: accent
          ? `1px solid var(--border)`
          : '1px solid var(--border)',
        borderLeft: accent ? `4px solid ${accentColor || 'var(--accent)'}` : '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {children}
    </div>
  );
}

export function FlatCard({ children, className = '' }) {
  return (
    <div
      className={`p-3 mb-2 ${className}`}
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: 6,
      }}
    >
      {children}
    </div>
  );
}
