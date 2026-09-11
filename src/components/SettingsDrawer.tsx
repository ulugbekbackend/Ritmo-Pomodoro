import { useEffect, useState, type ReactNode } from "react";
import { clamp, type Settings } from "../lib/pomodoro";
import { IconMinus, IconPlus, IconX } from "./icons";

interface SettingsDrawerProps {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onChange: (patch: Partial<Settings>) => void;
  onWipe: () => void;
}

interface StepperProps {
  label: string;
  hint?: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  children?: ReactNode;
}

function Stepper({ label, hint, value, unit = "min", min, max, step = 1, onChange, children }: StepperProps) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-raise text-sand transition-all hover:text-cream hover:border-faint active:scale-90 disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <div className="font-display text-sm font-semibold text-cream">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-faint">{hint}</div>}
        {children}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          onClick={() => onChange(clamp(value - step, min, max))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <IconMinus className="h-4 w-4" />
        </button>
        <span className="w-16 text-center font-mono text-lg font-bold tabular-nums text-cream">
          {value}
          <span className="ml-1 text-[10px] font-semibold text-faint">{unit}</span>
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => onChange(clamp(value + step, min, max))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <IconPlus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Switch({ checked, onToggle, label, hint }: { checked: boolean; onToggle: () => void; label: string; hint?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className="group flex w-full items-center justify-between gap-4 py-3 text-left"
    >
      <span>
        <span className="block font-display text-sm font-semibold text-cream">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-faint">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-300 ${
          checked ? "acc-bg acc-line" : "border-line bg-raise"
        }`}
      >
        <span
          className={`absolute top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full transition-all duration-300 ${
            checked ? "left-[calc(100%-1.25rem)] bg-[#1c120a]" : "left-0.5 bg-faint group-hover:bg-sand"
          }`}
        />
      </span>
    </button>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-1 mt-6 font-display text-[11px] font-bold uppercase tracking-[0.24em] text-faint first:mt-0">
      {children}
    </h3>
  );
}

export function SettingsDrawer({ open, settings, onClose, onChange, onWipe }: SettingsDrawerProps) {
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!open) setConfirming(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const presets = [15, 25, 50, 90];

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-label="Timer settings"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[400px] flex-col border-l border-line bg-panel shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.25,0.9,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <h2 className="font-display text-lg font-extrabold text-cream">Tune the rhythm</h2>
            <p className="text-xs text-faint">Changes apply instantly and are saved on this device.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sand transition-all hover:rotate-90 hover:text-cream active:scale-90"
            aria-label="Close settings"
          >
            <IconX className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 divide-y divide-line/70 overflow-y-auto px-6 py-6">
          <section>
            <SectionTitle>Durations</SectionTitle>
            <Stepper
              label="Focus sprint"
              hint="One deep-work interval"
              value={settings.focusMin}
              min={5}
              max={120}
              step={5}
              onChange={(v) => onChange({ focusMin: v })}
            >
              <div className="mt-2 flex gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChange({ focusMin: p })}
                    className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold transition-all active:scale-90 ${
                      settings.focusMin === p
                        ? "acc-soft acc acc-line"
                        : "border-line text-sand hover:text-cream hover:border-faint"
                    }`}
                  >
                    {p}m
                  </button>
                ))}
              </div>
            </Stepper>
            <Stepper
              label="Short break"
              value={settings.shortMin}
              min={1}
              max={30}
              onChange={(v) => onChange({ shortMin: v })}
            />
            <Stepper
              label="Long break"
              value={settings.longMin}
              min={5}
              max={60}
              step={5}
              onChange={(v) => onChange({ longMin: v })}
            />
          </section>

          <section>
            <SectionTitle>Rhythm</SectionTitle>
            <Stepper
              label="Long break after"
              hint="Sprints per cycle"
              value={settings.longEvery}
              unit="sprints"
              min={2}
              max={8}
              onChange={(v) => onChange({ longEvery: v })}
            />
            <Stepper
              label="Daily goal"
              hint="Target sprints per day"
              value={settings.goal}
              unit="sprints"
              min={1}
              max={20}
              onChange={(v) => onChange({ goal: v })}
            />
          </section>

          <section>
            <SectionTitle>Behavior</SectionTitle>
            <Switch
              checked={settings.autoBreaks}
              onToggle={() => onChange({ autoBreaks: !settings.autoBreaks })}
              label="Auto-start breaks"
              hint="Roll straight into rest after a sprint"
            />
            <Switch
              checked={settings.autoFocus}
              onToggle={() => onChange({ autoFocus: !settings.autoFocus })}
              label="Auto-start next sprint"
              hint="Jump back into focus after a break"
            />
            <Switch
              checked={settings.sound}
              onToggle={() => onChange({ sound: !settings.sound })}
              label="Completion chime"
              hint="A soft three-note bell when a session ends"
            />
          </section>

          <section>
            <SectionTitle>Data</SectionTitle>
            <p className="py-2 text-xs leading-relaxed text-faint">
              Focus history lives only in this browser's local storage. Wiping clears today's
              log, the weekly chart and your streak — settings stay put.
            </p>
            <button
              type="button"
              onClick={() => {
                if (!confirming) {
                  setConfirming(true);
                  return;
                }
                onWipe();
                setConfirming(false);
              }}
              className={`mt-1 w-full rounded-xl border py-3 font-display text-xs font-bold uppercase tracking-[0.18em] transition-all duration-200 active:scale-[0.98] ${
                confirming
                  ? "border-tomato/60 bg-tomato/15 text-tomato"
                  : "border-line text-sand hover:border-tomato/40 hover:text-tomato"
              }`}
            >
              {confirming ? "Tap again to confirm wipe" : "Erase focus history"}
            </button>
          </section>
        </div>
      </aside>
    </div>
  );
}
