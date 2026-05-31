export interface DailyBlock {
  time: string;
  label: string;
  icon: string;
  color: string;
  dur: string;
  desc: string;
}

export const DAILY: DailyBlock[] = [
  {
    time: '7:00–8:00',
    label: 'Planning + warm-up revision',
    icon: 'sunrise',
    color: 'var(--color-text-warning)',
    dur: '1h',
    desc: 'Plan the day, rewrite one old problem from memory, and start with a clear first task.',
  },
  {
    time: '8:00–10:00',
    label: 'DSA',
    icon: 'calculator',
    color: 'var(--color-text-success)',
    dur: '2h',
    desc: 'NamasteDev course + 1–2 problems. Write brute force first, then optimize. Always state the complexity before moving on.',
  },
  {
    time: '10:15–12:15',
    label: 'JS / React concepts',
    icon: 'book-open',
    color: 'var(--color-text-warning)',
    dur: '2h',
    desc: 'Week 1–4: JS fundamentals. Week 5–8: React internals. Write answers to 5 interview questions in your own words, out loud.',
  },
  {
    time: '12:15–1:15',
    label: 'Lunch break',
    icon: 'coffee',
    color: 'var(--color-text-tertiary)',
    dur: '1h',
    desc: 'Actually rest. No coding guilt. Your brain consolidates information during breaks — this is required.',
  },
  {
    time: '1:30–4:00',
    label: 'KredBook build',
    icon: 'monitor',
    color: 'var(--color-text-danger)',
    dur: '2.5h',
    desc: 'Deep product build block. Keep this separate from study. Ship one small visible task or screen improvement.',
  },
  {
    time: '4:30–6:00',
    label: 'DSA revision / interview practice',
    icon: 'message-circle-question',
    color: 'var(--color-text-info)',
    dur: '1.5h',
    desc: 'Re-solve one old problem, do one fresh one, and answer 3–5 JS/React interview questions out loud.',
  },
  {
    time: '7:00–8:00',
    label: 'Machine coding / light review',
    icon: 'linkedin',
    color: 'var(--color-text-info)',
    dur: '1h',
    desc: 'On heavy days do light review; on good days do one small machine coding problem or LinkedIn post/update.',
  },
  {
    time: '9:00–9:30',
    label: 'Evening log & next-day plan',
    icon: 'notebook',
    color: 'var(--color-text-tertiary)',
    dur: '30m',
    desc: "Write what you solved, blockers, tomorrow's 7 AM task, and notes in the tracker.",
  },
];
