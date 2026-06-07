/**
 * AddBuildSheet.jsx
 * Bottom sheet modal to add a new custom machine coding build.
 * Slides up from bottom, matches MoreSheet.jsx pattern exactly.
 *
 * Props:
 *   onClose  — () => void
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import useBuildsStore from '../../store/useBuildsStore';

// ── Difficulty options ──────────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   color: 'var(--success)' },
  { key: 'medium', label: 'Medium', color: 'var(--warning)' },
  { key: 'hard',   label: 'Hard',   color: 'var(--danger)'  },
];

// ── Suggested skill tags (quick-add chips) ───────────────────────────────────────
const SUGGESTED_TAGS = [
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
  'debounce', 'React Router', 'Zustand', 'API', 'CSS',
  'drag-drop', 'filter', 'sort', 'pagination', 'form',
];

export function AddBuildSheet({ onClose }) {
  const { addBuild } = useBuildsStore();

  const [title,      setTitle]      = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [tags,       setTags]       = useState([]);
  const [tagInput,   setTagInput]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  const titleRef = useRef(null);

  // Focus title on open
  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 80);
  }, []);

  // Escape key closes
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Tag helpers ─────────────────────────────────────────────────────────────
  const addTag = useCallback((tag) => {
    const trimmed = tag.trim();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 8) return;
    setTags((prev) => [...prev, trimmed]);
    setTagInput('');
  }, [tags]);

  const removeTag = useCallback((tag) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setSubmitting(true);
    await addBuild({ title: title.trim(), difficulty, tags, status: 'not_started' });
    setSubmitting(false);
    onClose();
  }, [title, difficulty, tags, addBuild, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl animate-slide-up"
        style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.5rem)',
          maxHeight: '92dvh',
          overflowY: 'auto',
        }}
      >
        {/* ── Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            className="w-9 h-1 rounded-full"
            style={{ background: 'var(--border-strong)' }}
          />
        </div>

        <div className="px-5 pt-2 pb-2">
          {/* ── Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                Add New Build
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                It will be placed in the correct difficulty group
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors duration-150"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <X size={18} />
            </button>
          </div>

          {/* ── Title */}
          <div className="mb-4">
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
            >
              Component / Task Title *
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              placeholder="e.g. Infinite scroll with IntersectionObserver"
              className="w-full u-input"
              style={{ padding: '10px 14px' }}
            />
            {error && (
              <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>{error}</p>
            )}
          </div>

          {/* ── Difficulty selector */}
          <div className="mb-4">
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
            >
              Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTIES.map(({ key, label, color }) => {
                const active = difficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key)}
                    className="flex-1 py-2 text-[13px] font-semibold transition-all duration-150 active:scale-95"
                    style={{
                      borderRadius: 'var(--radius-pill)',
                      border: `1.5px solid ${active ? color : 'var(--border)'}`,
                      background: active ? `color-mix(in srgb, ${color} 12%, transparent)` : 'var(--bg-elevated)',
                      color: active ? color : 'var(--text-tertiary)',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tags */}
          <div className="mb-5">
            <label
              className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
            >
              Skills / Tags
              <span className="ml-1 normal-case font-normal" style={{ color: 'var(--text-tertiary)' }}>
                (Enter or comma to add, max 8)
              </span>
            </label>

            {/* Tag input pill box */}
            <div
              className="flex flex-wrap gap-1.5 p-2.5 min-h-[42px] cursor-text"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                borderRadius: 'var(--radius-card)',
              }}
              onClick={() => document.getElementById('tag-input-field')?.focus()}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 text-[12px] font-medium"
                  style={{
                    background: 'var(--accent-surface)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(39,110,241,0.2)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {tag}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                    style={{ color: 'var(--accent)', lineHeight: 1 }}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <input
                id="tag-input-field"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? 'Type a skill tag…' : ''}
                className="flex-1 min-w-[80px] text-[13px] bg-transparent outline-none"
                style={{
                  color: 'var(--text-primary)',
                  caretColor: 'var(--accent)',
                }}
              />
            </div>

            {/* Suggested tag chips */}
            <div className="flex flex-wrap gap-1 mt-2">
              {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).slice(0, 10).map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className="px-2 py-0.5 text-[11px] transition-all duration-100 active:scale-95"
                  style={{
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  + {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit button */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className="w-full py-3 text-[14px] font-semibold transition-all duration-150 active:scale-[0.98]"
            style={{
              background: submitting || !title.trim() ? 'var(--bg-elevated)' : 'var(--text-primary)',
              color:      submitting || !title.trim() ? 'var(--text-tertiary)' : 'var(--text-inverse)',
              borderRadius: 'var(--radius-card)',
              border: 'none',
              cursor: submitting || !title.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Adding…' : 'Add to Roadmap'}
          </button>
        </div>
      </div>
    </>
  );
}
