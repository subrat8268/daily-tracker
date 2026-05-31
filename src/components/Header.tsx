import React from 'react';
import { ProgressBar } from './ProgressBar';

interface HeaderProps {
  progress: { done: number; total: number; pct: number };
}

export const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="app-header">
      <div className="header-top">
        <span className="header-title">90-day interview roadmap</span>
        <span className="header-sub">2.4 yrs → Uber / product companies</span>
      </div>
      <ProgressBar {...progress} />
    </header>
  );
};
