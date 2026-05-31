import { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { NAMASTE_SECTIONS } from '../data/namasteData';
import { ProgressBar } from '../components/ui/ProgressBar';

// State → token mapping using CSS vars
const STATE_STYLE = {
  none: {
    bg:     'var(--bg-surface)',
    border: 'var(--border)',
    text:   'var(--text-primary)',
    sub:    'var(--text-tertiary)',
    dot:    'var(--border-strong)',
    label:  'not started',
  },
  wip: {
    bg:     'var(--status-wip-bg)',
    border: 'var(--status-wip-dot)',
    text:   'var(--status-wip-text)',
    sub:    'var(--status-wip-text)',
    dot:    'var(--status-wip-dot)',
    label:  'watching…',
  },
  done: {
    bg:     'var(--status-done-bg)',
    border: 'var(--status-done-dot)',
    text:   'var(--status-done-text)',
    sub:    'var(--status-done-text)',
    dot:    'var(--status-done-dot)',
    label:  '✓ done',
  },
};

function Section({ sec, nsDone, onCycle }) {
  const [open, setOpen] = useState(false);

  const { doneCount, totalCount } = useMemo(() => {
    let doneCount = 0;
    sec.topics.forEach((topic) => {
      if ((nsDone[`ns_${sec.section}_${topic}`] || 'none') === 'done') doneCount++;
    });
    return { doneCount, totalCount: sec.topics.length };
  }, [sec, nsDone]);

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
        className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150"
        style={{ background: 'transparent' }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="text-left">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            {sec.section}
          </span>
          <span className="text-[11px] ml-2" style={{ color: 'var(--text-tertiary)' }}>
            {doneCount}/{totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-16">
            <ProgressBar pct={totalCount > 0 ? Math.round(doneCount / totalCount * 100) : 0} />
          </div>
          {open
            ? <ChevronUp  size={14} style={{ color: 'var(--text-tertiary)' }} />
            : <ChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
          }
        </div>
      </button>

      {open && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 animate-fade-in"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {sec.topics.map((topic) => {
            const key   = `ns_${sec.section}_${topic}`;
            const state = nsDone[key] || 'none';
            const s     = STATE_STYLE[state];
            return (
              <button
                key={topic}
                onClick={() => onCycle(key)}
                className="relative p-2.5 text-left transition-all duration-150 active:scale-95"
                style={{
                  background:   s.bg,
                  border:       `1px solid ${s.border}`,
                  borderRadius: 'var(--radius-card)',
                }}
              >
                {/* State dot */}
                <div
                  className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full"
                  style={{ background: s.dot }}
                />
                <div
                  className="text-[11px] font-medium pr-4 leading-tight"
                  style={{ color: s.text }}
                >
                  {topic}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: s.sub }}>
                  {s.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NamasteDev() {
  const nsDone  = useTrackerStore((s) => s.nsDone);
  const cycleNS = useTrackerStore((s) => s.cycleNS);

  const { totalDone, totalTopics } = useMemo(() => {
    let totalDone = 0, totalTopics = 0;
    NAMASTE_SECTIONS.forEach((sec) => {
      sec.topics.forEach((topic) => {
        totalTopics++;
        if ((nsDone[`ns_${sec.section}_${topic}`] || 'none') === 'done') totalDone++;
      });
    });
    return { totalDone, totalTopics };
  }, [nsDone]);

  const handleCycle = useCallback((key) => cycleNS(key), [cycleNS]);
  const pct = totalTopics > 0 ? Math.round(totalDone / totalTopics * 100) : 0;

  return (
    <div>
      <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Tap once = <span style={{ color: 'var(--status-wip-text)', fontWeight: 600 }}>watching</span>,
        twice = <span style={{ color: 'var(--status-done-text)', fontWeight: 600 }}>done</span>, three times = reset.
      </p>

      {/* Sticky progress bar */}
      <div
        className="sticky top-0 z-10 py-2.5 -mx-4 px-4 mb-3"
        style={{
          background:   'var(--bg-base)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide shrink-0" style={{ color: 'var(--text-tertiary)' }}>
            Progress
          </span>
          <ProgressBar pct={pct} label={`${totalDone}/${totalTopics} — ${pct}%`} className="flex-1" />
        </div>
      </div>

      {NAMASTE_SECTIONS.map((sec) => (
        <Section key={sec.section} sec={sec} nsDone={nsDone} onCycle={handleCycle} />
      ))}
    </div>
  );
}
