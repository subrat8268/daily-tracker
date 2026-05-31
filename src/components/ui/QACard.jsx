import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Badge } from './Badge';

function formatAnswer(text) {
  const parts = text.split(/`([^`]+)`/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '1px 5px',
          fontSize: 11,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
      >
        {part}
      </code>
    ) : part
  );
}

export function QACard({ question, answer, category, difficulty, source, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="mb-2 overflow-hidden animate-slide-up"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <button
        className="w-full text-left px-4 py-3 flex justify-between items-start gap-3 transition-colors duration-150"
        style={{ background: 'transparent' }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span
          className="text-[13px] font-medium leading-snug flex-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {question}
        </span>
        <div className="flex gap-1.5 items-center shrink-0 mt-0.5">
          <Badge variant={category === 'js' ? 'accent' : category === 'dsa' ? 'success' : 'default'}>
            {(category || 'JS').toUpperCase()}
          </Badge>
          <Badge variant={difficulty === 'easy' ? 'success' : difficulty === 'hard' ? 'danger' : 'warning'}>
            {difficulty || 'medium'}
          </Badge>
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded transition-colors duration-150"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-surface)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Delete question"
            >
              <Trash2 size={13} />
            </button>
          )}
          {open
            ? <ChevronUp size={14} style={{ color: 'var(--text-tertiary)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
          }
        </div>
      </button>

      {open && (
        <div
          className="px-4 pb-4 pt-3 animate-fade-in"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
          }}
        >
          {source && (
            <div
              className="text-[11px] font-mono mb-2"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Source: {source}
            </div>
          )}
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {formatAnswer(answer || '')}
          </p>
        </div>
      )}
    </div>
  );
}
