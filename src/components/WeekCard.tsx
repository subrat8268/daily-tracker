import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Week } from '../data/weeks';
import { Phase } from '../data/phases';
import { CheckItem } from './CheckItem';

interface WeekCardProps {
  week: Week;
  phase: Phase;
  isDone: (id: string) => boolean;
  onToggle: (id: string) => void;
}

const conceptColor = (ph: number) => {
  if (ph === 1) return 'var(--color-text-warning)';
  if (ph === 2) return 'var(--color-text-info)';
  return 'var(--color-text-danger)';
};

export const WeekCard: React.FC<WeekCardProps> = ({ week, phase, isDone, onToggle }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="week-card">
      <button
        className="week-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        id={`week-toggle-${week.w}`}
      >
        <span
          className="badge"
          style={{ background: phase.bg, color: phase.color, flexShrink: 0 }}
        >
          W{week.w}
        </span>
        <span className="week-toggle-title">{week.theme}</span>
        {open
          ? <ChevronUp size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} aria-hidden="true" />
          : <ChevronDown size={14} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} aria-hidden="true" />
        }
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="week-body">
              <div className="week-grid">
                {/* DSA Column */}
                <div>
                  <div className="section-label" style={{ color: 'var(--color-text-success)' }}>DSA</div>
                  {week.dsa.map((d, i) => (
                    <CheckItem
                      key={i}
                      id={`w${week.w}-dsa-${i}`}
                      label={d}
                      isDone={isDone(`w${week.w}-dsa-${i}`)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>

                {/* Concepts Column */}
                <div>
                  <div className="section-label" style={{ color: conceptColor(week.ph) }}>{week.cLabel}</div>
                  {week.concept.map((c, i) => (
                    <CheckItem
                      key={i}
                      id={`w${week.w}-c-${i}`}
                      label={c}
                      isDone={isDone(`w${week.w}-c-${i}`)}
                      onToggle={onToggle}
                    />
                  ))}
                </div>
              </div>

              {/* UI Tasks */}
              <div>
                <div className="section-label" style={{ color: 'var(--color-text-info)' }}>UI tasks</div>
                {week.ui.map((u, i) => (
                  <CheckItem
                    key={i}
                    id={`w${week.w}-ui-${i}`}
                    label={u}
                    isDone={isDone(`w${week.w}-ui-${i}`)}
                    onToggle={onToggle}
                  />
                ))}
              </div>

              {/* Tip */}
              <div className="tip-box">
                <Lightbulb size={14} aria-hidden="true" />
                <span>{week.tip}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
