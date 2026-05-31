import { Star, ArrowRight } from 'lucide-react';
import { LINKEDIN_POSTS, LI_HABITS } from '../data/linkedinData';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export default function LinkedIn() {
  return (
    <div>
      {/* Golden rule */}
      <Card accent accentColor="border-l-blue-400" className="border-blue-100 bg-blue-50">
        <div className="flex items-center gap-2 mb-2">
          <Star size={14} className="text-blue-500" />
          <span className="text-[13px] font-semibold text-blue-700">The golden rule</span>
        </div>
        <p className="text-[13px] text-blue-600 leading-relaxed">
          Don't post "seeking opportunities." Post what you built, what broke, and what you learned.
          Recruiters at CRED and Meesho are watching developers who show their thinking — not developers
          who announce they're looking.
        </p>
      </Card>

      {/* Post templates */}
      <div className="mb-4">
        {LINKEDIN_POSTS.map((p, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge label={p.period} color="blue" />
              <span className="text-[13px] font-semibold text-slate-800">{p.action}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-[12px] text-slate-500 leading-relaxed italic border-l-4 border-blue-200">
              {p.template}
            </div>
          </div>
        ))}
      </div>

      {/* Daily habits */}
      <Card>
        <div className="text-[13px] font-semibold text-slate-800 mb-3">Daily 30-min LinkedIn habit (5:30–6:00 PM)</div>
        {LI_HABITS.map((h, i) => (
          <div key={i} className="flex gap-2 mb-3 last:mb-0">
            <ArrowRight size={13} className="text-blue-500 flex-shrink-0 mt-1" />
            <p className="text-[13px] text-slate-500 leading-relaxed">{h}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
