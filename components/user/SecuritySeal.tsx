"use client";

interface SecuritySealProps {
  className?: string;
}

/**
 * Minecraft hardcore heart as a flat 8x7 sprite: two rounded humps taper
 * through a full-width body down to a single point, matching the silhouette
 * of `public/img/hardcore-64x64.png`. `*` marks the upper-left shine pixels.
 */
const HEART_SPRITE = [
  ".##..##.",
  "#**#####",
  "#*######",
  "########",
  ".######.",
  "..####..",
  "...##...",
];

export function SecuritySeal({ className = "" }: SecuritySealProps) {
  return (
    <div
      className={`mc-chip pixel-corners-sm pixel-slot flex flex-col items-center justify-center gap-1 p-2 ${className}`}
    >
      <svg
        viewBox="0 0 16 14"
        shapeRendering="crispEdges"
        className="w-8 h-7 sm:w-9 sm:h-8"
        role="img"
        aria-label="Verified registry seal"
      >
        {HEART_SPRITE.flatMap((row, y) =>
          row.split("").map((cell, x) => {
            if (cell === ".") return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * 2}
                y={y * 2}
                width={2}
                height={2}
                fill={cell === "*" ? "#f87171" : "var(--mc-danger)"}
              />
            );
          }),
        )}
      </svg>
      <span className="font-mc-sub text-[7px] sm:text-[8px] uppercase tracking-widest text-accent/70 leading-none text-center">
        Verified
      </span>
    </div>
  );
}
