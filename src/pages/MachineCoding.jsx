import { useCallback } from 'react';
import { CheckSquare, Square, AlertTriangle } from 'lucide-react';
import useTrackerStore from '../store/useTrackerStore';
import { MACHINE } from '../data/machineData';
import { SkillTag } from '../components/ui/Badge';

const LEVEL_COLOR = {
  green: { text: '#05A357', border: 'rgba(5,163,87,0.25)',   bg: 'rgba(5,163,87,0.06)' },
  amber: { text: '#B8860B', border: 'rgba(255,192,67,0.35)', bg: 'rgba(255,192,67,0.08)' },
  red:   { text: '#E11900', border: 'rgba(225,25,0,0.25)',   bg: 'rgba(225,25,0,0.06)' },
};

export default function MachineCoding() {
  const mcDone   = useTrackerStore((s) => s.mcDone);
  const toggleMC = useTrackerStore((s) => s.toggleMC);
  const handleToggle = useCallback((id) => toggleMC(id), [toggleMC]);

  return (
    <div>
      <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Easy → hard. Your two failed interview tasks are marked ⚠️. Rebuild those first, at least 3 times each.
      </p>

      {MACHINE.map((lvl) => {
        const c = LEVEL_COLOR[lvl.color] || LEVEL_COLOR.amber;
        return (
          <div key={lvl.level} className="mb-6">
            <div
              className="text-[11px] font-bold uppercase tracking-wider mb-2"
              style={{ color: c.text }}
            >
              {lvl.level}
            </div>

            {lvl.items.map((item, i) => {
              const prefix = lvl.level.split(' ')[0].toLowerCase();
              const id = `mc-${prefix}-${i}`;
              const done = !!mcDone[id];
              const isWarning = item.t.startsWith('⚠️');

              return (
                <button
                  key={i}
                  onClick={() => handleToggle(id)}
                  className="w-full flex gap-3 items-start p-3.5 rounded-lg mb-2 text-left transition-all active:scale-95"
                  style={{
                    background: done
                      ? 'var(--bg-elevated)'
                      : isWarning ? 'rgba(255,192,67,0.07)' : 'var(--bg-surface)',
                    border: `1px solid ${
                      done ? 'var(--border)'
                      : isWarning ? 'rgba(255,192,67,0.4)'
                      : 'var(--border)'
                    }`,
                    opacity: done ? 0.5 : 1,
                  }}
                >
                  {done
                    ? <CheckSquare size={18} style={{ color: '#05A357', flexShrink: 0, marginTop: 2 }} />
                    : isWarning
                      ? <AlertTriangle size={18} style={{ color: '#B8860B', flexShrink: 0, marginTop: 2 }} />
                      : <Square size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0, marginTop: 2 }} />
                  }
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-medium leading-snug mb-1.5"
                      style={{
                        color: done ? 'var(--text-tertiary)' : 'var(--text-primary)',
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
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
