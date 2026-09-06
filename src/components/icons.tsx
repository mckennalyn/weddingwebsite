type IconProps = { className?: string };

export function HeartIcon({ className }: IconProps) {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" className={className}>
      <path
        d="M13 22 C 13 22 2 14.5 2 7.5 C 2 3.5 5 1 8.2 1 C 10.5 1 12.2 2.3 13 4.2 C 13.8 2.3 15.5 1 17.8 1 C 21 1 24 3.5 24 7.5 C 24 14.5 13 22 13 22 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
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

export function ArriveIcon({ className }: IconProps) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.3" className={className}>
      <path d="M9 4h12v22H9" />
      <path d="M14 15h9M19 11l4 4-4 4" />
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
  "Guests Arrive": ArriveIcon,
  Ceremony: CeremonyIcon,
  "Cocktail Hour": CocktailIcon,
  Dinner: DinnerIcon,
  "Send-Off": SendOffIcon,
} as const;
