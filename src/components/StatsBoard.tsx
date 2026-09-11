import { useMemo } from "react";
import { dayKey, dayLetter, fmtHour, type DayStats } from "../lib/pomodoro";
import { useCountUp } from "../hooks/useCountUp";
import { IconCheck, IconTarget } from "./icons";

interface WeekDay {
  key: string;
  minutes: number;
  sessions: number;
}

interface StatsBoardProps {
  today: DayStats;
  goal: number;
  week: WeekDay[];
}

const H0 = 6;
const H1 = 23;

function HourStrip({ today }: { today: DayStats }) {
  const nowHour = new Date().getHours();
  const hours = useMemo(() => {
    const buckets = new Map<number, number>();
    for (const e of today.log) {
      const h = new Date(e.at).getHours();
      buckets.set(h, (buckets.get(h) ?? 0) + e.minutes);
    }
    return buckets;
  }, [today]);

  const max = Math.max(1, ...hours.values());
  const slots: number[] = [];
  for (let h = H0; h <= H1; h++) slots.push(h);

  return (
    <div>
      <div className="flex h-20 items-end gap-[3px]">
        {slots.map((h) => {
          const v = hours.get(h) ?? 0;
          const isNow = h === nowHour;
          return (
            <div
              key={h}
              title={`${h}:00 — ${v} min focused`}
              className={`flex-1 rounded-t-[3px] transition-all duration-500 ${
                v > 0 ? "" : "bg-raise"
              } ${isNow ? "ring-1 ring-inset ring-cream/20" : ""}`}
              style={{
                height: v > 0 ? `${Math.max(12, (v / max) * 100)}%` : "4px",
                backgroundColor: v > 0 ? `rgb(var(--acc-rgb) / ${0.35 + 0.65 * (v / max)})` : undefined,
                alignSelf: "flex-end",
              }}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-faint">
        <span>6a</span>
        <span>noon</span>
        <span>6p</span>
        <span>11p</span>
      </div>
    </div>
  );
}

function WeekChart({ week }: { week: WeekDay[] }) {
  const max = Math.max(1, ...week.map((d) => d.minutes));
  const todayK = dayKey();

  return (
    <div className="flex items-end gap-2">
      {week.map((d) => {
        const isToday = d.key === todayK;
        return (
          <div key={d.key} className="group flex flex-1 flex-col items-center gap-1.5">
            <span
              className={`font-mono text-[10px] tabular-nums transition-opacity ${
                d.minutes > 0 ? "text-sand" : "text-transparent"
              }`}
            >
              {d.minutes > 0 ? `${Math.round(d.minutes / 6) / 10}h` : "·"}
            </span>
            <div className="flex h-20 w-full items-end rounded-md bg-base/60">
              <div
                className={`w-full rounded-md transition-all duration-700 ease-out ${
                  isToday ? "acc-bg group-hover:brightness-110" : "bg-raise group-hover:bg-line"
                }`}
                style={{ height: d.minutes > 0 ? `${Math.max(6, (d.minutes / max) * 100)}%` : "0%" }}
              />
            </div>
            <span
              className={`font-display text-[11px] font-bold uppercase ${
                isToday ? "acc" : "text-faint"
              }`}
            >
              {dayLetter(d.key)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function StatsBoard({ today, goal, week }: StatsBoardProps) {
  const sessions = useCountUp(today.sessions);
  const minutes = useCountUp(Math.round(today.seconds / 60));
  const goalPct = Math.min(100, Math.round((today.sessions / goal) * 100));
  const met = today.sessions >= goal;
  const todayK = dayKey();

  return (
    <div className="flex flex-col gap-4">
      {/* headline card */}
      <section className="card relative overflow-hidden p-6">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
          style={{ background: "rgb(var(--acc-rgb) / 0.12)" }}
          aria-hidden="true"
        />
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.24em] text-faint">
            Today's focus
          </h2>
          <span className="font-mono text-[11px] text-faint">
            {new Date().toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="acc font-display text-7xl font-extrabold leading-none tabular-nums">
              {sessions}
            </span>
            <span className="font-display text-sm font-semibold text-sand">
              focus
              <br />
              sprints
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold tabular-nums text-cream">
              {minutes}
              <span className="ml-1 text-sm font-semibold text-faint">min</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-faint">deep work banked</div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-sand">
              <IconTarget className="h-3.5 w-3.5" />
              Daily goal
            </span>
            <span className={`font-mono text-xs font-semibold tabular-nums ${met ? "text-gold" : "text-sand"}`}>
              {Math.min(today.sessions, goal)} / {goal}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-base/80 ring-1 ring-inset ring-line/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                met ? "bg-gold" : "acc-bg"
              }`}
              style={{ width: `${goalPct}%` }}
            />
          </div>
          {met && (
            <div className="animate-pop mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 font-display text-xs font-bold uppercase tracking-wider text-gold ring-1 ring-gold/30">
              <IconCheck className="h-3.5 w-3.5" />
              Goal met — keep the streak ripe
            </div>
          )}
        </div>
      </section>

      {/* hour strip */}
      <section className="card p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.24em] text-faint">
            Hour by hour
          </h2>
          <span className="font-mono text-[11px] text-faint">minutes per hour</span>
        </div>
        <HourStrip today={today} />
      </section>

      {/* week */}
      <section className="card p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.24em] text-faint">
            Last 7 days
          </h2>
          <span className="font-mono text-[11px] text-faint">
            {fmtHour(week[0]?.key ?? todayK)} → today
          </span>
        </div>
        <WeekChart week={week} />
      </section>
    </div>
  );
}
