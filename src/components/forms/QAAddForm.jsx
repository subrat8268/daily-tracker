import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import useTrackerStore from '../../store/useTrackerStore';
import { QA_SEED } from '../../data/qaData';

const CATEGORIES  = ['js', 'react', 'dsa', 'css', 'system', 'behavioral'];
const CAT_LABELS  = { js: 'JavaScript', react: 'React', dsa: 'DSA', css: 'CSS', system: 'System', behavioral: 'Behavioral' };
const DIFFICULTIES = ['easy', 'medium', 'hard'];

function FieldLabel({ children }) {
  return (
    <div
      className="text-[11px] font-semibold uppercase tracking-wide mb-1.5"
      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
    >
      {children}
    </div>
  );
}

function ToggleBtn({ value, selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="h-11 px-3 text-sm font-medium transition-all duration-150 active:scale-95"
      style={{
        background:   selected ? 'var(--text-primary)' : 'var(--bg-elevated)',
        color:        selected ? 'var(--text-inverse)' : 'var(--text-secondary)',
        border:       `1px solid ${selected ? 'var(--text-primary)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-card)',
      }}
    >
      {children}
    </button>
  );
}

export function QAAddForm({ onSaved }) {
  const addQA  = useTrackerStore((s) => s.addQA);
  const qaUser = useTrackerStore((s) => s.qaUser);
  const [cat,  setCat]  = useState('js');
  const [diff, setDiff] = useState('medium');
  const qRef   = useRef();
  const aRef   = useRef();
  const srcRef = useRef();

  const handleSave = () => {
    const q = qRef.current?.value?.trim();
    if (!q) { onSaved?.('Add a question first', 'error'); return; }
    addQA({
      q,
      a:     aRef.current?.value   || '(answer not added yet)',
      src:   srcRef.current?.value || '',
      cat,
      diff,
      added: new Date().toLocaleDateString('en-IN'),
    });
    qRef.current.value  = '';
    aRef.current.value  = '';
    if (srcRef.current) srcRef.current.value = '';
    onSaved?.('Question saved! 📚', 'success');
  };

  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify({ builtin: QA_SEED, user: qaUser }, null, 2)],
      { type: 'application/json' },
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subrat_qa_bank.json';
    a.click();
  };

  return (
    <div
      className="p-4 mb-4"
      style={{
        background:   'var(--bg-elevated)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <h3
        className="text-sm font-semibold mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        + Add from LinkedIn / blog / interview
      </h3>

      <div className="mb-3">
        <FieldLabel>Question</FieldLabel>
        <input
          ref={qRef}
          defaultValue=""
          placeholder="e.g. What is the difference between var, let, const?"
          className="u-input w-full h-12 px-3"
        />
      </div>

      <div className="mb-3">
        <FieldLabel>Category</FieldLabel>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <ToggleBtn key={c} value={c} selected={cat === c} onClick={setCat}>
              {CAT_LABELS[c] || c}
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <FieldLabel>Difficulty</FieldLabel>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <ToggleBtn key={d} value={d} selected={diff === d} onClick={setDiff}>
              <span className="capitalize">{d}</span>
            </ToggleBtn>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <FieldLabel>Source (optional)</FieldLabel>
        <input
          ref={srcRef}
          defaultValue=""
          placeholder="e.g. LinkedIn — Prateek Narang post"
          className="u-input w-full h-12 px-3"
        />
      </div>

      <div className="mb-4">
        <FieldLabel>Your answer / key points</FieldLabel>
        <textarea
          ref={aRef}
          defaultValue=""
          rows={3}
          placeholder="Write your answer in your own words. Can be rough — you'll refine it as you learn."
          className="u-input w-full px-3 py-2.5 text-sm resize-none"
          style={{ lineHeight: 1.6 }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 h-11 font-semibold text-sm transition-all duration-150 active:scale-[0.98]"
          style={{
            background:   'var(--text-primary)',
            color:        'var(--text-inverse)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          Save to Q&amp;A bank
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="h-11 px-4 text-sm flex items-center gap-1.5 transition-colors duration-150"
          style={{
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius-card)',
            color:        'var(--text-secondary)',
            background:   'transparent',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
