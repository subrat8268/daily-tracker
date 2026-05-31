import { useCallback } from "react";
import { Flame, Target, Mic } from "lucide-react";
import useTrackerStore from "../store/useTrackerStore";
import { useStreak } from "../hooks/useStreak";
import { useAppToast } from "../components/layout/AppShell";
import { CheckItem } from "../components/ui/CheckItem";
import { StreakDay } from "../components/ui/StreakDay";
import { Card, FlatCard } from "../components/ui/Card";
import { START_DATE, TOTAL_DAYS } from "../data/constants";

const TODAY_ITEMS = [
  {
    id: 0,
    time: "6:00 AM",
    label: "Rewrite one old problem from memory — no AI",
  },
  { id: 1, time: "8:00 AM", label: "Workout done" },
  { id: 2, time: "10:00 AM", label: "NamasteDev: watch + solve + rewrite" },
  { id: 3, time: "1:00 PM", label: "KredBook: ship one visible thing" },
  { id: 4, time: "4:30 PM", label: "1–2 fresh DSA problems" },
  {
    id: 5,
    time: "5:30 PM",
    label: "ChatGPT voice quiz on today's JS/React topic",
  },
  { id: 6, time: "8:30 PM", label: "Fill the daily log" },
];

const STREAK_COLORS = [
  "bg-slate-100",
  "bg-green-100",
  "bg-green-300",
  "bg-green-500",
  "bg-green-800",
];

export default function Today() {
  const todayChecks = useTrackerStore((s) => s.todayChecks);
  const toggleTodayCheck = useTrackerStore((s) => s.toggleTodayCheck);
  const streakData = useTrackerStore((s) => s.streakData);
  const cycleStreak = useTrackerStore((s) => s.cycleStreak);
  const nsDone = useTrackerStore((s) => s.nsDone);
  const qaUser = useTrackerStore((s) => s.qaUser);
  const streak = useStreak();
  const addToast = useAppToast();

  const todayStr = new Date().toDateString();

  const dayNum = Math.min(
    Math.floor((new Date() - START_DATE) / (1000 * 60 * 60 * 24)) + 1,
    TOTAL_DAYS,
  );

  const nsDoneCount = Object.values(nsDone).filter((v) => v === "done").length;

  const handleToggle = useCallback(
    (id) => {
      toggleTodayCheck(`today-${id}`, todayStr);
    },
    [toggleTodayCheck, todayStr],
  );

  const handleStreakClick = useCallback(
    (dateStr) => {
      cycleStreak(dateStr);
      addToast?.("Streak updated!", "success");
    },
    [cycleStreak, addToast],
  );

  // Build heatmap days
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const d = new Date(START_DATE);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { value: dayNum, label: "Day of 90" },
          { value: `🔥 ${streak}`, label: "Day streak" },
          { value: nsDoneCount, label: "Namaste done" },
          { value: qaUser.length, label: "Q&As saved" },
        ].map(({ value, label }) => (
          <FlatCard key={label} className="text-center mb-0! py-2.5">
            <div className="text-xl font-bold text-slate-800">{value}</div>
            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
              {label}
            </div>
          </FlatCard>
        ))}
      </div>

      {/* Today's checklist */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Target size={15} className="text-blue-500" />
          <span className="text-[13px] font-semibold text-slate-800">
            Today's focus checklist
          </span>
        </div>
        {TODAY_ITEMS.map(({ id, time, label }) => {
          const key = `today-${id}_${todayStr}`;
          return (
            <CheckItem
              key={id}
              id={id}
              label={`${time} — ${label}`}
              checked={!!todayChecks[key]}
              onToggle={handleToggle}
            />
          );
        })}
      </Card>

      {/* Streak heatmap */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={15} className="text-amber-500" />
          <span className="text-[13px] font-semibold text-slate-800">
            90-day activity streak
          </span>
          <span className="text-[11px] text-slate-400">— tap to mark</span>
        </div>
        <div className="flex flex-wrap gap-[3px]">
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
        {/* Legend */}
        <div className="flex gap-2 items-center mt-3 text-[11px] text-slate-400 flex-wrap">
          {["none", "light", "good", "solid", "beast"].map((l, i) => (
            <span key={l} className="flex items-center gap-1">
              <span
                className={`w-3.5 h-3.5 rounded-[2px] ${STREAK_COLORS[i]} border border-slate-200`}
              />
              {l}
            </span>
          ))}
        </div>
      </Card>

      {/* Senior reminder */}
      <Card accent accentColor="border-l-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Mic size={14} className="text-slate-400" />
          <span className="text-[13px] font-semibold text-slate-700">
            Senior reminder
          </span>
        </div>
        <p className="text-[13px] text-slate-500 leading-relaxed mb-2">
          You froze in those interviews because you had zero reps — not because
          you're not smart. Two Sum, filter dashboard — fixable with 30 practice
          reps, not 30 days of theory. You have production code at AU Bank,
          XPharms, KredBook. What you're adding now is interview muscle.
        </p>
        <p className="text-[13px] text-slate-500 leading-relaxed">
          ChatGPT voice mode for JS/React is smart. Use it like a mock
          interviewer, not a teacher — "quiz me on closures", not "explain
          closures to me." The difference is the direction of effort.
        </p>
      </Card>
    </div>
  );
}
