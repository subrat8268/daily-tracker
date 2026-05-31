export function Card({ children, className = '', accent = false, accentColor = 'border-slate-200' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 mb-3 shadow-sm
      ${accent ? `border-l-4 ${accentColor}` : ''}
      ${className}`}>
      {children}
    </div>
  );
}

export function FlatCard({ children, className = '' }) {
  return (
    <div className={`bg-slate-50 rounded-xl p-3 mb-2 ${className}`}>
      {children}
    </div>
  );
}
