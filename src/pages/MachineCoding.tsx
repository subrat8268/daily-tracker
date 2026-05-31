import React from 'react';
import { Square, SquareCheck } from 'lucide-react';
import { MACHINE } from '../data/machine';
import { SkillTag } from '../components/SkillTag';

interface MachineCodingProps {
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
}

export const MachineCoding: React.FC<MachineCodingProps> = ({ isDone, onToggle }) => {
  return (
    <div id="panel-machine" role="tabpanel" aria-labelledby="tab-machine">
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Easy → hard. Items marked with your actual failed interview questions — rebuild those first, multiple times.
      </p>

      {MACHINE.map((lvl) => {
        const prefix = lvl.level.split(' ')[0].toLowerCase();
        return (
          <div key={lvl.level}>
            <div style={{ fontSize: 12, fontWeight: 600, color: lvl.color, marginBottom: 10, marginTop: 4, letterSpacing: 0.2 }}>
              {lvl.level}
            </div>
            {lvl.items.map((item, i) => {
              const id = `mc-${prefix}-${i}`;
              const done = isDone(id);
              return (
                <div
                  key={i}
                  className={`card machine-card${done ? ' done' : ''}`}
                  onClick={() => onToggle(id)}
                  role="checkbox"
                  aria-checked={done}
                  aria-label={item.t}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggle(id); }}
                >
                  {done
                    ? <SquareCheck className="machine-check" size={18} style={{ color: 'var(--color-text-success)' }} aria-hidden="true" />
                    : <Square className="machine-check" size={18} aria-hidden="true" />
                  }
                  <div>
                    <div className="machine-title">{item.t}</div>
                    <div>
                      {item.s.map((s, si) => <SkillTag key={si} label={s} />)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ marginBottom: 16 }} />
          </div>
        );
      })}
    </div>
  );
};
