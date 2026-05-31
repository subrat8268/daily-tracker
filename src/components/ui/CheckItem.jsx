import { useRef } from 'react';

export function CheckItem({ id, label, checked, onToggle }) {
  const ref = useRef(null);

  const handleToggle = () => {
    if (ref.current) {
      ref.current.style.transform = 'scale(0.97)';
      setTimeout(() => { if (ref.current) ref.current.style.transform = ''; }, 120);
    }
    onToggle(id);
  };

  return (
    <div
      ref={ref}
      onClick={handleToggle}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleToggle(); }}
      className="flex gap-3 items-start cursor-pointer select-none py-2 px-2 rounded-lg transition-all duration-100 min-h-[44px]"
      style={{ background: 'transparent' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {/* Uber-style checkbox: 16x16 sharp square */}
      <div
        className="shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: checked ? 'none' : '1.5px solid var(--border-strong)',
          background: checked ? 'var(--text-primary)' : 'transparent',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="var(--text-inverse)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span
        className="text-sm leading-snug"
        style={{
          color: checked ? 'var(--text-tertiary)' : 'var(--text-primary)',
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {label}
      </span>
    </div>
  );
}
