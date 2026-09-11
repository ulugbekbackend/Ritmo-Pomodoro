export type Mode = "focus" | "short" | "long";
export type Phase = "idle" | "running" | "paused";

export interface Settings {
  focusMin: number;
  shortMin: number;
  longMin: number;
  longEvery: number; // focus sprints until a long break
  goal: number; // daily goal in completed focus sessions
  autoBreaks: boolean;
  autoFocus: boolean;
  sound: boolean;
}

export interface LogEntry {
  at: number; // epoch ms
  minutes: number;
}

export interface DayStats {
  sessions: number;
  seconds: number;
  log: LogEntry[];
}

export type StatsMap = Record<string, DayStats>;

export const SETTINGS_KEY = "ritmo.settings.v1";
export const STATS_KEY = "ritmo.stats.v1";
export const CYCLE_KEY = "ritmo.cycle.v1";

export const DEFAULT_SETTINGS: Settings = {
  focusMin: 25,
  shortMin: 5,
  longMin: 15,
  longEvery: 4,
  goal: 8,
  autoBreaks: true,
  autoFocus: false,
  sound: true,
};

export const MODE_META: Record<
  Mode,
  { label: string; noun: string; hint: string }
> = {
  focus: { label: "Focus", noun: "focus sprint", hint: "One thing. Full attention." },
  short: { label: "Short break", noun: "short break", hint: "Stretch, sip water, look far away." },
  long: { label: "Long break", noun: "long break", hint: "Step away — you earned it." },
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** Local-date key: YYYY-MM-DD */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function lastNDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

export function fmtClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function fmtHour(key: string): string {
  // key: YYYY-MM-DD -> "Mon 3"
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
}

export function dayLetter(key: string): string {
  const d = new Date(`${key}T12:00:00`);
  return d.toLocaleDateString(undefined, { weekday: "narrow" });
}

export function computeStreak(stats: StatsMap): number {
  let streak = 0;
  const cursor = new Date();
  // today may still be in progress — allow streak to count from yesterday
  if (!stats[dayKey(cursor)]?.sessions) cursor.setDate(cursor.getDate() - 1);
  while ((stats[dayKey(cursor)]?.sessions ?? 0) > 0) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...fallback, ...(JSON.parse(raw) as T) };
  } catch {
    return fallback;
  }
}

export function loadStats(): StatsMap {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as StatsMap;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — run in-memory */
  }
}
