import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CYCLE_KEY,
  DEFAULT_SETTINGS,
  MODE_META,
  SETTINGS_KEY,
  STATS_KEY,
  type Mode,
  type Phase,
  type Settings,
  type StatsMap,
  clamp,
  computeStreak,
  dayKey,
  fmtClock,
  lastNDays,
  loadJSON,
  loadStats,
  saveJSON,
} from "../lib/pomodoro";
import { playBlip, playChime, primeAudio } from "../lib/sound";

const minutesOf = (s: Settings, m: Mode) =>
  m === "focus" ? s.focusMin : m === "short" ? s.shortMin : s.longMin;

export interface CycleInfo {
  done: number; // sprints completed inside the current cycle
  of: number; // sprints per cycle
}

export function usePomodoro() {
  const [settings, setSettings] = useState<Settings>(() =>
    loadJSON(SETTINGS_KEY, DEFAULT_SETTINGS)
  );
  const [stats, setStats] = useState<StatsMap>(() => loadStats());
  const [cycle, setCycle] = useState<number>(() => {
    const c = loadJSON<{ date: string; count: number }>(CYCLE_KEY, {
      date: dayKey(),
      count: 0,
    });
    return c.date === dayKey() ? c.count : 0;
  });

  const [mode, setModeState] = useState<Mode>("focus");
  const [phase, setPhase] = useState<Phase>("idle");
  const [totalMs, setTotalMs] = useState(settings.focusMin * 60_000);
  const [remainingMs, setRemainingMs] = useState(settings.focusMin * 60_000);
  const [flash, setFlash] = useState(0); // increment = one celebration pulse

  const endsAtRef = useRef<number | null>(null);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const cycleRef = useRef(cycle);
  cycleRef.current = cycle;

  /* ---------------- persistence ---------------- */
  useEffect(() => saveJSON(SETTINGS_KEY, settings), [settings]);
  useEffect(() => saveJSON(STATS_KEY, stats), [stats]);
  useEffect(() => saveJSON(CYCLE_KEY, { date: dayKey(), count: cycle }), [cycle]);

  /* ---------------- engine ---------------- */
  const applyMode = useCallback(
    (next: Mode, autostart: boolean) => {
      const dur = minutesOf(settingsRef.current, next) * 60_000;
      setModeState(next);
      setTotalMs(dur);
      setRemainingMs(dur);
      if (autostart) {
        endsAtRef.current = Date.now() + dur;
        setPhase("running");
      } else {
        endsAtRef.current = null;
        setPhase("idle");
      }
    },
    []
  );

  const completeRef = useRef<() => void>(() => {});
  completeRef.current = () => {
    const s = settingsRef.current;
    const m = modeRef.current;
    if (s.sound) playChime();
    setFlash((f) => f + 1);

    if (m === "focus") {
      const minutes = s.focusMin;
      const now = Date.now();
      const key = dayKey(new Date(now));
      setStats((prev) => {
        const day = prev[key] ?? { sessions: 0, seconds: 0, log: [] };
        return {
          ...prev,
          [key]: {
            sessions: day.sessions + 1,
            seconds: day.seconds + minutes * 60,
            log: [{ at: now, minutes }, ...day.log],
          },
        };
      });
      const nextCount = cycleRef.current + 1;
      setCycle(nextCount);
      const next: Mode = nextCount % s.longEvery === 0 ? "long" : "short";
      applyMode(next, s.autoBreaks);
    } else {
      applyMode("focus", s.autoFocus);
    }
  };

  useEffect(() => {
    if (phase !== "running") return;
    const id = window.setInterval(() => {
      const endsAt = endsAtRef.current;
      if (endsAt == null) return;
      const rem = endsAt - Date.now();
      if (rem <= 0) {
        setRemainingMs(0);
        completeRef.current();
      } else {
        setRemainingMs(rem);
      }
    }, 200);
    return () => window.clearInterval(id);
  }, [phase]);

  /* ---------------- controls ---------------- */
  const start = useCallback(() => {
    primeAudio();
    if (settingsRef.current.sound) playBlip();
    setRemainingMs((rem) => {
      const safe = rem <= 0 ? totalMs : rem;
      endsAtRef.current = Date.now() + safe;
      return safe;
    });
    setPhase("running");
  }, [totalMs]);

  const pause = useCallback(() => {
    if (endsAtRef.current != null) {
      setRemainingMs(Math.max(0, endsAtRef.current - Date.now()));
    }
    endsAtRef.current = null;
    setPhase("paused");
  }, []);

  const toggle = useCallback(() => {
    if (phase === "running") pause();
    else start();
  }, [phase, pause, start]);

  const reset = useCallback(() => {
    endsAtRef.current = null;
    setPhase("idle");
    const dur = minutesOf(settingsRef.current, modeRef.current) * 60_000;
    setTotalMs(dur);
    setRemainingMs(dur);
  }, []);

  const skip = useCallback(() => {
    const s = settingsRef.current;
    const m = modeRef.current;
    if (m === "focus") {
      const wouldBe = cycleRef.current + 1;
      applyMode(wouldBe % s.longEvery === 0 ? "long" : "short", false);
    } else {
      applyMode("focus", false);
    }
  }, [applyMode]);

  const setMode = useCallback(
    (m: Mode) => applyMode(m, false),
    [applyMode]
  );

  const wipe = useCallback(() => {
    setStats({});
    setCycle(0);
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next: Settings = { ...prev, ...patch };
      next.focusMin = clamp(next.focusMin, 1, 120);
      next.shortMin = clamp(next.shortMin, 1, 60);
      next.longMin = clamp(next.longMin, 1, 60);
      next.longEvery = clamp(next.longEvery, 2, 8);
      next.goal = clamp(next.goal, 1, 20);
      return next;
    });
  }, []);

  /* keep the dial in sync with new durations while idle */
  useEffect(() => {
    if (phase !== "idle") return;
    const dur = minutesOf(settings, mode) * 60_000;
    setTotalMs(dur);
    setRemainingMs(dur);
  }, [settings, mode, phase]);

  /* ---------------- document title ---------------- */
  useEffect(() => {
    if (phase === "idle") {
      document.title = "Ritmo — Pomodoro Focus Timer";
    } else {
      const state = phase === "paused" ? "paused" : MODE_META[mode].label.toLowerCase();
      document.title = `${fmtClock(remainingMs)} · ${state} — Ritmo`;
    }
  }, [remainingMs, phase, mode]);

  /* ---------------- derived ---------------- */
  const today = useMemo(
    () => stats[dayKey()] ?? { sessions: 0, seconds: 0, log: [] },
    [stats]
  );

  const week = useMemo(
    () =>
      lastNDays(7).map((key) => ({
        key,
        minutes: Math.round((stats[key]?.seconds ?? 0) / 60),
        sessions: stats[key]?.sessions ?? 0,
      })),
    [stats]
  );

  const streak = useMemo(() => computeStreak(stats), [stats]);

  const cycleInfo: CycleInfo = useMemo(() => {
    const of = settings.longEvery;
    const rem = cycle % of;
    const done = mode === "long" && rem === 0 && cycle > 0 ? of : rem;
    return { done, of };
  }, [cycle, settings.longEvery, mode]);

  const upNext: string = useMemo(() => {
    if (mode === "focus") {
      const wouldBe = cycle + 1;
      const kind = wouldBe % settings.longEvery === 0 ? "long break" : "short break";
      return `${kind} · ${wouldBe % settings.longEvery === 0 ? settings.longMin : settings.shortMin} min`;
    }
    return `focus · ${settings.focusMin} min`;
  }, [mode, cycle, settings]);

  return {
    // timer
    mode,
    phase,
    totalMs,
    remainingMs,
    setMode,
    start,
    pause,
    toggle,
    reset,
    skip,
    flash,
    cycleInfo,
    upNext,
    // data
    settings,
    updateSettings,
    wipe,
    today,
    week,
    streak,
  };
}

export type Pomodoro = ReturnType<typeof usePomodoro>;
