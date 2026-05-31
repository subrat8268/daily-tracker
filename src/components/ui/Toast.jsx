import { useEffect } from 'react';

export function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 2800);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const iconMap = { success: '✓', error: '✕', info: 'i', warning: '!' };
  const colorMap = {
    success: { bg: 'rgba(5,163,87,0.12)',  border: 'rgba(5,163,87,0.3)',   color: '#05A357' },
    error:   { bg: 'rgba(225,25,0,0.10)',  border: 'rgba(225,25,0,0.3)',   color: '#E11900' },
    info:    { bg: 'var(--bg-surface)',     border: 'var(--border)',         color: 'var(--text-secondary)' },
    warning: { bg: 'rgba(255,192,67,0.12)',border: 'rgba(255,192,67,0.4)', color: '#B8860B' },
  };
  const c = colorMap[toast.type] || colorMap.info;

  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        color: 'var(--text-primary)',
        minWidth: 200,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
        style={{ background: c.color, color: '#fff' }}
      >
        {iconMap[toast.type] || 'i'}
      </span>
      {toast.message}
    </div>
  );
}
