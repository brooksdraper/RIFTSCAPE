"use client";

import { useMemo } from "react";
import { barcodeBars, compactSerial } from "@/lib/riftscape-id";

interface BarcodeProps {
  /** Profile UUID from public.profiles.id — seeds the bar pattern. */
  id: string;
  className?: string;
}

const HEIGHT = 40;

export function Barcode({ id, className = "" }: BarcodeProps) {
  // Lay the bars out into absolute x offsets so rendering stays pure.
  const { inkBars, totalWidth } = useMemo(() => {
    const inked: { x: number; width: number }[] = [];
    let cursor = 0;

    for (const bar of barcodeBars(id)) {
      if (bar.filled) inked.push({ x: cursor, width: bar.width });
      cursor += bar.width;
    }

    return { inkBars: inked, totalWidth: cursor };
  }, [id]);

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${totalWidth} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="w-full h-10 sm:h-11"
        role="img"
        aria-label={`Barcode encoding registry serial ${compactSerial(id)}`}
      >
        {inkBars.map((bar) => (
          <rect
            key={bar.x}
            x={bar.x}
            y={0}
            width={bar.width}
            height={HEIGHT}
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}
