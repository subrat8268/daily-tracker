import { useState, useMemo } from 'react';
import useTrackerStore from '../store/useTrackerStore';
import { QA_SEED } from '../data/qaData';
import { QACard } from '../components/ui/QACard';
import { QAAddForm } from '../components/forms/QAAddForm';
import { useAppToast } from '../components/layout/AppShell';

const FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'js',         label: 'JavaScript' },
  { key: 'react',      label: 'React' },
  { key: 'dsa',        label: 'DSA' },
  { key: 'css',        label: 'CSS' },
  { key: 'system',     label: 'System' },
  { key: 'behavioral', label: 'Behavioral' },
];

function SectionLabel({ children }) {
  return (
    <div
      className="text-[11px] font-bold uppercase tracking-wider mb-2"
      style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
    >
      {children}
    </div>
  );
}

export default function QABank() {
  const [filter, setFilter] = useState('all');
  const qaUser  = useTrackerStore((s) => s.qaUser);
  const deleteQA = useTrackerStore((s) => s.deleteQA);
  const addToast = useAppToast();

  const filteredSeed = useMemo(
    () => filter === 'all' ? QA_SEED : QA_SEED.filter((q) => q.cat === filter),
    [filter],
  );
  const filteredUser = useMemo(
    () => filter === 'all' ? qaUser : qaUser.filter((q) => q.cat === filter),
    [filter, qaUser],
  );

  return (
    <div>
      <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Your last-minute revision sheet. Save questions from LinkedIn, blogs, interviews.
        Study from here the night before any interview.
      </p>

      <QAAddForm onSaved={(msg, type) => addToast?.(msg, type)} />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-3.5 py-1.5 text-[12px] font-medium whitespace-nowrap transition-all duration-150 shrink-0"
            style={{
              borderRadius: 'var(--radius-pill)',
              background:   filter === key ? 'var(--text-primary)'  : 'var(--bg-surface)',
              color:        filter === key ? 'var(--text-inverse)'  : 'var(--text-secondary)',
              border:       `1px solid ${filter === key ? 'var(--text-primary)' : 'var(--border)'}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count line */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
          {qaUser.length} question{qaUser.length !== 1 ? 's' : ''} saved by you
        </span>
      </div>

      {/* Built-in */}
      <SectionLabel>Built-in — from recent interviews &amp; blogs</SectionLabel>
      {filteredSeed.map((q, i) => (
        <QACard
          key={`seed-${i}`}
          question={q.q}
          answer={q.a}
          category={q.cat}
          difficulty={q.diff}
          source={q.src}
        />
      ))}

      {/* User-added */}
      {qaUser.length > 0 && (
        <>
          <SectionLabel>Your saved questions</SectionLabel>
          {filteredUser.map((q, i) => {
            const actualIdx = qaUser.indexOf(q);
            return (
              <QACard
                key={`user-${i}`}
                question={q.q}
                answer={q.a}
                category={q.cat}
                difficulty={q.diff}
                source={q.src}
                onDelete={() => { deleteQA(actualIdx); addToast?.('Question deleted', 'info'); }}
              />
            );
          })}
        </>
      )}

      {filteredSeed.length === 0 && filteredUser.length === 0 && (
        <p className="text-[13px] text-center py-8" style={{ color: 'var(--text-tertiary)' }}>
          No questions in this category yet.
        </p>
      )}
    </div>
  );
}
