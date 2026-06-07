/**
 * BuildAccordion.jsx
 * Expandable code vault panel that attaches below every machine coding card.
 * Works for both preset roadmap items and user-added custom builds.
 *
 * Props:
 *   presetId    — string | null  (e.g. 'mc-easy-0') for preset cards
 *   buildId     — string | null  for already-saved custom builds
 *   title       — string         card title (used for ensurePresetBuild)
 *   difficulty  — 'easy'|'medium'|'hard'
 *   tags        — string[]
 */
import { useState, useCallback, useRef } from 'react';
import {
  ChevronDown, ChevronUp,
  Copy, Check,
  RotateCcw, Pencil, Save, Trash2,
} from 'lucide-react';
import { Badge } from './Badge';
import useBuildsStore from '../../store/useBuildsStore';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  not_started: { label: 'Not Started', variant: 'default' },
  in_progress:  { label: 'In Progress', variant: 'warning' },
  done:         { label: 'Done',        variant: 'success' },
  revision:     { label: 'Revision',    variant: 'danger'  },
};

const STATUS_CYCLE = ['not_started', 'in_progress', 'done', 'revision'];

// ── Attempt badge ─────────────────────────────────────────────────────────────
function AttemptBadge({ count }) {
  if (!count || count === 0) return null;
  return (
    <span
      className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold"
      style={{
        background: 'var(--accent-surface)',
        color: 'var(--accent)',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      ×{count}
    </span>
  );
}

// ── Copy button with check flash ──────────────────────────────────────────────
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!text?.trim()) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy code'}
      className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-all duration-150"
      style={{
        background: copied ? 'var(--success-surface)' : 'var(--bg-overlay)',
        color: copied ? 'var(--success)' : 'var(--text-secondary)',
        border: `1px solid ${copied ? 'rgba(5,163,87,0.25)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BuildAccordion({ presetId, buildId, title, difficulty, tags }) {
  const {
    builds,
    expandedId,
    setExpanded,
    ensurePresetBuild,
    saveBuild,
    toggleRevision,
    setStatus,
    removeBuild,
    getBuildByPresetId,
    getBuildById,
  } = useBuildsStore();

  // Derive the current build from store
  const build = presetId
    ? getBuildByPresetId(presetId)
    : buildId ? getBuildById(buildId) : null;

  // Stable accordion ID — either preset id or build id
  const accordionKey = presetId ?? buildId ?? 'none';
  const isOpen = expandedId === accordionKey;

  // Local edit state
  const [editMode, setEditMode] = useState(false);
  const [draftCode, setDraftCode]   = useState('');
  const [draftNotes, setDraftNotes] = useState('');
  const [draftAttempts, setDraftAttempts] = useState(1);
  const [saving, setSaving] = useState(false);
  const codeRef = useRef(null);

  // ── Open accordion ───────────────────────────────────────────────────────
  const handleOpen = useCallback(async () => {
    if (isOpen) {
      // Close — if in edit mode, discard
      setEditMode(false);
      setExpanded(accordionKey);
      return;
    }

    setExpanded(accordionKey);

    // Lazy-create DB row for preset items on first open
    if (presetId && !build) {
      await ensurePresetBuild(presetId, title, difficulty, tags);
    }
  }, [isOpen, accordionKey, presetId, build, ensurePresetBuild, setExpanded, title, difficulty, tags]);

  // ── Enter edit mode ──────────────────────────────────────────────────────
  const enterEdit = useCallback(() => {
    setDraftCode(build?.code ?? '');
    setDraftNotes(build?.notes ?? '');
    setDraftAttempts(build?.attempt_no ?? 1);
    setEditMode(true);
    // Focus the code area after paint
    setTimeout(() => codeRef.current?.focus(), 50);
  }, [build]);

  // ── Save edits ───────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!build) return;
    setSaving(true);
    await saveBuild({
      ...build,
      code:       draftCode,
      notes:      draftNotes,
      attempt_no: Number(draftAttempts),
    });
    setSaving(false);
    setEditMode(false);
  }, [build, draftCode, draftNotes, draftAttempts, saveBuild]);

  // ── Cycle status ─────────────────────────────────────────────────────────
  const handleCycleStatus = useCallback(async (e) => {
    e.stopPropagation();
    if (!build) return;
    const idx = STATUS_CYCLE.indexOf(build.status ?? 'not_started');
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    await setStatus(build.id, next);
  }, [build, setStatus]);

  // ── Toggle revision ──────────────────────────────────────────────────────
  const handleRevision = useCallback(async (e) => {
    e.stopPropagation();
    if (!build) return;
    await toggleRevision(build.id);
  }, [build, toggleRevision]);

  // ── Delete (custom builds only) ──────────────────────────────────────────
  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    if (!build || build.is_preset) return;
    await removeBuild(build.id);
  }, [build, removeBuild]);

  const statusCfg = STATUS_CONFIG[build?.status ?? 'not_started'];

  return (
    <div
      className="overflow-hidden"
      style={{
        borderTop: isOpen ? '1px solid var(--border)' : 'none',
        marginTop: isOpen ? 0 : -1,
      }}
    >
      {/* ── Accordion trigger strip ──────────────────────────────────────── */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center gap-2 px-3.5 py-2 transition-colors duration-150"
        style={{
          background: isOpen ? 'var(--bg-elevated)' : 'transparent',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Status badge — click cycles it */}
        <span
          role="button"
          onClick={handleCycleStatus}
          className="transition-opacity duration-100 hover:opacity-70 active:scale-95"
          title="Click to cycle status"
        >
          <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
        </span>

        {/* Attempt count */}
        {build && <AttemptBadge count={build.attempt_no} />}

        {/* Revision flag */}
        {build?.is_revision && (
          <span
            className="text-[11px] font-semibold"
            style={{ color: 'var(--warning)', letterSpacing: '0.02em' }}
          >
            🔁 Revision
          </span>
        )}

        <span className="flex-1" />

        <span
          className="text-[11px] font-medium"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {isOpen ? 'Close vault' : 'Open vault'}
        </span>
        {isOpen
          ? <ChevronUp  size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          : <ChevronDown size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
        }
      </button>

      {/* ── Accordion body ───────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="animate-slide-up"
          style={{
            background: 'var(--bg-elevated)',
            borderTop: '1px solid var(--border)',
            padding: '14px 14px 16px',
          }}
        >
          {/* ── Action row ──────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {!editMode ? (
              <button
                onClick={enterEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: 'var(--accent-surface)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(39,110,241,0.2)',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <Pencil size={11} />
                {build?.code ? 'Edit Code' : 'Add Code'}
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: saving ? 'var(--bg-overlay)' : 'var(--success-surface)',
                  color: saving ? 'var(--text-tertiary)' : 'var(--success)',
                  border: `1px solid ${saving ? 'var(--border)' : 'rgba(5,163,87,0.25)'}`,
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                <Save size={11} />
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}

            {/* Copy button only when there's code and not in edit mode */}
            {!editMode && build?.code && <CopyButton text={build.code} />}

            {/* Revision toggle */}
            <button
              onClick={handleRevision}
              title={build?.is_revision ? 'Remove revision flag' : 'Mark for revision'}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium transition-all duration-150"
              style={{
                background: build?.is_revision ? 'var(--warning-surface)' : 'var(--bg-overlay)',
                color: build?.is_revision ? 'var(--warning)' : 'var(--text-tertiary)',
                border: `1px solid ${build?.is_revision ? 'rgba(230,168,23,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-pill)',
              }}
            >
              <RotateCcw size={11} />
              {build?.is_revision ? 'Flagged' : 'Revise'}
            </button>

            {/* Attempt counter — only in edit mode */}
            {editMode && (
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Attempts</span>
                <input
                  type="number"
                  min={0}
                  max={99}
                  value={draftAttempts}
                  onChange={(e) => setDraftAttempts(e.target.value)}
                  className="w-12 text-center text-[12px] font-semibold py-1 u-input"
                  style={{ borderRadius: 'var(--radius-sm)', padding: '3px 6px' }}
                />
              </div>
            )}

            {/* Delete — only for custom builds, not preset */}
            {!editMode && build && !build.is_preset && (
              <button
                onClick={handleDelete}
                title="Delete this build"
                className="ml-auto flex items-center gap-1 px-2 py-1 text-[11px] transition-all duration-150"
                style={{
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-pill)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.borderColor = 'rgba(225,25,0,0.3)'; e.currentTarget.style.background = 'var(--danger-surface)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Trash2 size={11} />
                Delete
              </button>
            )}
          </div>

          {/* ── Code area ───────────────────────────────────────────────── */}
          <div className="mb-3">
            <div
              className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
            >
              Code
            </div>
            {editMode ? (
              <textarea
                ref={codeRef}
                value={draftCode}
                onChange={(e) => setDraftCode(e.target.value)}
                placeholder="// Paste or write your JSX / JS solution here…"
                rows={10}
                className="w-full text-[12px] leading-relaxed resize-y u-input"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  padding: '10px 12px',
                  minHeight: 160,
                  tabSize: 2,
                }}
                onKeyDown={(e) => {
                  // Tab key inserts 2 spaces instead of shifting focus
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const s = e.target.selectionStart;
                    const v = e.target.value;
                    setDraftCode(v.slice(0, s) + '  ' + v.slice(e.target.selectionEnd));
                    // Restore cursor after state update
                    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
                  }
                }}
              />
            ) : (
              <pre
                className="text-[12px] leading-relaxed overflow-x-auto"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  color: build?.code ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  minHeight: 56,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {build?.code?.trim() || '// No code saved yet. Click "Add Code" to start.'}
              </pre>
            )}
          </div>

          {/* ── Notes area ──────────────────────────────────────────────── */}
          <div>
            <div
              className="text-[11px] font-semibold uppercase tracking-wider mb-1.5"
              style={{ color: 'var(--text-tertiary)', letterSpacing: '0.07em' }}
            >
              Notes
            </div>
            {editMode ? (
              <textarea
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder="What did you learn? What broke? Edge cases…"
                rows={3}
                className="w-full text-[13px] leading-relaxed resize-y u-input"
                style={{ padding: '10px 12px', minHeight: 72 }}
              />
            ) : (
              <p
                className="text-[13px] leading-relaxed"
                style={{
                  color: build?.notes ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  minHeight: 40,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {build?.notes?.trim() || 'No notes yet.'}
              </p>
            )}
          </div>

          {/* ── Footer: last updated ─────────────────────────────────────── */}
          {build?.updated_at && !editMode && (
            <div
              className="mt-3 text-[11px]"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Last saved{' '}
              {new Date(build.updated_at).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
