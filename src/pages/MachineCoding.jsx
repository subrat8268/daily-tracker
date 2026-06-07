import { useCallback, useEffect, useState } from 'react';
import { CheckSquare, Square, AlertTriangle, Plus, X } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import useBuildsStore  from '../store/useBuildsStore';
import { MACHINE }      from '../data/machineData';
import { SkillTag }     from '../components/ui/Badge';
import { BuildAccordion } from '../components/ui/BuildAccordion';
import { AddBuildSheet }  from '../components/ui/AddBuildSheet';

// ── Difficulty level colour map ──────────────────────────────────────────────────────────
const LEVEL_COLOR = {
  green: { text: 'var(--success)' },
  amber: { text: 'var(--warning)' },
  red:   { text: 'var(--danger)'  },
};

// Maps MACHINE level string → difficulty key used in builds store
const LEVEL_TO_DIFF = {
  'Easy — Week 1–2':   'easy',
  'Medium — Week 3–6': 'medium',
  'Hard — Week 7–10':  'hard',
};

// ── Filter pills ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'easy',     label: 'Easy' },
  { key: 'medium',   label: 'Medium' },
  { key: 'hard',     label: 'Hard' },
  { key: 'revision', label: '🔁 Revision' },
];

function FilterPills({ active, onChange }) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-4">
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="px-3 py-1 text-[12px] font-medium transition-all duration-150 active:scale-95"
            style={{
              background: isActive ? 'var(--text-primary)' : 'var(--bg-elevated)',
              color:      isActive ? 'var(--text-inverse)' : 'var(--text-secondary)',
              border:     `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function MachineCoding() {
  const mcDone     = useTrackerStore((s) => s.mcDone);
  const toggleMC   = useTrackerStore((s) => s.toggleMC);
  const handleToggle = useCallback((id) => toggleMC(id), [toggleMC]);

  const {
    builds,
    activeFilter,
    setFilter,
    loadBuildsFromCloud,
    getRevisionBuilds,
    getCustomBuilds,
  } = useBuildsStore();

  const [showAddSheet, setShowAddSheet] = useState(false);

  // Boot: load builds from Supabase once
  useEffect(() => { loadBuildsFromCloud(); }, [loadBuildsFromCloud]);

  // ── Decide which preset levels to show based on active filter ────────────────
  const revisionBuilds = getRevisionBuilds();
  const customBuilds   = getCustomBuilds();

  // Group custom builds by difficulty for insertion
  const customByDiff = { easy: [], medium: [], hard: [] };
  customBuilds.forEach((b) => {
    if (customByDiff[b.difficulty]) customByDiff[b.difficulty].push(b);
  });

  // When revision filter active, derive a flat list of preset IDs to highlight
  const revisionPresetIds = new Set(
    revisionBuilds.filter((b) => b.is_preset && b.preset_id).map((b) => b.preset_id)
  );

  // Determine if a preset item passes the current filter
  const presetVisible = (presetId, difficulty) => {
    if (activeFilter === 'all')    return true;
    if (activeFilter === 'revision') return revisionPresetIds.has(presetId);
    return activeFilter === difficulty;
  };

  // Determine if a custom build passes the current filter
  const customVisible = (build) => {
    if (activeFilter === 'all')      return true;
    if (activeFilter === 'revision') return build.is_revision;
    return activeFilter === build.difficulty;
  };

  return (
    <div>
      {/* ── Header row: hint + Add button ───────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-[13px] leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
          Easy → hard. Your two failed interview tasks are marked ⚠️. Rebuild those first, at least 3 times each.
        </p>
        <button
          onClick={() => setShowAddSheet(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold shrink-0 transition-all duration-150 active:scale-95"
          style={{
            background: 'var(--text-primary)',
            color:      'var(--text-inverse)',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <Plus size={13} />
          Add Build
        </button>
      </div>

      {/* ── Filter pills ────────────────────────────────────────────────────────── */}
      <FilterPills active={activeFilter} onChange={setFilter} />

      {/* ── Revision filter: show only flagged builds (preset + custom) ─────── */}
      {activeFilter === 'revision' && revisionBuilds.length === 0 && (
        <div
          className="text-center py-10 text-[13px]"
          style={{ color: 'var(--text-tertiary)' }}
        >
          No builds flagged for revision yet.
          <br />
          <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>
            Open any card vault and hit 🔁 Revise.
          </span>
        </div>
      )}

      {/* ── Roadmap levels ────────────────────────────────────────────────────────── */}
      {MACHINE.map((lvl) => {
        const c    = LEVEL_COLOR[lvl.color] || LEVEL_COLOR.amber;
        const diff = LEVEL_TO_DIFF[lvl.level] || 'medium';

        // Check if any item in this level is visible under current filter
        const anyPresetVisible = lvl.items.some((_, i) => {
          const presetId = `mc-${diff}-${i}`;
          return presetVisible(presetId, diff);
        });
        const anyCustomVisible = customByDiff[diff].some(customVisible);

        if (!anyPresetVisible && !anyCustomVisible) return null;

        return (
          <div key={lvl.level} className="mb-6">
            {/* Level heading */}
            <div
              className="text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{ color: c.text, letterSpacing: '0.07em' }}
            >
              {lvl.level}
            </div>

            {/* ── Preset roadmap items ─────────────────────────────────────── */}
            {lvl.items.map((item, i) => {
              const prefix    = diff;
              const presetId  = `mc-${prefix}-${i}`;
              const done      = !!mcDone[presetId];
              const isWarning = item.t.startsWith('⚠️');
              const isRevision = revisionPresetIds.has(presetId);

              if (!presetVisible(presetId, diff)) return null;

              return (
                <div
                  key={i}
                  className="mb-2 overflow-hidden"
                  style={{
                    background: done
                      ? 'var(--bg-elevated)'
                      : isWarning ? 'var(--warning-surface)' : 'var(--bg-surface)',
                    border: `1px solid ${
                      isRevision  ? 'rgba(230,168,23,0.5)'
                      : done       ? 'var(--border)'
                      : isWarning  ? 'rgba(230,168,23,0.35)'
                      : 'var(--border)'
                    }`,
                    borderRadius: 'var(--radius-card)',
                    boxShadow: done ? 'none' : 'var(--shadow-card)',
                    opacity: done ? 0.55 : 1,
                  }}
                >
                  {/* Checkbox row */}
                  <button
                    onClick={() => handleToggle(presetId)}
                    className="w-full flex gap-3 items-start p-3.5 text-left transition-all duration-150 active:scale-[0.99]"
                    style={{ background: 'transparent' }}
                  >
                    {done
                      ? <CheckSquare   size={18} style={{ color: 'var(--success)',        flexShrink: 0, marginTop: 2 }} />
                      : isWarning
                        ? <AlertTriangle size={18} style={{ color: 'var(--warning)',       flexShrink: 0, marginTop: 2 }} />
                        : <Square        size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
                    }
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-[13px] font-medium leading-snug mb-1.5"
                        style={{
                          color:          done ? 'var(--text-tertiary)' : 'var(--text-primary)',
                          textDecoration: done ? 'line-through' : 'none',
                        }}
                      >
                        {item.t}
                      </div>
                      <div className="flex flex-wrap">
                        {item.s.map((tag) => <SkillTag key={tag} label={tag} />)}
                      </div>
                    </div>
                  </button>

                  {/* Accordion vault */}
                  <BuildAccordion
                    presetId={presetId}
                    title={item.t}
                    difficulty={diff}
                    tags={item.s}
                  />
                </div>
              );
            })}

            {/* ── Custom builds for this difficulty ─────────────────────────────── */}
            {customByDiff[diff].filter(customVisible).map((build) => (
              <div
                key={build.id}
                className="mb-2 overflow-hidden"
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${
                    build.is_revision ? 'rgba(230,168,23,0.5)' : 'var(--border)'
                  }`,
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                {/* Custom build header */}
                <div className="flex gap-3 items-start px-3.5 pt-3.5 pb-2">
                  <div
                    className="w-4 h-4 rounded-sm shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-surface)', border: '1.5px solid var(--accent)', marginTop: 3 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[13px] font-medium leading-snug"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {build.title}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5"
                        style={{
                          background: 'var(--accent-surface)',
                          color: 'var(--accent)',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        Added by you
                      </span>
                    </div>
                    <div className="flex flex-wrap">
                      {(build.tags || []).map((tag) => <SkillTag key={tag} label={tag} />)}
                    </div>
                  </div>
                </div>

                {/* Accordion vault */}
                <BuildAccordion
                  buildId={build.id}
                  title={build.title}
                  difficulty={build.difficulty}
                  tags={build.tags}
                />
              </div>
            ))}
          </div>
        );
      })}

      {/* ── Add Build bottom sheet ───────────────────────────────────────────── */}
      {showAddSheet && (
        <AddBuildSheet onClose={() => setShowAddSheet(false)} />
      )}
    </div>
  );
}
