import { useEffect, useState } from "react";
import { usePomodoro } from "./hooks/usePomodoro";
import { ModeTabs } from "./components/ModeTabs";
import { TimerRing } from "./components/TimerRing";
import { Controls } from "./components/Controls";
import { StatsBoard } from "./components/StatsBoard";
import { HistoryLog } from "./components/HistoryLog";
import { SettingsDrawer } from "./components/SettingsDrawer";
import { Reveal } from "./components/Reveal";
import {
  IconFlame,
  IconSliders,
  IconSoundOff,
  IconSoundOn,
  TomatoMark,
} from "./components/icons";

export default function App() {
  const pomo = usePomodoro();
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* global keyboard shortcuts */
  const { toggle, reset, skip, setMode } = pomo;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      switch (e.code) {
        case "Space":
          e.preventDefault();
          toggle();
          break;
        case "KeyR":
          reset();
          break;
        case "KeyS":
          skip();
          break;
        case "Digit1":
          setMode("focus");
          break;
        case "Digit2":
          setMode("short");
          break;
        case "Digit3":
          setMode("long");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle, reset, skip, setMode]);

  const { cycleInfo, mode } = pomo;

  return (
    <div className={`mode-${mode} relative flex min-h-screen flex-col overflow-clip`}>
      {/* ---------- ambient layers ---------- */}
      <div
        className="lamp pointer-events-none absolute left-1/2 top-[-16rem] z-0 h-[30rem] w-[46rem] -translate-x-1/2 rounded-[50%] opacity-20 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-14rem] right-[-10rem] z-0 h-[26rem] w-[26rem] rounded-full opacity-[0.06] blur-[100px]"
        style={{ background: "var(--color-gold)" }}
        aria-hidden="true"
      />

      {/* ---------- header ---------- */}
      <header className="relative z-20 border-b border-line/70 bg-base/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <TomatoMark className="h-8 w-8 transition-transform duration-300 hover:rotate-12" />
            <span className="font-display text-2xl font-extrabold tracking-tight text-cream">
              Ritmo
            </span>
            <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-faint sm:block">
              pomodoro
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`mr-1 flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs font-semibold tabular-nums transition-colors ${
                pomo.streak > 0
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-line text-faint"
              }`}
              title="Consecutive days with at least one focus sprint"
            >
              <IconFlame className="h-3.5 w-3.5" />
              {pomo.streak > 0 ? `${pomo.streak}-day streak` : "no streak yet"}
            </div>

            <button
              type="button"
              onClick={() => pomo.updateSettings({ sound: !pomo.settings.sound })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel text-sand transition-all hover:-translate-y-0.5 hover:text-cream active:scale-90"
              aria-label={pomo.settings.sound ? "Mute chime" : "Unmute chime"}
              title={pomo.settings.sound ? "Chime on" : "Chime off"}
            >
              {pomo.settings.sound ? (
                <IconSoundOn className="h-4.5 w-4.5" />
              ) : (
                <IconSoundOff className="h-4.5 w-4.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-line bg-panel px-4 text-sand transition-all hover:-translate-y-0.5 hover:text-cream active:scale-95"
              aria-label="Open settings"
            >
              <IconSliders className="h-4 w-4" />
              <span className="hidden font-display text-xs font-bold uppercase tracking-wider sm:block">
                Tune
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ---------- main ---------- */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-5 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[1.06fr_0.94fr]">
        {/* timer column */}
        <section className="relative flex flex-col items-center">
          {/* slow clockwork rings */}
          <div
            className="animate-spin-slower pointer-events-none absolute left-1/2 top-[300px] hidden h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-line/60 md:block"
            aria-hidden="true"
          />
          <div
            className="animate-spin-rev pointer-events-none absolute left-1/2 top-[300px] hidden h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/40 md:block"
            aria-hidden="true"
          />

          <ModeTabs mode={pomo.mode} settings={pomo.settings} onChange={pomo.setMode} />

          <div className="card relative mt-5 w-full px-4 pb-7 pt-9 sm:px-8">
            <TimerRing
              remainingMs={pomo.remainingMs}
              totalMs={pomo.totalMs}
              phase={pomo.phase}
              mode={pomo.mode}
            />

            {/* cycle pips */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                {Array.from({ length: cycleInfo.of }).map((_, i) => {
                  const filled = i < cycleInfo.done;
                  const current = i === cycleInfo.done && mode === "focus";
                  return (
                    <span
                      key={`${i}-${filled ? "on" : "off"}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        filled
                          ? "acc-bg animate-pop"
                          : current
                            ? "acc-line border-2 border-solid bg-transparent"
                            : "border border-line bg-raise"
                      }`}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
              <span className="font-mono text-[11px] tabular-nums text-faint">
                sprint {Math.min(cycleInfo.done + 1, cycleInfo.of)} of {cycleInfo.of}
              </span>
            </div>

            <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />

            <Controls
              phase={pomo.phase}
              onToggle={pomo.toggle}
              onReset={pomo.reset}
              onSkip={pomo.skip}
            />

            {/* up next */}
            <div className="mt-7 flex items-center justify-between rounded-xl border border-line/70 bg-base/50 px-4 py-3">
              <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-faint">
                Up next
              </span>
              <span className="acc font-mono text-sm font-semibold">{pomo.upNext}</span>
            </div>
          </div>
        </section>

        {/* stats column */}
        <aside className="flex flex-col gap-4 lg:pt-[52px]">
          <Reveal>
            <StatsBoard today={pomo.today} goal={pomo.settings.goal} week={pomo.week} />
          </Reveal>
          <Reveal delay={120}>
            <HistoryLog log={pomo.today.log} />
          </Reveal>
        </aside>
      </main>

      <footer className="relative z-10 mt-auto border-t border-line/60 py-2.5">
        <p className="text-center font-mono text-[11px] text-faint">
          Ritmo · ripe little slices of time — your history never leaves this browser
        </p>
        <p className="mt-1 text-center font-mono text-[11px] text-faint">
          made by{" "}
          <a
            href="https://ulugbekdev.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="acc font-semibold hover:underline"
          >
            Ulugbek
          </a>
        </p>
      </footer>

      {/* completion flash */}
      {pomo.flash > 0 && (
        <div
          key={pomo.flash}
          className="flash-overlay pointer-events-none fixed inset-0 z-[60]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgb(var(--acc-rgb) / 0.4), transparent 68%)",
          }}
          aria-hidden="true"
        />
      )}

      <SettingsDrawer
        open={drawerOpen}
        settings={pomo.settings}
        onClose={() => setDrawerOpen(false)}
        onChange={pomo.updateSettings}
        onWipe={pomo.wipe}
      />
    </div>
  );
}
