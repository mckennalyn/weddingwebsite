"use client";

import { useId } from "react";

// A hand-drawn-looking wobbly rectangle border, meant to sit absolutely
// positioned over a photo card (parent needs position: relative).
export function WavyFrame({
  className,
  seed = 4,
}: {
  className?: string;
  seed?: number;
}) {
  const filterId = `wobble-${useId()}`;

  return (
    <svg
      aria-hidden
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.05"
          numOctaves={2}
          seed={seed}
          result="n"
        />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={9} />
      </filter>
      <rect
        x="2%"
        y="2%"
        width="96%"
        height="96%"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        filter={`url(#${filterId})`}
      />
    </svg>
  );
}
