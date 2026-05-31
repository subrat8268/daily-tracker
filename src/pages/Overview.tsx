import React from 'react';
import { Calculator, Monitor, Users, Calendar, Mic } from 'lucide-react';
import { PHASES } from '../data/phases';
import { PhaseCard } from '../components/PhaseCard';

export const Overview: React.FC = () => {
  return (
    <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <Calculator className="stat-icon" style={{ color: 'var(--color-text-success)' }} aria-hidden="true" />
          <div className="stat-value">60+</div>
          <div className="stat-label">DSA problems</div>
        </div>
        <div className="stat-card">
          <Monitor className="stat-icon" style={{ color: 'var(--color-text-info)' }} aria-hidden="true" />
          <div className="stat-value">20+</div>
          <div className="stat-label">UI builds</div>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" style={{ color: 'var(--color-text-warning)' }} aria-hidden="true" />
          <div className="stat-value">4+</div>
          <div className="stat-label">Mock rounds</div>
        </div>
        <div className="stat-card">
          <Calendar className="stat-icon" style={{ color: 'var(--color-text-danger)' }} aria-hidden="true" />
          <div className="stat-value">12</div>
          <div className="stat-label">Weeks total</div>
        </div>
      </div>

      {/* Phase Cards */}
      <div>
        {PHASES.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>

      {/* Honest Note */}
      <div className="card honest-note" style={{ marginTop: 4, marginBottom: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Mic size={15} style={{ color: 'var(--color-text-secondary)' }} aria-hidden="true" />
          Honest senior note
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: '0 0 8px' }}>
          You didn't fail those interviews because you're not smart enough. You failed because you had zero interview reps. The Two Sum freeze, the dashboard blank — those are fixable with 30 reps, not 30 days of theory.
        </p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          You already have solid project experience — KredBook, XPharms, AU Bank live in production. What's missing is interview muscle. You're now building that. You started May 27. Don't break the chain.
        </p>
      </div>
    </div>
  );
};
