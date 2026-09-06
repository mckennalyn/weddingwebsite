type IconProps = { className?: string };

export function DoveIcon({ className }: IconProps) {
  return (
    <svg width="46" height="30" viewBox="0 0 46 30" fill="none" className={className}>
      <path
        d="M23 26 C 18 14, 4 14, 2 4 C 10 8, 18 10, 23 18 C 28 10, 36 8, 44 4 C 42 14, 28 14, 23 26 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function RingsIcon({ className }: IconProps) {
  return (
    <svg width="46" height="34" viewBox="0 0 46 34" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <circle cx="17" cy="17" r="13" />
      <circle cx="29" cy="17" r="13" />
    </svg>
  );
}

export function CeremonyIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <circle cx="11" cy="17" r="7" />
      <circle cx="19" cy="17" r="7" />
    </svg>
  );
}

export function CocktailIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M6 6h18l-9 10z" />
      <path d="M15 16v9M10 25h10" />
    </svg>
  );
}

export function DinnerIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M9 4v11M9 4c-2 0-3 2-3 4s1 4 3 4M9 4c2 0 3 2 3 4s-1 4-3 4M9 15v11" />
      <path d="M21 4c-2 0-3 3-3 6s1 5 3 5V4zM21 4v22" />
    </svg>
  );
}

export function DancingIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <circle cx="9" cy="23" r="4" />
      <path d="M13 23V6l12-3v14" />
      <circle cx="21" cy="20" r="4" />
    </svg>
  );
}

export function SendOffIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M4 19l2-6c1-2 2-3 4-3h10c2 0 3 1 4 3l2 6" />
      <rect x="3" y="19" width="24" height="6" rx="1.5" />
      <circle cx="8" cy="25" r="1.6" />
      <circle cx="22" cy="25" r="1.6" />
    </svg>
  );
}

export function GiftIcon({ className }: IconProps) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
      <path d="M17 12v20M4 12h26v6c0 1-1 2-2 2H6c-1 0-2-1-2-2v-6z" />
      <path d="M17 12c-3 0-5-2-5-4.5S13.5 3 16 3c2 2 1 6-1 6.5" />
      <path d="M17 12c3 0 5-2 5-4.5S18.5 3 16 3c-2 2-1 6 1 6.5" />
    </svg>
  );
}

export const scheduleIcons = {
  Ceremony: CeremonyIcon,
  Cocktails: CocktailIcon,
  Dinner: DinnerIcon,
  Dancing: DancingIcon,
  "Send-Off": SendOffIcon,
} as const;
