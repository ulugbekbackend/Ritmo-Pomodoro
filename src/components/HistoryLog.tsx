import type { LogEntry } from "../lib/pomodoro";
import { TomatoMark } from "./icons";

interface HistoryLogProps {
  log: LogEntry[];
}

export function HistoryLog({ log }: HistoryLogProps) {
  return (
    <section className="card overflow-hidden">
      <header className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 className="font-display text-xs font-bold uppercase tracking-[0.24em] text-faint">
          Session log
        </h2>
        <span className="acc-soft acc rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums">
          {log.length} today
        </span>
      </header>

      {log.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
          <TomatoMark className="h-10 w-10 opacity-70" />
          <p className="max-w-[26ch] text-sm leading-relaxed text-sand">
            No sprints harvested yet. Start the timer and your sessions will ripen here.
          </p>
        </div>
      ) : (
        <ul className="max-h-64 divide-y divide-line/60 overflow-y-auto">
          {log.map((entry, i) => (
            <li
              key={`${entry.at}-${i}`}
              className="animate-rise flex items-center gap-3 px-5 py-3 transition-colors hover:bg-raise/50"
              style={{ animationDelay: `${Math.min(i, 6) * 45}ms` }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: "var(--acc)" }}
                aria-hidden="true"
              />
              <span className="font-display text-sm font-semibold text-cream">
                Focus sprint
              </span>
              <span className="font-mono text-[11px] text-faint">{entry.minutes} min</span>
              <span className="ml-auto font-mono text-xs tabular-nums text-sand">
                {new Date(entry.at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
