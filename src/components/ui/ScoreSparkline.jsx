/**
 * ScoreSparkline.jsx
 * Tiny inline SVG line chart for last-7-days score trend.
 * No external charting deps — pure SVG, 200x40px.
 */
import { useMemo } from 'react';
import { calcScore } from '../../hooks/useWeeklySummary';

const W = 110;
const H = 40;
const PAD = 4;

export function ScoreSparkline({ logs }) {
  const points = useMemo(() => {
    if (!logs || logs.length < 2) return null;
    const scores = [...logs].reverse().map(calcScore); // oldest → newest
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min || 1;
    const step = (W - PAD * 2) / (scores.length - 1);

    return scores.map((s, i) => {
      const x = PAD + i * step;
      const y = PAD + ((max - s) / range) * (H - PAD * 2);
      return [x, y];
    });
  }, [logs]);

  if (!points) return null;

  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const lastScore = calcScore(logs[0]);
  const prevScore = calcScore(logs[1]);
  const trending = lastScore >= prevScore;
  const color = trending ? '#22c55e' : '#f97316';

  // Fill area under line
  const fillD = `${d} L ${points[points.length - 1][0].toFixed(1)} ${H} L ${PAD} ${H} Z`;

  return (
    <div className="flex items-center">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
        {/* Fill */}
        <path d={fillD} fill={color} fillOpacity={0.08} />
        {/* Line */}
        <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {/* Last point dot */}
        <circle
          cx={points[points.length - 1][0]}
          cy={points[points.length - 1][1]}
          r={3}
          fill={color}
        />
      </svg>
    </div>
  );
}
