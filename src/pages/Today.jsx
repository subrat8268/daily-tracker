import { useCallback, useEffect } from "react";
import { Flame, Target, Mic } from "lucide-react";
import useTrackerStore from "../store/useTrackerStore";
import { useStreak } from "../hooks/useStreak";
import { useAppToast } from "../components/layout/AppShell";
import { CheckItem } from "../components/ui/CheckItem";
import { StreakDay } from "../components/ui/StreakDay";
import { Card } from "../components/ui/Card";
import { WeeklySummaryCard } from "../components/ui/WeeklySummaryCard";
import { StreakAlertBanner } from "../components/ui/StreakAlertBanner";
import { START_DATE, TOTAL_DAYS } from "../data/constants";

const TODAY_ITEMS = [
  { id: 0, time: "6:00 AM",  label: "Morning: hydration → plan today's 3 tasks → light review of yesterday" },
  { id: 1, time: "8:00 AM",  label: "Workout done" },
  { id: 2, time: "10:00 AM", label: "NamasteDev: watch concept → solve it yourself → rewrite from scratch" },
  { id: 3, time: "1:00 PM",  label: "KredBook: ship one visible feature or fix" },
  { id: 4, time: "4:30 PM",  label: "1–2 fresh DSA problems — no AI first attempt" },
  { id: 5, time: "5:30 PM",  label: "Machine coding or ChatGPT voice quiz on today's JS/React topic" },
  { id: 6, time: "7:30 PM",  label: "Revision: write what you learned, what blocked you" },
  { id: 7, time: "9:00 PM",  label: "Tomorrow planning: write 6 AM first task, shutdown" },
  { id: 8, time: "11:00 PM", label: "Fill the daily log — takes under 60 seconds" },
];

export default function Today() {
  const todayChecks = useTrackerStore((s) => s.todayChecks);
  const toggleTodayCheck = useTrackerStore((s) => s.toggleTodayCheck);
  const streakData = useTrackerStore((s) => s.streakData);
  const cycleStreak = useTrackerStore((s) => s.cycleStreak);
  const setStreak = useTrackerStore((s) => s.setStreak);
  const nsDone = useTrackerStore((s) => s.nsDone);
  const qaUser = useTrackerStore((s) => s.qaUser);
  const streak = useStreak();
  const addToast = useAppToast();

  const todayStr = new Date().toDateString();
  const today = new Date();

  // Timezone-agnostic local day number calculation
  const [sYear, sMonth, sDay] = "2026-05-27".split("-").map(Number);
  const startDateLocal = new Date(sYear, sMonth - 1, sDay);
  const diffTime = today.getTime() - startDateLocal.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const dayNum = Math.min(Math.max(diffDays + 1, 1), TOTAL_DAYS);

  const nsDoneCount = Object.values(nsDone).filter((v) => v === "done").length;
  const checkedToday = Object.entries(todayChecks).filter(
    ([k, v]) => k.includes(todayStr) && v === true,
  ).length;

  useEffect(() => {
    const autoLevel =
      checkedToday >= 6
        ? 4
        : checkedToday >= 4
          ? 3
          : checkedToday >= 2
            ? 2
            : checkedToday >= 1
              ? 1
              : 0;
    const current = streakData[todayStr] || 0;
    if (autoLevel > current) setStreak(todayStr, autoLevel);
  }, [todayChecks, todayStr, streakData, setStreak, checkedToday]);

  const handleToggle = useCallback(
    (id) => toggleTodayCheck(`today-${id}`, todayStr),
    [toggleTodayCheck, todayStr],
  );

  const handleStreakClick = useCallback(
    (dateStr) => {
      cycleStreak(dateStr);
      addToast?.("Streak updated!", "success");
    },
    [cycleStreak, addToast],
  );

  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(startDateLocal);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <StreakAlertBanner />

      {/* Unified Premium Hero Stat Banner (Charcoal Gradient & Glow overrides) */}
      <div
        className="relative overflow-hidden p-6 border"
        style={{
          background: "linear-gradient(135deg, #0B0F1A 0%, #070a13 100%)",
          borderRadius: "var(--radius-card)",
          borderColor: "#1e2535",
          boxShadow: "var(--shadow-elevated)",
        }}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-[180px] h-[180px] rounded-full bg-[#5DCAA5] opacity-[0.03] blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[120px] h-[120px] rounded-full bg-[#EF9F27] opacity-[0.02] blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5F5E5A] mb-1">
              Active Challenge
            </div>
            <div className="text-4xl font-extrabold text-[#F8F6F0] tracking-tight">
              Day <span className="text-[#5DCAA5]">{dayNum}</span>
            </div>
            <div className="text-[11px] text-[#5DCAA5] font-semibold mt-0.5">
              of {TOTAL_DAYS} — frontend dev prep
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Streak Pill */}
            <div className="bg-[#141A29] border border-[#1e2535] rounded-full px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-base select-none">🔥</span>
              <div>
                <div className="text-sm font-black text-[#EF9F27] leading-none">
                  {streak}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-[#5F5E5A] font-bold mt-0.5">
                  Streak
                </div>
              </div>
            </div>

            {/* Namaste Pill */}
            <div className="bg-[#141A29] border border-[#1e2535] rounded-full px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-base select-none">💻</span>
              <div>
                <div className="text-sm font-black text-white leading-none">
                  {nsDoneCount}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-[#5F5E5A] font-bold mt-0.5">
                  Namaste
                </div>
              </div>
            </div>

            {/* Q&A Pill */}
            <div className="bg-[#141A29] border border-[#1e2535] rounded-full px-3.5 py-1.5 flex items-center gap-2">
              <span className="text-base select-none">📚</span>
              <div>
                <div className="text-sm font-black text-white leading-none">
                  {qaUser.length}
                </div>
                <div className="text-[8px] uppercase tracking-wider text-[#5F5E5A] font-bold mt-0.5">
                  Q&As
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active checklists & Streaks (takes 2/3 of desktop width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today checklist */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Target size={15} style={{ color: "var(--accent)" }} />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "0.07em",
                }}
              >
                Today's focus
              </span>
              <span
                className="ml-auto text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                {checkedToday}/{TODAY_ITEMS.length}
              </span>
            </div>
            <div className="divide-y divide-(--border) border-t border-(--border) pt-1">
              {TODAY_ITEMS.map(({ id, time, label }) => {
                const key = `today-${id}_${todayStr}`;
                return (
                  <div key={id} className="py-2.5">
                    <CheckItem
                      id={id}
                      label={`${time} — ${label}`}
                      checked={!!todayChecks[key]}
                      onToggle={handleToggle}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Streak heatmap */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Flame size={15} style={{ color: "var(--warning)" }} />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "0.07em",
                }}
              >
                90-day progress
              </span>
              <span
                className="ml-auto text-[10px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                tap to override
              </span>
            </div>

            <div className="flex flex-wrap gap-[4px] p-2.5 bg-(--bg-base) rounded-xl border border-(--border)">
              {days.map((d) => {
                const key = d.toDateString();
                return (
                  <StreakDay
                    key={key}
                    date={d}
                    level={streakData[key] || 0}
                    isToday={key === todayStr}
                    onClick={() => handleStreakClick(key)}
                  />
                );
              })}
            </div>

            <div className="flex gap-4 items-center mt-4 flex-wrap text-xs">
              {["none", "light", "good", "solid", "beast"].map((l, i) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span
                    className="w-3.5 h-3.5 inline-block"
                    style={{
                      borderRadius: 3,
                      background:
                        i === 0
                          ? "var(--bg-elevated)"
                          : `rgba(39,110,241,${[0.2, 0.45, 0.75, 1][i - 1]})`,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <span
                    className="text-[10px] capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {l}
                  </span>
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Weekly summaries & Reminders (takes 1/3 of desktop width) */}
        <div className="space-y-6">
          {/* Weekly Summary Card */}
          <div className="hover:scale-[1.01] transition-transform duration-200">
            <WeeklySummaryCard />
          </div>

          {/* Senior Reminder Box */}
          <Card accent accentColor="var(--text-tertiary)">
            <div className="flex items-center gap-2 mb-3">
              <Mic size={14} style={{ color: "var(--text-tertiary)" }} />
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "0.07em",
                }}
              >
                Senior reminder
              </span>
            </div>
            <p
              className="text-[13px] leading-relaxed mb-3"
              style={{ color: "var(--text-secondary)", fontWeight: 400 }}
            >
              "You froze in those interviews because you had zero reps — not
              because you're not smart."
            </p>
            <p
              className="text-[12px] leading-relaxed mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Two Sum, filter dashboard — fixable with 30 practice reps, not 30
              days of theory. You have production code at AU Bank, XPharms,
              KredBook. What you're adding now is interview muscle.
            </p>
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "var(--text-tertiary)", fontStyle: "italic" }}
            >
              Say "quiz me on closures" in ChatGPT voice mode. Force yourself to
              explain things out loud.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
