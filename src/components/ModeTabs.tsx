import { MODE_META, type Mode, type Settings } from "../lib/pomodoro";

interface ModeTabsProps {
  mode: Mode;
  settings: Settings;
  onChange: (m: Mode) => void;
}

const ORDER: Mode[] = ["focus", "short", "long"];

export function ModeTabs({ mode, settings, onChange }: ModeTabsProps) {
  const idx = ORDER.indexOf(mode);
  const minutes = (m: Mode) =>
    m === "focus" ? settings.focusMin : m === "short" ? settings.shortMin : settings.longMin;

  return (
    <div
      role="tablist"
      aria-label="Timer mode"
      className="relative grid w-full max-w-md grid-cols-3 rounded-full border border-line bg-panel p-1 shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]"
    >
      <span
        aria-hidden="true"
        className="acc-soft acc-line absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full border transition-transform duration-300 ease-[cubic-bezier(0.25,0.9,0.3,1.2)]"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {ORDER.map((m) => {
        const active = m === mode;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            className={`relative z-10 flex flex-col items-center rounded-full px-2 py-2 transition-colors duration-200 ${
              active ? "acc cursor-default" : "text-sand hover:text-cream"
            }`}
          >
            <span className={`font-display text-sm font-bold tracking-wide ${active ? "" : ""}`}>
              {MODE_META[m].label}
            </span>
            <span
              className={`font-mono text-[10px] leading-tight ${
                active ? "opacity-80" : "text-faint"
              }`}
            >
              {minutes(m)} min
            </span>
          </button>
        );
      })}
    </div>
  );
}
