export interface Phase {
  id: number;
  name: string;
  icon: string;
  period: string;
  color: string;
  bg: string;
  tagline: string;
  goal: string;
  outcomes: string[];
}

export const PHASES: Phase[] = [
  {
    id: 1,
    name: 'Phase 1 — Foundation',
    icon: 'layers',
    period: 'Week 1–4',
    color: 'var(--color-text-warning)',
    bg: 'var(--color-background-warning)',
    tagline: 'Never blank again',
    goal: 'Lock DSA basics + JS fundamentals so you never freeze on Two Sum or array problems again.',
    outcomes: [
      'Solve Two Sum, Two Pointers, Valid Anagram confidently',
      'Explain closures, event loop, and prototypes clearly',
      'Build basic UI components without AI or notes',
    ],
  },
  {
    id: 2,
    name: 'Phase 2 — React mastery',
    icon: 'atom',
    period: 'Week 5–8',
    color: 'var(--color-text-info)',
    bg: 'var(--color-background-info)',
    tagline: 'Machine coding killer',
    goal: 'React internals deep + build real UIs under time pressure. Own the machine coding round.',
    outcomes: [
      'Explain reconciliation, fiber, and hooks internals',
      'Build search+filter dashboard in under 60 minutes',
      'Handle debounce, async state, real-time updates under pressure',
    ],
  },
  {
    id: 3,
    name: 'Phase 3 — Interview mode',
    icon: 'target',
    period: 'Week 9–12',
    color: 'var(--color-text-success)',
    bg: 'var(--color-background-success)',
    tagline: 'Get the offer',
    goal: 'Timed mock rounds, full simulations, targeted applications to product companies.',
    outcomes: [
      'Complete 4 full mock interview rounds (recorded)',
      'Build a polished KredBook portfolio with demo video',
      'Apply to 10+ target companies with confidence',
    ],
  },
];
