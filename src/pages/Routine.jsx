import {
  Sunrise, Dumbbell, Coffee, Brain, Smartphone,
  Calculator, Mic, NotebookPen, UtensilsCrossed, Moon,
} from 'lucide-react';
import { DAILY_BLOCKS } from '../data/routineData';
import { Card } from '../components/ui/Card';

const ICON_MAP = {
  Sunrise, Dumbbell, Coffee, Brain, Smartphone,
  Calculator, Mic, NotebookPen, UtensilsCrossed, Moon,
};

// Map color names → CSS token values
const LINE_BG = {
  amber: 'var(--warning)',
  green: 'var(--success)',
  blue:  'var(--accent)',
  slate: 'var(--border-strong)',
};
const ICON_COLOR = {
  amber: 'var(--warning)',
  green: 'var(--success)',
  blue:  'var(--accent)',
  slate: 'var(--text-tertiary)',
};

export default function Routine() {
  return (
    <div>
      {/* Alert banner */}
      <div
        className="p-4 mb-4"
        style={{
          background:   'var(--warning-surface)',
          border:       '1px solid rgba(230,168,23,0.3)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <div className="text-[13px] font-semibold mb-1" style={{ color: 'var(--warning)' }}>
          ⏰ Your actual schedule (from your notebook)
        </div>
        <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Based on what you wrote: wake before 6, workout at 8, deep work at 10,
          KredBook at 1 PM. I've mapped this exactly — don't start your deep
          work block before the morning blocks are done.
        </p>
      </div>

      {/* Timeline */}
      {DAILY_BLOCKS.map((block, i) => {
        const Icon = ICON_MAP[block.icon] || Brain;
        return (
          <div key={i} className="flex gap-3 mb-3">
            {/* Time + connector line */}
            <div className="flex flex-col items-end w-[72px] shrink-0 pt-3">
              <div
                className="text-[11px] font-semibold font-mono text-right"
                style={{ color: 'var(--text-primary)' }}
              >
                {block.time}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{block.dur}</div>
              <div
                className="w-0.5 flex-1 mt-1.5 rounded-full min-h-[28px]"
                style={{ background: LINE_BG[block.color] || LINE_BG.slate }}
              />
            </div>

            {/* Card */}
            <div
              className="flex-1 p-3"
              style={{
                background:   'var(--bg-surface)',
                border:       '1px solid var(--border)',
                borderRadius: 'var(--radius-card)',
                boxShadow:    'var(--shadow-card)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color: ICON_COLOR[block.color] || ICON_COLOR.slate }} />
                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {block.label}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {block.desc}
              </p>
            </div>
          </div>
        );
      })}

      <Card accent accentColor="var(--text-tertiary)" className="mt-2">
        <div className="text-[13px] font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          📓 Night log rule (non-negotiable)
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          8:30 PM: open the Daily Log tab. Write what you solved, what was hard,
          and tomorrow's 6 AM first task. Log it here in the tracker. "Log to AI
          and know next step" from your notebook — do that here. This compounds
          faster than you think.
        </p>
      </Card>
    </div>
  );
}
