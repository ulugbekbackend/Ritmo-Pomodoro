let ctx: AudioContext | null = null;

function ensureCtx(): AudioContext | null {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  peak: number,
  type: OscillatorType = "sine"
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.05);
}

/** Warm three-note chime for completed sessions. */
export function playChime(): void {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + 0.02;
  tone(c, 659.25, t, 0.5, 0.16); // E5
  tone(c, 830.61, t + 0.16, 0.55, 0.14); // G#5
  tone(c, 1244.51, t + 0.32, 0.8, 0.12); // B5 shimmer
}

/** Tiny confirmation blip for start / interactions. */
export function playBlip(): void {
  const c = ensureCtx();
  if (!c) return;
  tone(c, 520, c.currentTime + 0.01, 0.09, 0.06, "triangle");
}

/** Warm up the context on first user gesture (autoplay policies). */
export function primeAudio(): void {
  ensureCtx();
}
