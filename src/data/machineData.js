export const MACHINE = [
  { level: 'Easy — Week 1–2', color: 'green', items: [
    { t: 'Counter with increment, decrement, reset', s: ['useState', 'event handlers'] },
    { t: 'Todo list — add, delete, mark done', s: ['array state', 'filter', 'map'] },
    { t: 'Accordion — single & multi open modes', s: ['conditional render', 'toggle state'] },
    { t: 'Tabs component — active state, content switch', s: ['state', 'dynamic class'] },
    { t: 'Star rating component', s: ['map', 'hover', 'props'] },
    { t: 'Color picker with live hex preview', s: ['controlled input', 'CSS'] },
  ]},
  { level: 'Medium — Week 3–6', color: 'amber', items: [
    { t: '⚠️ Live search with debounce + highlight — YOUR FAILED INTERVIEW', s: ['useCallback', 'regex match', 'debounce'] },
    { t: 'Filter sidebar with multi-select checkboxes', s: ['derived state', 'filter logic'] },
    { t: 'Sortable table with pagination', s: ['sort', 'slice', 'useMemo'] },
    { t: 'Infinite scroll with IntersectionObserver', s: ['useRef', 'useEffect', 'API'] },
    { t: 'Autocomplete with keyboard navigation (arrow keys, enter, esc)', s: ['useMemo', 'keydown events', 'aria'] },
    { t: 'Drag and drop list — no library', s: ['onDragStart', 'onDrop', 'array reorder'] },
    { t: 'Multi-step form wizard with validation + review screen', s: ['step state', 'validation pattern'] },
  ]},
  { level: 'Hard — Week 7–10', color: 'red', items: [
    { t: '⚠️ Search + checkbox filter + results grid — YOUR FAILED INTERVIEW. Build 3 times.', s: ['state composition', 'filter pipeline', 'debounce'] },
    { t: '⚠️ Robot incident dashboard with status, availability, activity — YOUR FAILED INTERVIEW', s: ['complex state', 'table filter', 'real-time'] },
    { t: 'Kanban board — add card, move across columns', s: ['complex state', 'drag-drop', 'immutable updates'] },
    { t: 'Virtualized list — render 10,000 items without freezing', s: ['windowing', 'useRef', 'scroll math'] },
    { t: 'Charts dashboard: bar + line + date range filter', s: ['recharts', 'date filter', 'derived data'] },
    { t: 'Auth flow — login, protected routes, token refresh', s: ['React Router', 'context', 'JWT'] },
    { t: 'Full CRUD with API + loading/error/empty states + toast notifications', s: ['React Query', 'error boundaries', 'UX'] },
  ]},
];
