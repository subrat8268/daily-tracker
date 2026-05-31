import { useRef } from 'react';
import { Check, Square } from 'lucide-react';

export function CheckItem({ id, label, checked, onToggle }) {
  const ref = useRef(null);

  const handleToggle = () => {
    // Scale animation
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
      className={`flex gap-2.5 items-start cursor-pointer select-none py-1.5 px-2 rounded-lg
        transition-all duration-100 active:scale-95 min-h-[44px]
        ${checked ? 'opacity-50' : 'hover:bg-slate-50'}`}
    >
      {checked
        ? <Check size={15} className="text-green-600 flex-shrink-0 mt-0.5" />
        : <Square size={15} className="text-slate-300 flex-shrink-0 mt-0.5" />
      }
      <span className={`text-sm text-slate-700 leading-snug ${checked ? 'line-through' : ''}`}>
        {label}
      </span>
    </div>
  );
}
