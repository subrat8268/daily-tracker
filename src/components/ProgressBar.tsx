import React from 'react';

interface ProgressBarProps {
  done: number;
  total: number;
  pct: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ done, total, pct }) => {
  if (total === 0) return null;
  return (
    <div className="progress-wrap">
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{done}/{total} done</span>
    </div>
  );
};
