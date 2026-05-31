import React from 'react';
import { Square, SquareCheck } from 'lucide-react';

interface CheckItemProps {
  id: string;
  label: string;
  isDone: boolean;
  onToggle: (id: string) => void;
}

export const CheckItem: React.FC<CheckItemProps> = ({ id, label, isDone, onToggle }) => {
  return (
    <div
      className={`check-item${isDone ? ' done' : ''}`}
      onClick={() => onToggle(id)}
      role="checkbox"
      aria-checked={isDone}
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggle(id); }}
    >
      {isDone
        ? <SquareCheck className="check-icon" size={16} aria-hidden="true" />
        : <Square className="check-icon" size={16} aria-hidden="true" />
      }
      <span>{label}</span>
    </div>
  );
};
