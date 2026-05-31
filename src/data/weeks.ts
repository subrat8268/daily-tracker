export interface Week {
  w: number;
  ph: number;
  theme: string;
  dsa: string[];
  concept: string[];
  cLabel: string;
  ui: string[];
  tip: string;
}

export const WEEKS: Week[] = [
  {
    w: 1, ph: 1, theme: 'Arrays, hashmaps & closures',
    dsa: ['Arrays & two pointers basics', 'Two Sum — brute O(n²) then hashmap O(n)', 'LC#26 Remove Duplicates', 'Group items by property (your actual interview question)'],
    concept: ['JS engine, V8, call stack', 'Execution context & scope', 'Closures — makeCounter pattern', 'Hoisting, TDZ, IIFE'],
    cLabel: 'JS fundamentals',
    ui: ['Todo list (vanilla JS, no React)', 'Counter with inc/dec/reset'],
    tip: 'Every DSA problem: write brute force first, then optimize. Say it out loud before coding. Silence in an interview is a red flag.',
  },
  {
    w: 2, ph: 1, theme: 'Strings, sliding window & prototypes',
    dsa: ['Valid Anagram (LC#242)', 'Longest Substring No Repeat (LC#3)', 'Two Sum II — sorted array', 'Find all duplicates in array (LC#442)'],
    concept: ['Prototypes & prototype chain', "4 binding rules of 'this'", 'call, apply, bind', "Arrow fn vs regular fn — 'this' context"],
    cLabel: 'JS fundamentals',
    ui: ['Live search filter — your failed interview, build it 3 times this week', 'Tabs component from scratch'],
    tip: "Build the search+filter from your failed interview. Do it 3 times. Each time gets faster. That's the reps.",
  },
  {
    w: 3, ph: 1, theme: 'Sorting, async & event loop',
    dsa: ['Merge Sort — understand the pattern', 'Binary Search (LC#704)', 'LC#33 Search in Rotated Array', 'LC#153 Find Min in Rotated Array'],
    concept: ['Event loop — macro vs microtask queue', 'Promises & chaining', 'async/await + try/catch', 'Fetch pattern: loading / error / success states'],
    cLabel: 'JS fundamentals',
    ui: ['Search with API + debounce', 'Autocomplete dropdown with keyboard navigation'],
    tip: 'Draw the event loop on paper. Then explain it out loud as if teaching someone. This is asked in every JS round.',
  },
  {
    w: 4, ph: 1, theme: 'Stacks, queues & advanced JS',
    dsa: ['Valid Parentheses (LC#20)', 'Min Stack (LC#155)', 'Daily Temperatures (LC#739)', 'Next Greater Element (LC#496)'],
    concept: ['Currying & partial application', 'Debounce & throttle from scratch (no library)', 'Memoization pattern', 'Deep clone — structuredClone vs JSON'],
    cLabel: 'JS fundamentals',
    ui: ['Multi-level accordion', 'Filter sidebar with checkbox groups — your failed interview, build it'],
    tip: "Build the checkbox filter twice. First try you'll struggle. Second try you'll fly. That's the point.",
  },
  {
    w: 5, ph: 2, theme: 'React internals deep dive',
    dsa: ['BFS Level Order (LC#102)', 'Max Depth Binary Tree (LC#104)', 'DFS recursive pattern', 'Number of Islands (LC#200)'],
    concept: ['Reconciliation & Fiber explained', 'Virtual DOM vs real DOM — real difference', 'Keys — why React needs them, what happens without', 'Render phase vs commit phase'],
    cLabel: 'React core',
    ui: ['Infinite scroll list', 'Long list with manual virtualization (1000+ items)'],
    tip: 'If you can explain React reconciliation in 3 clean sentences, you pass 80% of React interview rounds.',
  },
  {
    w: 6, ph: 2, theme: 'Hooks deep dive & performance',
    dsa: ['Flood Fill (LC#733)', 'Subarray Sum = K (LC#560)', "Kadane's Algorithm (LC#53)", 'Container With Most Water (LC#11)'],
    concept: ['useEffect — cleanup, deps array, gotchas', 'useRef — DOM access & value persistence patterns', 'useMemo & useCallback — when NOT to use them', 'Custom hooks: useFetch, useDebounce, useLocalStorage'],
    cLabel: 'React core',
    ui: ['Real-time search + debounce + filter chips', 'Sortable data table with pagination'],
    tip: 'Write useFetch, useDebounce, useLocalStorage from scratch without looking. These appear in every FE interview.',
  },
  {
    w: 7, ph: 2, theme: 'Machine coding bootcamp I',
    dsa: ['Climbing Stairs (LC#70 — DP intro)', 'Coin Change (LC#322)', 'Permutations (LC#46)', 'Subsets (LC#78)'],
    concept: ['Code splitting & React.lazy()', 'Suspense & error boundaries', 'Context vs Zustand vs Redux — when to use each', 'Optimistic updates pattern'],
    cLabel: 'React patterns',
    ui: ['Full search + checkbox filter round — your failed interview, timed 60 min', 'CRUD app with optimistic UI'],
    tip: 'Time yourself: 60 minutes for the search+filter. If you take longer, rest and try again next day. Speed comes from reps.',
  },
  {
    w: 8, ph: 2, theme: 'Machine coding bootcamp II',
    dsa: ['DP: Longest Common Subsequence', 'Word Break (LC#139)', 'Heap/priority queue basics', 'Sliding window advanced set'],
    concept: ['React Query — fetching, caching, refetch patterns', 'Zustand store design (you use this in KredBook)', 'State normalization', 'React Profiler — how to find slow components'],
    cLabel: 'React patterns',
    ui: ['Robot incident dashboard — your failed interview, build it fully', 'Kanban board with column moves'],
    tip: 'For the dashboard: data model first, then layout, then interactions. Never start with CSS.',
  },
  {
    w: 9, ph: 3, theme: 'Timed practice begins',
    dsa: ['Mock: 2 problems in 45 min (timed, strict)', 'Hard arrays + strings problem set', 'Sliding window advanced problems', 'Graph BFS/DFS mixed problems'],
    concept: ['FE system design: Twitter feed', 'FE system design: Autocomplete at scale', 'Performance: FCP, LCP, CLS — what you improved at DEPT/Rejolut', 'Accessibility interview questions'],
    cLabel: 'System design',
    ui: ['Timed: filter table in 60 min flat', 'Timed: drag+drop list in 45 min flat'],
    tip: 'Start recording yourself coding. Watch it back once. You\'ll catch everything interviewers see that you don\'t.',
  },
  {
    w: 10, ph: 3, theme: 'Full mock interview rounds',
    dsa: ['Mock interview #1 — full round, record yourself', 'Mock interview #2 — with a peer or friend', "Blind 75 gaps review — what you haven't solved", 'Sprint on weakest patterns'],
    concept: ['Machine coding mock: full 90-min simulation', 'Behavioral prep — 5 STAR stories minimum', 'Resume aligned to each target job description', 'LeetCode company-tagged: Uber, Swiggy, Meesho'],
    cLabel: 'Interview prep',
    ui: ['Full round simulation: build dashboard in 90 min', 'Review your Loom recording — cold and critical'],
    tip: '5 STAR stories minimum: feature you owned, hard bug you fixed, performance you improved, disagreement you navigated, someone you helped.',
  },
  {
    w: 11, ph: 3, theme: 'Target companies & portfolio polish',
    dsa: ['Company-tagged: Uber, Google, Meesho', 'Hard problem push — 1 per day', 'Full revision of all patterns solved', 'Weak spots final sprint'],
    concept: ['Senior React questions deep dive', 'Next.js: SSR vs SSG vs ISR vs CSR — clear differences', 'TypeScript generics & utility types', 'Web vitals you personally improved at DEPT or Rejolut'],
    cLabel: 'Senior topics',
    ui: ['Polish KredBook: clean code, README, screenshots', 'Record 2-min KredBook demo video for LinkedIn'],
    tip: 'For every project on your resume: what did you build, what was hard, what would you do differently, what was the measured impact. Numbers only.',
  },
  {
    w: 12, ph: 3, theme: 'Final sprint & apply hard',
    dsa: ['1–2 problems/day to stay sharp', 'Revise all solved problems once', 'Mock DSA + React combo round', 'Rest and consolidate — trust your prep'],
    concept: ['Practice explaining code out loud — no mumbling', 'Fill any remaining JS/React gaps', 'Read tech blogs of target companies', 'Interview day checklist ready'],
    cLabel: 'Final prep',
    ui: ['Final KredBook polish', 'LinkedIn fully updated — active applications open'],
    tip: 'Apply to 10 companies this week. Not 2. Not 5. Ten. The interview pipeline is everything. Treat early ones as practice rounds.',
  },
];
