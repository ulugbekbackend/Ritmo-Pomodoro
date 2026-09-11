import type { Phase } from "../lib/pomodoro";
import { IconPause, IconPlay, IconReset, IconSkip } from "./icons";

interface ControlsProps {
  phase: Phase;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

const ghostBtn =
  "group flex h-13 w-13 items-center justify-center rounded-full border border-line bg-panel text-sand transition-all duration-200 hover:-translate-y-0.5 hover:border-faint hover:text-cream active:scale-95";

export function Controls({ phase, onToggle, onReset, onSkip }: ControlsProps) {
  const running = phase === "running";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onReset}
          className={ghostBtn}
          aria-label="Reset timer"
          title="Reset (R)"
        >
          <IconReset className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-90" />
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="acc-bg acc-glow group flex items-center gap-3 rounded-full px-10 py-4 font-display text-sm font-bold uppercase tracking-[0.2em] text-[#1c120a] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.96]"
        >
          {running ? (
            <IconPause className="h-4 w-4" />
          ) : (
            <IconPlay className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          )}
          {running ? "Pause" : phase === "paused" ? "Resume" : "Start focus"}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className={ghostBtn}
          aria-label="Skip to next session"
          title="Skip (S)"
        >
          <IconSkip className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="hidden items-center gap-4 text-[11px] text-faint sm:flex">
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">Space</kbd> start / pause
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">R</kbd> reset
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">S</kbd> skip
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="kbd">1–3</kbd> mode
        </span>
      </div>
    </div>
  );
}
