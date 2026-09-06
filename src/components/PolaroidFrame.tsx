import type { ReactNode } from "react";

// A simple polaroid-style mount: thick white margin, deeper at the
// bottom, with a thin black hairline — no cream/paper tones.
export function PolaroidFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-4/5 border border-ink/80 bg-white p-[6%] pb-[16%] ${className ?? ""}`}
    >
      <div className="relative h-full w-full overflow-hidden">{children}</div>
    </div>
  );
}
