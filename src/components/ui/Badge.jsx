const COLOR_MAP = {
  js:       'bg-amber-50 text-amber-700 border-amber-200',
  react:    'bg-blue-50 text-blue-700 border-blue-200',
  dsa:      'bg-green-50 text-green-700 border-green-200',
  css:      'bg-purple-50 text-purple-700 border-purple-200',
  system:   'bg-amber-50 text-amber-700 border-amber-200',
  behavioral:'bg-purple-50 text-purple-700 border-purple-200',
  easy:     'bg-green-50 text-green-700 border-green-200',
  medium:   'bg-amber-50 text-amber-700 border-amber-200',
  hard:     'bg-red-50 text-red-700 border-red-200',
  amber:    'bg-amber-50 text-amber-700 border-amber-200',
  blue:     'bg-blue-50 text-blue-700 border-blue-200',
  green:    'bg-green-50 text-green-700 border-green-200',
  red:      'bg-red-50 text-red-700 border-red-200',
  default:  'bg-slate-100 text-slate-600 border-slate-200',
};

export function Badge({ label, color = 'default', className = '' }) {
  const cls = COLOR_MAP[color] || COLOR_MAP.default;
  return (
    <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${cls} ${className}`}>
      {label}
    </span>
  );
}

export function SkillTag({ label }) {
  return (
    <span className="inline-block bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-mono px-1.5 py-0.5 rounded mr-1 mt-0.5">
      {label}
    </span>
  );
}
