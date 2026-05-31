import { useState, useMemo } from "react";
import useTrackerStore from "../store/useTrackerStore";
import { QA_SEED } from "../data/qaData";
import { QACard } from "../components/ui/QACard";
import { QAAddForm } from "../components/forms/QAAddForm";
import { useAppToast } from "../components/layout/AppShell";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "js", label: "JavaScript" },
  { key: "react", label: "React" },
  { key: "dsa", label: "DSA" },
  { key: "css", label: "CSS" },
  { key: "system", label: "System" },
  { key: "behavioral", label: "Behavioral" },
];

export default function QABank() {
  const [filter, setFilter] = useState("all");
  const qaUser = useTrackerStore((s) => s.qaUser);
  const deleteQA = useTrackerStore((s) => s.deleteQA);
  const addToast = useAppToast();

  const filteredSeed = useMemo(
    () =>
      filter === "all" ? QA_SEED : QA_SEED.filter((q) => q.cat === filter),
    [filter],
  );
  const filteredUser = useMemo(
    () => (filter === "all" ? qaUser : qaUser.filter((q) => q.cat === filter)),
    [filter, qaUser],
  );

  return (
    <div>
      <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
        Your last-minute revision sheet. Save questions from LinkedIn, blogs,
        interviews. Study from here the night before any interview.
      </p>

      <QAAddForm onSaved={(msg, type) => addToast?.(msg, type)} />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 mb-4 scrollbar-hide">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap border transition-all shrink-0
              ${
                filter === key
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-slate-400">
          {qaUser.length} question{qaUser.length !== 1 ? "s" : ""} saved by you
        </span>
      </div>

      {/* Built-in */}
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
        Built-in — from recent interviews &amp; blogs
      </div>
      {filteredSeed.map((q, i) => (
        <QACard
          key={`seed-${i}`}
          question={q.q}
          answer={q.a}
          category={q.cat}
          difficulty={q.diff}
          source={q.src}
        />
      ))}

      {/* User-added */}
      {qaUser.length > 0 && (
        <>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-5">
            Your saved questions
          </div>
          {filteredUser.map((q, i) => {
            const actualIdx = qaUser.indexOf(q);
            return (
              <QACard
                key={`user-${i}`}
                question={q.q}
                answer={q.a}
                category={q.cat}
                difficulty={q.diff}
                source={q.src}
                onDelete={() => {
                  deleteQA(actualIdx);
                  addToast?.("Question deleted", "info");
                }}
              />
            );
          })}
        </>
      )}

      {filteredSeed.length === 0 && filteredUser.length === 0 && (
        <p className="text-[13px] text-slate-400 text-center py-8">
          No questions in this category yet.
        </p>
      )}
    </div>
  );
}
