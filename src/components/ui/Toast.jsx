import { X } from 'lucide-react';

export function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-sm font-medium
            pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200
            ${t.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${t.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${t.type === 'info' ? 'bg-slate-800 text-white' : ''}
            ${!t.type || t.type === 'default' ? 'bg-slate-800 text-white' : ''}
          `}
        >
          <span>{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-70 hover:opacity-100">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
