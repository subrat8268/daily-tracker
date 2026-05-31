import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import useTrackerStore from '../../store/useTrackerStore';
import { QA_SEED } from '../../data/qaData';

const CATEGORIES = ['js', 'react', 'dsa', 'css', 'system', 'behavioral'];
const CAT_LABELS = { js: 'JavaScript', react: 'React', dsa: 'DSA', css: 'CSS', system: 'System', behavioral: 'Behavioral' };
const DIFFICULTIES = ['easy', 'medium', 'hard'];

function CatBtn({ value, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`h-11 px-3 rounded-xl text-sm font-medium border transition-all
        ${selected ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
    >
      {CAT_LABELS[value] || value}
    </button>
  );
}

export function QAAddForm({ onSaved }) {
  const addQA = useTrackerStore((s) => s.addQA);
  const qaUser = useTrackerStore((s) => s.qaUser);
  const [cat, setCat] = useState('js');
  const [diff, setDiff] = useState('medium');
  const qRef = useRef();
  const aRef = useRef();
  const srcRef = useRef();

  const handleSave = () => {
    const q = qRef.current?.value?.trim();
    if (!q) { onSaved?.('Add a question first', 'error'); return; }
    addQA({
      q,
      a: aRef.current?.value || '(answer not added yet)',
      src: srcRef.current?.value || '',
      cat,
      diff,
      added: new Date().toLocaleDateString('en-IN'),
    });
    qRef.current.value = '';
    aRef.current.value = '';
    if (srcRef.current) srcRef.current.value = '';
    onSaved?.('Question saved! 📚', 'success');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ builtin: QA_SEED, user: qaUser }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subrat_qa_bank.json';
    a.click();
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">+ Add from LinkedIn / blog / interview</h3>

      <div className="mb-3">
        <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Question</label>
        <input
          ref={qRef}
          defaultValue=""
          placeholder="e.g. What is the difference between var, let, const?"
          className="w-full h-12 border border-slate-200 rounded-xl px-3 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      <div className="mb-3">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Category</div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => <CatBtn key={c} value={c} selected={cat === c} onClick={setCat} />)}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Difficulty</div>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDiff(d)}
              className={`h-11 px-4 rounded-xl text-sm font-medium border transition-all capitalize
                ${diff === d ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Source (optional)</label>
        <input
          ref={srcRef}
          defaultValue=""
          placeholder="e.g. LinkedIn — Prateek Narang post"
          className="w-full h-12 border border-slate-200 rounded-xl px-3 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1.5">Your answer / key points</label>
        <textarea
          ref={aRef}
          defaultValue=""
          rows={3}
          placeholder="Write your answer in your own words. Can be rough — you'll refine it as you learn."
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:border-blue-400 transition-colors resize-none"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 active:scale-95 transition-all"
        >
          Save to Q&amp;A bank
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
        >
          <Download size={14} /> Export
        </button>
      </div>
    </div>
  );
}
