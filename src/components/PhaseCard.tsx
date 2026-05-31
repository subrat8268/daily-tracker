import React from 'react';
import { Phase } from '../data/phases';
import { Layers, Atom, Target, Check, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  atom: Atom,
  target: Target,
};

interface PhaseCardProps {
  phase: Phase;
}

export const PhaseCard: React.FC<PhaseCardProps> = ({ phase }) => {
  const Icon = ICONS[phase.icon] ?? Layers;
  return (
    <div className="card" style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
        <Icon size={20} style={{ color: phase.color, flexShrink: 0 }} aria-hidden="true" />
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: phase.color, letterSpacing: '.4px' }}>
            Phase {phase.id} · {phase.period}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {phase.name}{' '}
            <span style={{ fontWeight: 400, color: 'var(--color-text-secondary)', fontSize: 13 }}>
              — {phase.tagline}
            </span>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 10px' }}>
        {phase.goal}
      </p>
      {phase.outcomes.map((o, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4, alignItems: 'flex-start' }}>
          <Check size={13} style={{ color: phase.color, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
          <span>{o}</span>
        </div>
      ))}
    </div>
  );
};
