import React from 'react';
import { Map, Calendar, Clock, Monitor, Linkedin, Lightbulb, type LucideIcon } from 'lucide-react';

export type TabId = 'overview' | 'weeks' | 'daily' | 'machine' | 'linkedin' | 'tips';

const TABS: { id: TabId; label: string; Icon: LucideIcon }[] = [
  { id: 'overview', label: 'Overview', Icon: Map },
  { id: 'weeks', label: '12-week plan', Icon: Calendar },
  { id: 'daily', label: 'Daily routine', Icon: Clock },
  { id: 'machine', label: 'Machine coding', Icon: Monitor },
  { id: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { id: 'tips', label: 'Interview tips', Icon: Lightbulb },
];

interface TabBarProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <nav className="tab-bar" role="tablist" aria-label="Roadmap sections">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          id={`tab-${id}`}
          className={`tab-btn${active === id ? ' active' : ''}`}
          role="tab"
          aria-selected={active === id}
          aria-controls={`panel-${id}`}
          onClick={() => onChange(id)}
        >
          <Icon size={14} aria-hidden="true" />
          {label}
        </button>
      ))}
    </nav>
  );
};
