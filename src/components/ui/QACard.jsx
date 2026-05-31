import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Badge } from './Badge';

function formatAnswer(text) {
  // Replace backtick code with styled spans
  const parts = text.split(/`([^`]+)`/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <code key={i} className="bg-slate-100 border border-slate-200 px-1 py-0.5 rounded text-[11px] font-mono text-slate-800">{part}</code>
      : part
  );
}

export function QACard({ question, answer, category, difficulty, source, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl mb-2 overflow-hidden">
      <button
        className="w-full text-left px-4 py-3 flex justify-between items-start gap-3 hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-[13px] font-medium text-slate-800 leading-snug flex-1">{question}</span>
        <div className="flex gap-1.5 items-center flex-shrink-0 mt-0.5">
          <Badge label={category?.toUpperCase() || 'JS'} color={category || 'js'} />
          <Badge label={difficulty || 'medium'} color={difficulty || 'medium'} />
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
              aria-label="Delete question"
            >
              <Trash2 size={13} />
            </button>
          )}
          {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
          {source && (
            <div className="text-[11px] text-slate-400 font-mono mb-2">Source: {source}</div>
          )}
          <p className="text-[13px] text-slate-600 leading-relaxed">
            {formatAnswer(answer || '')}
          </p>
        </div>
      )}
    </div>
  );
}
