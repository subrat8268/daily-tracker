/**
 * AddBuildSheet.jsx
 * Mobile  → bottom sheet (slides up, drag handle, safe-area aware)
 * Desktop → centred modal (max-w-lg, rounded-2xl, backdrop blur)
 *
 * The form JSX is extracted into <BuildForm> so both containers share
 * identical markup. Only the wrapper changes.
 *
 * Props:
 *   onClose  — () => void
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import useBuildsStore from '../../store/useBuildsStore';

// ── Breakpoint hook ──────────────────────────────────────────────────────────
// Matches Tailwind's md: breakpoint (768 px) used in AppShell
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return mobile;
}

// ── Static data ──────────────────────────────────────────────────────────────
const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   color: 'var(--success)' },
  { key: 'medium', label: 'Medium', color: 'var(--warning)' },
  { key: 'hard',   label: 'Hard',   color: 'var(--danger)'  },
];

const SUGGESTED_TAGS = [
  'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback',
  'debounce', 'React Router', 'Zustand', 'API', 'CSS',
  'drag-drop', 'filter', 'sort', 'pagination', 'form',
];

// ── Shared form body ─────────────────────────────────────────────────────────
function BuildForm({ onClose, isMobile }) {
  const { addBuild } = useBuildsStore();

  const [title,      setTitle]      = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [tags,       setTags]       = useState([]);
  const [tagInput,   setTagInput]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const titleRef = useRef(null);

  useEffect(() => { setTimeout(() => titleRef.current?.focus(), 80); }, []);

  // ── Tag helpers ────────────────────────────────────────────────────────────
  const addTag = useCallback((tag) => {
    const t = tag.trim();
    if (!t || tags.includes(t) || tags.length >= 8) return;
    setTags((p) => [...p, t]);
    setTagInput('');
  }, [tags]);

  const removeTag = useCallback((tag) => setTags((p) => p.filter((t) => t !== tag)), []);

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault(); addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags((p) => p.slice(0, -1));
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

  const canSubmit = !submitting && !!title.trim();

  return (
    <div className="px-5 pt-2 pb-2">
      {/* ── Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            Add New Build
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Placed in the correct difficulty group automatically
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg transition-colors duration-150"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Title ─────────────────────────────────────────────────────────── */}
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
        {error && <p className="text-[12px] mt-1" style={{ color: 'var(--danger)' }}>{error}</p>}
      </div>

      {/* ── Difficulty ────────────────────────────────────────────────────── */}
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
                  background: active
                    ? `color-mix(in srgb, ${color} 12%, transparent)`
                    : 'var(--bg-elevated)',
                  color: active ? color : 'var(--text-tertiary)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tags ──────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <label
          className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5"
          style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
        >
          Skills / Tags
          <span className="ml-1 normal-case font-normal" style={{ color: 'var(--text-tertiary)' }}>
            (Enter or , to add · max 8)
          </span>
        </label>

        {/* Pill input box */}
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
                aria-label={`Remove ${tag}`}
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
            style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
          />
        </div>

        {/* Suggested chips */}
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

      {/* ── Submit ────────────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3 text-[14px] font-semibold transition-all duration-150 active:scale-[0.98]"
        style={{
          background: canSubmit ? 'var(--text-primary)' : 'var(--bg-elevated)',
          color:      canSubmit ? 'var(--text-inverse)' : 'var(--text-tertiary)',
          borderRadius: 'var(--radius-card)',
          border: 'none',
          cursor: canSubmit ? 'pointer' : 'not-allowed',
        }}
      >
        {submitting ? 'Adding…' : 'Add to Roadmap'}
      </button>
    </div>
  );
}

// ── Root export ──────────────────────────────────────────────────────────────
export function AddBuildSheet({ onClose }) {
  const isMobile = useIsMobile();

  // Escape key always closes
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* ── Shared backdrop ─────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {isMobile ? (
        /* ── MOBILE: bottom sheet ───────────────────────────────────────── */
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
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full" style={{ background: 'var(--border-strong)' }} />
          </div>

          <BuildForm onClose={onClose} isMobile={true} />
        </div>

      ) : (

        /* ── DESKTOP: centred modal ─────────────────────────────────────── */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="w-full animate-slide-up"
            style={{
              maxWidth: 520,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow: 'var(--shadow-elevated)',
              maxHeight: '90vh',
              overflowY: 'auto',
              paddingTop: '1.25rem',
              paddingBottom: '1.5rem',
            }}
            // Prevent backdrop click from propagating through the modal
            onClick={(e) => e.stopPropagation()}
          >
            <BuildForm onClose={onClose} isMobile={false} />
          </div>
        </div>
      )}
    </>
  );
}
