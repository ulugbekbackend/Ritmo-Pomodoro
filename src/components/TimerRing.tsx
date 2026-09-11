import { MODE_META, fmtClock, type Mode, type Phase } from "../lib/pomodoro";

interface TimerRingProps {
  remainingMs: number;
  totalMs: number;
  phase: Phase;
  mode: Mode;
}

const R = 158;
const C = 2 * Math.PI * R;

function Ticks() {
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const major = i % 5 === 0;
    const angle = (i / 60) * Math.PI * 2;
    const r1 = 140;
    const r2 = major ? 129 : 134;
    ticks.push(
      <line
        key={i}
        x1={180 + r1 * Math.sin(angle)}
        y1={180 - r1 * Math.cos(angle)}
        x2={180 + r2 * Math.sin(angle)}
        y2={180 - r2 * Math.cos(angle)}
        stroke={major ? "rgb(var(--acc-rgb) / 0.4)" : "var(--color-line)"}
        strokeWidth={major ? 2.4 : 1.4}
        strokeLinecap="round"
      />
    );
  }
  return <g>{ticks}</g>;
}

export function TimerRing({ remainingMs, totalMs, phase, mode }: TimerRingProps) {
  const frac = totalMs > 0 ? Math.max(0, Math.min(1, remainingMs / totalMs)) : 0;
  const offset = C * (1 - frac);
  const urgent = phase === "running" && remainingMs <= 5_500;
  const secsLeft = Math.ceil(remainingMs / 1000);

  const endsAt =
    phase === "running"
      ? new Date(Date.now() + remainingMs).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

  const statusLabel =
    phase === "running"
      ? mode === "focus"
        ? "in deep focus"
        : "recharging"
      : phase === "paused"
        ? "paused"
        : "ready when you are";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[400px] select-none">
      {/* breathing halo while running */}
      <div
        className={`absolute inset-[6%] rounded-full blur-3xl ${
          phase === "running" ? "animate-breathe" : ""
        }`}
        style={{ background: `rgb(var(--acc-rgb) / ${phase === "idle" ? 0.07 : 0.14})` }}
        aria-hidden="true"
      />

      <svg viewBox="0 0 360 360" className="relative block h-full w-full">
        <Ticks />
        {/* track */}
        <circle
          cx="180"
          cy="180"
          r={R}
          fill="none"
          stroke="var(--color-raise)"
          strokeWidth="10"
        />
        {/* progress arc */}
        <circle
          cx="180"
          cy="180"
          r={R}
          fill="none"
          stroke="var(--acc)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 180 180)"
          className="ring-progress"
          style={{ filter: "drop-shadow(0 0 16px rgb(var(--acc-rgb) / 0.45))" }}
        />
        {/* leading dot */}
        {frac > 0.004 && (
          <circle
            cx={180 + R * Math.sin(2 * Math.PI * frac)}
            cy={180 - R * Math.cos(2 * Math.PI * frac)}
            r="6.5"
            fill="var(--color-cream)"
            stroke="var(--acc)"
            strokeWidth="3"
          />
        )}
      </svg>

      {/* center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div
          className={`font-mono font-bold tabular-nums leading-none tracking-tight transition-colors duration-300 ${
            urgent ? "acc" : "text-cream"
          }`}
          style={{ fontSize: "clamp(56px, 15vw, 88px)" }}
          aria-live="off"
        >
          {fmtClock(remainingMs)}
        </div>

        <div className="flex items-center gap-2">
          {phase === "running" && (
            <span className="acc-bg animate-blink h-2 w-2 rounded-full" aria-hidden="true" />
          )}
          <span
            className={`font-display text-sm font-semibold uppercase tracking-[0.22em] ${
              phase === "paused" ? "text-gold" : phase === "running" ? "acc" : "text-faint"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        {urgent ? (
          <div className="acc font-mono text-xs font-semibold">
            {secsLeft}s to {mode === "focus" ? "harvest" : "back to work"}
          </div>
        ) : endsAt ? (
          <div className="font-mono text-xs text-faint">ends at {endsAt}</div>
        ) : (
          <div className="font-mono text-xs text-faint">{MODE_META[mode].hint}</div>
        )}
      </div>
    </div>
  );
}
