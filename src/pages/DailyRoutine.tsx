import React from 'react';
import { DAILY } from '../data/daily';
import {
  Sunrise, Calculator, BookOpen, Coffee, Monitor,
  HelpCircle, Linkedin, NotebookPen, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  sunrise: Sunrise,
  calculator: Calculator,
  'book-open': BookOpen,
  coffee: Coffee,
  monitor: Monitor,
  'message-circle-question': HelpCircle,
  linkedin: Linkedin,
  notebook: NotebookPen,
};

export const DailyRoutine: React.FC = () => {
  return (
    <div id="panel-daily" role="tabpanel" aria-labelledby="tab-daily">
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Start at 7:00 AM. 6.0 hours of focused study + 2.0–3.0 hours for KredBook build + real breaks. 6 days/week. Sunday = light revision only.
      </p>

      {DAILY.map((block, i) => {
        const Icon = ICON_MAP[block.icon] ?? Monitor;
        const isRest = block.color === 'var(--color-text-tertiary)';
        const lineColor = isRest ? 'var(--color-border-tertiary)' : block.color;

        return (
          <div key={i} className="timeline-wrap">
            <div className="timeline-time">
              <div className="timeline-time-label">{block.time}</div>
              <div className="timeline-dur">{block.dur}</div>
            </div>
            <div className="timeline-line" style={{ background: lineColor }} />
            <div className="card timeline-card">
              <div className="timeline-card-header">
                <Icon size={15} style={{ color: block.color, flexShrink: 0 }} aria-hidden="true" />
                <span className="timeline-card-title">{block.label}</span>
              </div>
              <p className="timeline-card-desc">{block.desc}</p>
            </div>
          </div>
        );
      })}

      {/* Night log rule */}
      <div className="card card-accent" style={{ marginTop: 8, marginBottom: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <NotebookPen size={15} aria-hidden="true" />
          The night log rule (non-negotiable)
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Every night, log the day in the tracker: what you solved today, what you'll explain differently next time, tomorrow's first task at 7:00 AM, and short notes on blockers/fixes. Most people skip this. It's the actual difference between people who prepare for 3 months and people who get better in 3 months.
        </p>
      </div>
    </div>
  );
};
