interface IconProps {
  className?: string;
}

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconPlay({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M7 4.5v15l13-7.5-13-7.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPause({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconReset({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

export function IconSkip({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M5 5v14l11-7-11-7z" fill="currentColor" stroke="none" />
      <rect x="18" y="5" width="2.6" height="14" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSliders({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
      <circle cx="9" cy="7" r="2.2" fill="var(--color-panel)" />
      <circle cx="15" cy="12" r="2.2" fill="var(--color-panel)" />
      <circle cx="7" cy="17" r="2.2" fill="var(--color-panel)" />
    </svg>
  );
}

export function IconSoundOn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 6a9 9 0 0 1 0 12" />
    </svg>
  );
}

export function IconSoundOff({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" />
      <path d="m16 9.5 5 5" />
      <path d="m21 9.5-5 5" />
    </svg>
  );
}

export function IconFlame({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="M12 3s5.5 4.4 5.5 9a5.5 5.5 0 0 1-11 0C6.5 7.4 12 3 12 3z" />
      <path d="M12 21a3 3 0 0 1-3-3c0-1.8 3-4 3-4s3 2.2 3 4a3 3 0 0 1-3 3z" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.5}>
      <path d="m20 6-11 11-5-5" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconMinus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base} strokeWidth={2.5}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconX({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function IconTimer({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <circle cx="12" cy="13.5" r="7.5" />
      <path d="M12 13.5V9.5" />
      <path d="M9.5 2.5h5" />
    </svg>
  );
}

export function IconTarget({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...base}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

/** Two-tone tomato wordmark mark. */
export function TomatoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="18" r="12" fill="var(--color-tomato)" />
      <path
        d="M9.5 12.5c2-3.4 6.4-4.6 8.8-2.6-1 1-1.6 2-1.8 3.3 2.6-2 6.2-1.6 8 .2-2.4.6-4.4 1.6-5.6 3.2-2-2.6-5.6-4-9.4-4.1z"
        fill="#e8472b"
        opacity="0.55"
      />
      <path
        d="M16 6.6c-2.3-2.5-5.8-2.5-7.2-1.2 2 .3 3.1 1 3.9 2.2-2.2-.4-3.7.2-4.3 1.2 2.6.4 5.5.2 7.6-1 2.1 1.2 5 1.4 7.6 1-.6-1-2.1-1.6-4.3-1.2.8-1.2 1.9-1.9 3.9-2.2C21.8 4.1 18.3 4.1 16 6.6z"
        fill="var(--color-mint)"
      />
      <ellipse cx="11.4" cy="15.2" rx="2.2" ry="3.2" fill="#ffffff" opacity="0.22" transform="rotate(-24 11.4 15.2)" />
    </svg>
  );
}
