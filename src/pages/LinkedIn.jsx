import { Star, ArrowRight } from 'lucide-react';
import { LINKEDIN_POSTS, LI_HABITS } from '../data/linkedinData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function LinkedIn() {
  return (
    <div>
      {/* Golden rule */}
      <Card accent accentColor="var(--accent)">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} style={{ color: 'var(--accent)' }} />
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
            The golden rule
          </span>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Don't post "seeking opportunities." Post what you built, what broke,
          and what you learned. Recruiters at CRED and Meesho are watching
          developers who show their thinking — not developers who announce
          they're looking.
        </p>
      </Card>

      {/* Post templates */}
      <div className="mb-4">
        {LINKEDIN_POSTS.map((p, i) => (
          <div
            key={i}
            className="mb-2"
            style={{
              background:   'var(--bg-surface)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              boxShadow:    'var(--shadow-card)',
              padding:      16,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="accent">{p.period}</Badge>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                {p.action}
              </span>
            </div>
            <div
              className="text-[12px] leading-relaxed italic"
              style={{
                background:   'var(--bg-elevated)',
                borderLeft:   '3px solid var(--accent)',
                borderRadius: `0 ${4}px ${4}px 0`,
                padding:      '10px 12px',
                color:        'var(--text-secondary)',
              }}
            >
              {p.template}
            </div>
          </div>
        ))}
      </div>

      {/* Daily habits */}
      <Card>
        <div className="text-[13px] font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Daily 30-min LinkedIn habit (5:30–6:00 PM)
        </div>
        {LI_HABITS.map((h, i) => (
          <div key={i} className="flex gap-2 mb-3 last:mb-0">
            <ArrowRight size={13} className="shrink-0 mt-1" style={{ color: 'var(--accent)' }} />
            <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {h}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
