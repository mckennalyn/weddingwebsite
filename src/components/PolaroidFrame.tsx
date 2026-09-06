import type { ReactNode } from "react";

// A subtle per-photo tilt, cycling through a fixed set so the grid
// reads as loosely scattered rather than perfectly aligned — kept
// small so it stays believable rather than looking thrown down.
const TILTS = [-1.2, 0.8, -0.6, 1.4, -1.4, 0.6];

// A photorealistic polaroid mount: white card stock, thick margin
// (deeper at the bottom), a soft grounded shadow, a faint sheen
// across the card, and a slightly recessed photo window — no
// cream/paper tones or drawn outlines, just white, black, and shadow.
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
      className={`relative aspect-4/5 rounded-[2px] bg-white p-[6%] pb-[18%] ${className ?? ""}`}
      style={{
        transform: deg ? `rotate(${deg}deg)` : undefined,
        boxShadow:
          "0 1px 1px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.22), 0 10px 16px -8px rgba(0,0,0,0.35), 0 26px 34px -18px rgba(0,0,0,0.45)",
        backgroundImage:
          "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.07) 100%)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(0,0,0,0.18), inset 0 2px 5px rgba(0,0,0,0.16)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
