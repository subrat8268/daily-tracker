export interface TipSection {
  round: string;
  icon: string;
  color: string;
  tips: string[];
}

export const TIPS: TipSection[] = [
  {
    round: 'DSA rounds',
    icon: 'calculator',
    color: 'var(--color-text-success)',
    tips: [
      'State brute force first, then optimize. Interviewers want to see your thinking process, not just the answer.',
      'Talk continuously. Silence is interpreted as confusion. Say out loud what you\'re thinking, even if incomplete.',
      'If stuck, simplify: solve for n=1, then n=2, then generalize the pattern you see.',
      'Know time and space complexity for every solution before you finish. State it unprompted.',
      'After solving, suggest improvements even if not asked — this signals senior-level awareness.',
    ],
  },
  {
    round: 'JS fundamentals rounds',
    icon: 'code',
    color: 'var(--color-text-warning)',
    tips: [
      'For every concept: definition + real-world use case + common gotcha. This 3-part answer wins every time.',
      "The 'this' keyword trap: know all 4 binding rules cold — default, implicit, explicit, new binding.",
      "Event loop questions always come with 'what is the output?' puzzles. Practice 5 of these specifically.",
      'Promises vs async/await: know the difference for error handling in particular — that\'s where they diverge.',
      'Performance questions: always lead with measurement first (DevTools, Lighthouse), then the fix you applied.',
    ],
  },
  {
    round: 'React rounds',
    icon: 'atom',
    color: 'var(--color-text-info)',
    tips: [
      'Reconciliation: same component type = update existing node, different type = unmount + remount entirely.',
      'For every hook: when to use it AND when not to use it. Both sides of the answer matter to interviewers.',
      "useMemo/useCallback: wrong answer is 'always use them for performance'. Know the overhead cost too.",
      "State management choice: 'it depends on scale' with your decision criteria beats any fixed answer.",
      'Machine coding: ask clarifying questions for the first 2 minutes. Rushing in with no questions is a red flag.',
    ],
  },
  {
    round: 'Machine coding rounds',
    icon: 'monitor',
    color: 'var(--color-text-danger)',
    tips: [
      "First 5 minutes: ask clarifying questions — 'Should this work on mobile? Mock data or real API? Edge cases?'",
      "State your approach out loud before touching the keyboard — 'Data model first, then layout, then interactions.'",
      'Build working and ugly first. Beautifully broken code scores zero. Polish in the last 10 minutes.',
      'Name functions and variables clearly. Interviewers read your names to understand intent — not just your logic.',
      'Reserve 10 minutes at the end for: loading state, error state, one accessibility attribute (role or aria-label).',
    ],
  },
];
