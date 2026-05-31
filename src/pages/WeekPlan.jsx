import { useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { WEEKS, PHASES } from '../data/weekData';
import { CheckItem } from '../components/ui/CheckItem';
import { Badge } from '../components/ui/Badge';

const PHASE_BADGE = { 1: 'warning', 2: 'accent', 3: 'success' };
const PHASE_TEXT_COLOR = {
  1: 'var(--warning)',
  2: 'var(--accent)',
  3: 'var(--success)',
};
const COL_LABEL_COLOR = {
  dsa: 'var(--success)',
  concept: {
    1: 'var(--warning)',
    2: 'var(--accent)',
    3: 'var(--danger)',
  },
  ui: 'var(--accent)',
};

function WeekCard({ w }) {
  const [open, setOpen]    = useState(false);
  const weekDone           = useTrackerStore((s) => s.weekDone);
  const toggleWeek         = useTrackerStore((s) => s.toggleWeek);

  const handleToggle = useCallback(
    (section, idx) => toggleWeek(`w${w.w}-${section}-${idx}`),
    [toggleWeek, w.w],
  );

  return (
    <div
      className="mb-2 overflow-hidden"
      style={{
        background:   'var(--bg-surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow:    'var(--shadow-card)',
      }}
    >
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-150"
        style={{ background: 'transparent' }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <Badge variant={PHASE_BADGE[w.ph]}>W{w.w}</Badge>
        <span className="flex-1 text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          {w.theme}
        </span>
        {open
          ? <ChevronUp   size={14} style={{ color: 'var(--text-tertiary)' }} />
          : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
        }
      </button>

      {open && (
        <div className="p-4 animate-fade-in" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            {/* DSA col */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2"
                   style={{ color: COL_LABEL_COLOR.dsa, letterSpacing: '0.07em' }}>
                DSA
              </div>
              {w.dsa.map((item, i) => (
                <CheckItem
                  key={i}
                  id={i}
                  label={item}
                  checked={!!weekDone[`w${w.w}-dsa-${i}`]}
                  onToggle={() => handleToggle('dsa', i)}
                />
              ))}
            </div>
            {/* Concept col */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2"
                   style={{ color: COL_LABEL_COLOR.concept[w.ph], letterSpacing: '0.07em' }}>
                {w.cLabel}
              </div>
              {w.concept.map((item, i) => (
                <CheckItem
                  key={i}
                  id={i}
                  label={item}
                  checked={!!weekDone[`w${w.w}-c-${i}`]}
                  onToggle={() => handleToggle('c', i)}
                />
              ))}
            </div>
          </div>

          {/* UI tasks */}
          <div className="mb-3">
            <div className="text-[11px] font-bold uppercase tracking-wider mb-2"
                 style={{ color: COL_LABEL_COLOR.ui, letterSpacing: '0.07em' }}>
              UI / Machine coding tasks
            </div>
            {w.ui.map((item, i) => (
              <CheckItem
                key={i}
                id={i}
                label={item}
                checked={!!weekDone[`w${w.w}-ui-${i}`]}
                onToggle={() => handleToggle('ui', i)}
              />
            ))}
          </div>

          {/* Tip box */}
          <div
            className="p-3 flex gap-2"
            style={{
              background:   'var(--warning-surface)',
              border:       '1px solid rgba(230,168,23,0.3)',
              borderRadius: 'var(--radius-card)',
            }}
          >
            <Lightbulb size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {w.tip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeekPlan() {
  let lastPh = 0;

  return (
    <div>
      <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Click any week to expand. Tap items to track. All progress saves locally.
      </p>
      {WEEKS.map((w) => {
        const phHeader = w.ph !== lastPh ? (
          <div
            key={`ph-${w.ph}`}
            className="text-[11px] font-bold uppercase tracking-wider mb-2 mt-4 first:mt-0"
            style={{ color: PHASE_TEXT_COLOR[w.ph], letterSpacing: '0.07em' }}
          >
            {PHASES[w.ph - 1].name} · {PHASES[w.ph - 1].period} — {PHASES[w.ph - 1].tagline}
          </div>
        ) : null;
        lastPh = w.ph;
        return [phHeader, <WeekCard key={w.w} w={w} />];
      })}
    </div>
  );
}
