import type { ReactNode } from "react";

// A slight per-photo tilt, cycling through a fixed set so the grid
// reads as loosely scattered rather than perfectly aligned.
const TILTS = [-2.5, 2, -1.5, 3, -3, 1.5];

// A polaroid-style mount: thick white margin, deeper at the bottom, a
// thin black hairline, a soft drop shadow, and (optionally) a slight
// tilt — no cream/paper tones, just white, black, and shadow.
export function PolaroidFrame({
  children,
  className,
  rotate,
  tiltIndex,
}: {
  children: ReactNode;
  className?: string;
  /** Explicit rotation in degrees. Takes precedence over tiltIndex. */
  rotate?: number;
  /** Cycles through a fixed set of tilt angles — pass the tile's index. */
  tiltIndex?: number;
}) {
  const deg =
    rotate ?? (tiltIndex !== undefined ? TILTS[tiltIndex % TILTS.length] : 0);

  return (
    <div
      className={`relative aspect-4/5 border border-ink/80 bg-white p-[6%] pb-[16%] shadow-[0_20px_30px_-14px_rgba(0,0,0,0.5),0_8px_14px_-8px_rgba(0,0,0,0.3)] ${className ?? ""}`}
      style={deg ? { transform: `rotate(${deg}deg)` } : undefined}
    >
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
