import React from 'react';
import { Calculator, Code, Atom, Monitor, type LucideIcon } from 'lucide-react';
import { TIPS } from '../data/tips';

const ICON_MAP: Record<string, LucideIcon> = {
  calculator: Calculator,
  code: Code,
  atom: Atom,
  monitor: Monitor,
};

export const InterviewTips: React.FC = () => {
  return (
    <div id="panel-tips" role="tabpanel" aria-labelledby="tab-tips">
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Senior-level tactics for each round type. Bookmark this tab. Re-read before every interview.
      </p>

      {TIPS.map((section) => {
        const Icon = ICON_MAP[section.icon] ?? Code;
        return (
          <div key={section.round} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: section.color, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon size={15} style={{ color: section.color }} aria-hidden="true" />
              {section.round}
            </div>
            {section.tips.map((tip, i) => (
              <div key={i} className="card tip-card">
                <span className="tip-number" style={{ color: section.color }}>{i + 1}.</span>
                <p className="tip-text">{tip}</p>
              </div>
            ))}
          </div>
        );
      })}

      {/* Mindset shift */}
      <div className="card-flat" style={{ padding: '1rem', marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>The mindset shift</div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 8px' }}>
          You didn't fail those interviews because you're not smart enough. Every engineer at Uber or CRED practiced hundreds of problems before their first offer. You have zero reps. You're now starting.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          3 months from now, Two Sum will feel like addition. The dashboard will feel like muscle memory. That's what reps do. You started May 27. Don't break the chain.
        </p>
      </div>
    </div>
  );
};
