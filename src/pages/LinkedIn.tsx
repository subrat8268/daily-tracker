import React from 'react';
import { Star, ArrowRight, Copy, Check } from 'lucide-react';
import { LINKEDIN } from '../data/linkedin';
import { useState } from 'react';

interface LinkedInPageProps {
  onCopied?: () => void;
}

const CopyButton: React.FC<{ text: string; onCopied?: () => void }> = ({ text, onCopied }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <button className="btn-icon" onClick={handleCopy} style={{ marginTop: 8 }} aria-label="Copy template">
      {copied ? <Check size={12} style={{ color: 'var(--color-text-success)' }} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export const LinkedInPage: React.FC<LinkedInPageProps> = ({ onCopied }) => {
  return (
    <div id="panel-linkedin" role="tabpanel" aria-labelledby="tab-linkedin">
      {/* Golden rule */}
      <div className="card card-accent" style={{ borderLeftColor: 'var(--color-text-info)', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Star size={15} style={{ color: 'var(--color-text-info)' }} aria-hidden="true" />
          The golden rule
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          Don't post "seeking opportunities." Post what you learned, what you built, what broke and how you fixed it. Recruiters ignore job seekers. They notice people who demonstrate skills publicly.
        </p>
      </div>

      {/* Post templates */}
      {LINKEDIN.map((post) => (
        <div key={post.period} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
            <span className="badge" style={{ background: 'var(--color-background-info)', color: 'var(--color-text-info)' }}>
              {post.period}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{post.action}</span>
          </div>
          <div className="card-flat linkedin-template">
            "{post.template}"
          </div>
          <CopyButton text={post.template} onCopied={onCopied} />
        </div>
      ))}

      {/* Daily habit */}
      <div className="card" style={{ marginTop: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 10 }}>
          Daily 30-min LinkedIn habit
        </div>
        {[
          'Comment on 2–3 posts by engineers at target companies (Uber, Swiggy, CRED, Meesho)',
          "Send 1 connection request with a specific, personal note — never \"I'm looking for opportunities\"",
          'Every 3 days: DM 1 recruiter or engineer with a short, direct ask',
          'Share your weekly build: screenshot + 2-sentence explanation + what you learned',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7, alignItems: 'flex-start' }}>
            <ArrowRight size={13} style={{ color: 'var(--color-text-info)', flexShrink: 0, marginTop: 3 }} aria-hidden="true" />
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
