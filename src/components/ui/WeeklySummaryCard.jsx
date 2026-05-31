import { TrendingUp } from 'lucide-react';
import { Card, FlatCard } from './Card';
import { ScoreSparkline } from './ScoreSparkline';
import { useWeeklySummary } from '../../hooks/useWeeklySummary';

function ScoreRing({ score }) {
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-400';
  return <div className={`text-2xl font-bold ${color}`}>{score}</div>;
}

export function WeeklySummaryCard() {
  const { summary, loading, logs } = useWeeklySummary();

  if (loading) return (
    <Card>
      <div className="text-[12px] text-slate-400 animate-pulse">Loading week summary…</div>
    </Card>
  );

  if (!summary) return null;

  const stats = [
    { value: `${summary.totalStudy}h`, label: 'Study (7d)' },
    { value: `${summary.totalKred}h`,  label: 'KredBook (7d)' },
    { value: summary.dsaCount,         label: 'DSA days' },
    { value: summary.logCount,         label: 'Days logged' },
  ];

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={15} className="text-blue-500" />
          <span className="text-[13px] font-semibold text-slate-800">Last 7 days</span>
        </div>
        <div className="flex items-center gap-2">
          <ScoreSparkline logs={logs} />
          <div className="flex items-center gap-1 ml-2">
            <span className="text-[11px] text-slate-400">avg</span>
            <ScoreRing score={summary.avgScore} />
            <span className="text-[11px] text-slate-400">/100</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-3">
        {stats.map(({ value, label }) => (
          <FlatCard key={label} className="text-center mb-0! py-2">
            <div className="text-base font-bold text-slate-800">{value}</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{label}</div>
          </FlatCard>
        ))}
      </div>

      {summary.bestDay && (
        <div className="text-[11px] text-slate-400">
          🏆 Best day: <span className="text-slate-600 font-medium">{summary.bestDay.date}</span>
          {(summary.bestDay.dsa_done || summary.bestDay.dsa)
            ? ` — ${(summary.bestDay.dsa_done || summary.bestDay.dsa).slice(0, 40)}…`
            : ''}
        </div>
      )}
    </Card>
  );
}
