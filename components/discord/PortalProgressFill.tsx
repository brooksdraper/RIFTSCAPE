import {
  FLICKER_DELAYS,
  PORTAL_CORE_SIZE,
  PORTAL_DARK,
  PORTAL_LIGHT,
} from "@/components/discord/portal-theme";

// Total columns of checkerboard to draw. Sized to outrun any realistic track
// width (80 * 6px = 480px) — the track's own `overflow-hidden` clips the
// rest, so this never needs to track the container's actual pixel width.
const TOTAL_COLS = 80;
const CELL_PX = 6;

// The core is a 2-color checkerboard, so its color at any (row, col) is just
// parity — computed globally rather than repeating the icon's fixed 3-wide
// block. Naively tiling a 3-wide block breaks the alternation at every seam
// (3 is odd, so a block's last column and the next block's first column land
// on the same parity), doubling that cell's width instead of alternating.
// Deriving color from global parity tiles seamlessly at any width.
const TILE = Array.from({ length: PORTAL_CORE_SIZE }, (_, r) =>
  Array.from({ length: TOTAL_COLS }, (_, c) => ({
    key: `${r}-${c}`,
    column: c + 1,
    row: r + 1,
    color: (r + c) % 2 === 0 ? PORTAL_DARK : PORTAL_LIGHT,
    delayIndex: r * TOTAL_COLS + c,
  })),
).flat();

interface PortalProgressFillProps {
  progress: number;
}

// Just the checkerboard texture — the rising embers live in
// PortalProgressFill's sibling, PortalBarParticles, so they aren't boxed in
// by this component's `overflow-hidden` reveal window.
export function PortalProgressFill({ progress }: PortalProgressFillProps) {
  return (
    <div
      className="h-full overflow-hidden"
      style={{ width: `${progress}%` }}
    >
      <div
        className="h-full grid"
        style={{
          width: `${TOTAL_COLS * CELL_PX}px`,
          gridTemplateColumns: `repeat(${TOTAL_COLS}, ${CELL_PX}px)`,
          gridTemplateRows: `repeat(${PORTAL_CORE_SIZE}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {TILE.map(({ key, color, delayIndex, column, row }) => (
          <div
            key={key}
            className="portal-cell"
            style={{
              gridColumn: column,
              gridRow: row,
              backgroundColor: color,
              animationDelay: `${FLICKER_DELAYS[delayIndex % FLICKER_DELAYS.length]}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
