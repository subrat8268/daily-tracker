import { useState } from 'react';
import './index.css';

import { Header } from './components/Header';
import { TabBar, TabId } from './components/TabBar';
import { Toast, useToast } from './components/Toast';

import { Overview } from './pages/Overview';
import { WeekPlan } from './pages/WeekPlan';
import { DailyRoutine } from './pages/DailyRoutine';
import { MachineCoding } from './pages/MachineCoding';
import { LinkedInPage } from './pages/LinkedIn';
import { InterviewTips } from './pages/InterviewTips';

import { useProgress } from './hooks/useProgress';
import { WEEKS } from './data/weeks';
import { MACHINE } from './data/machine';

// Count all trackable items
function getTotalCount(): number {
  let total = 0;
  WEEKS.forEach((w) => {
    total += w.dsa.length + w.concept.length + w.ui.length;
  });
  MACHINE.forEach((lvl) => {
    total += lvl.items.length;
  });
  return total;
}

const TOTAL_COUNT = getTotalCount();

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { isDone, toggleDone, progress } = useProgress(TOTAL_COUNT);
  const { toasts, addToast, dismissToast } = useToast();

  const handleSaved = () => addToast('Log saved!', 'success');
  const handleCopied = () => addToast('Copied to clipboard!', 'info');

  return (
    <div className="app-bg">
      <h1 className="sr-only">Subrat's 90-Day Frontend Interview Roadmap</h1>
      <main className="app-shell" role="main">
        <Header progress={progress} />
        <TabBar active={activeTab} onChange={setActiveTab} />

        <div className="panels">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'weeks' && (
            <WeekPlan isDone={isDone} onToggle={toggleDone} onSaved={handleSaved} />
          )}
          {activeTab === 'daily' && <DailyRoutine />}
          {activeTab === 'machine' && (
            <MachineCoding isDone={isDone} onToggle={toggleDone} />
          )}
          {activeTab === 'linkedin' && <LinkedInPage onCopied={handleCopied} />}
          {activeTab === 'tips' && <InterviewTips />}
        </div>
      </main>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
