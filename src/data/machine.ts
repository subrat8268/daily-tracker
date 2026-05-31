export interface MachineItem {
  t: string;
  s: string[];
}

export interface MachineLevel {
  level: string;
  color: string;
  items: MachineItem[];
}

export const MACHINE: MachineLevel[] = [
  {
    level: 'Easy — week 1–2',
    color: 'var(--color-text-success)',
    items: [
      { t: 'Counter with increment, decrement, reset', s: ['useState', 'event handlers'] },
      { t: 'Todo list — add, delete, mark done', s: ['array state', 'filter', 'map'] },
      { t: 'Accordion — single & multi open modes', s: ['conditional render', 'toggle'] },
      { t: 'Tabs component — active state, content switch', s: ['state', 'dynamic class'] },
      { t: 'Star rating component', s: ['map', 'hover state', 'props'] },
      { t: 'Color picker with live hex preview', s: ['controlled input', 'CSS vars'] },
    ],
  },
  {
    level: 'Medium — week 3–6',
    color: 'var(--color-text-warning)',
    items: [
      { t: 'Live search with debounce + match highlight', s: ['useCallback', 'regex', 'debounce'] },
      { t: 'Filter sidebar with multi-select checkboxes', s: ['derived state', 'filter logic'] },
      { t: 'Sortable table with pagination', s: ['sort', 'slice', 'useMemo'] },
      { t: 'Infinite scroll with IntersectionObserver', s: ['useRef', 'useEffect', 'API'] },
      { t: 'Autocomplete dropdown with keyboard navigation', s: ['useMemo', 'keydown events', 'aria'] },
      { t: 'Drag and drop list (no library)', s: ['onDragStart', 'onDrop', 'reorder'] },
      { t: 'Form wizard — multi-step with validation + review', s: ['step state', 'validation'] },
    ],
  },
  {
    level: 'Hard — week 7–10',
    color: 'var(--color-text-danger)',
    items: [
      { t: 'Search + checkbox filter + results grid — your failed interview', s: ['state composition', 'filter pipeline', 'debounce'] },
      { t: 'Robot incident dashboard with status filters — your failed interview', s: ['complex state', 'table filters', 'real-time updates'] },
      { t: 'Kanban board — add card, move across columns', s: ['complex state', 'drag-drop', 'immutable updates'] },
      { t: 'Virtualized list rendering 10,000 items', s: ['windowing', 'useRef', 'scroll math'] },
      { t: 'Charts dashboard: bar + line + date range filter', s: ['recharts', 'date filter', 'derived data'] },
      { t: 'Auth flow — login, protected routes, token refresh', s: ['React Router', 'context', 'JWT'] },
      { t: 'Full CRUD with API + loading/error states + toast', s: ['React Query', 'error boundaries', 'UX'] },
    ],
  },
];
