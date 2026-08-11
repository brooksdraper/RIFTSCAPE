"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { rosettePath } from "@/lib/riftscape-id";

const CIRCLE_TEXT =
  "RIFTSCAPE PLAYER REGISTRY · THE RIFTSCAPE NETWORK · VERIFIED · ";

/**
 * Minecraft hardcore heart as a 9x9 sprite: horned tips on the top row,
 * `*` marks the upper-left shine pixels.
 */
const HEART_SPRITE = [
  "#.......#",
  ".##...##.",
  "#**######",
  "#*#######",
  "#########",
  ".#######.",
  "..#####..",
  "...###...",
  "....#....",
];

const HEART_PIXEL = 2;
const HEART_ORIGIN_X = -9;
const HEART_ORIGIN_Y = -11;

/** Rosette rings, drawn largest first so the fine work sits on top. */
const ROSETTES = [
  { R: 38, r: 11, d: 9, turns: 11, opacity: 0.55, width: 0.35 },
  { R: 31, r: 8, d: 7, turns: 8, opacity: 0.45, width: 0.3 },
  { R: 23, r: 6, d: 5, turns: 6, opacity: 0.35, width: 0.28 },
];

export function SecuritySeal({ className = "" }: { className?: string }) {
  // useId keeps the SVG defs unique if the seal is ever rendered twice.
  const uid = useId().replace(/:/g, "");
  const textPathId = `seal-text-${uid}`;
  const foilId = `seal-foil-${uid}`;
  const heartId = `seal-heart-${uid}`;

  return (
    <div className={`relative ${className}`}>
      {/* Slow holographic foil sweep behind the engraving */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full opacity-60 blur-[2px]"
        style={{
          background:
            "conic-gradient(from 0deg, #EAB308, #22d3ee, #EAB308, #f472b6, #EAB308)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />

      <svg
        viewBox="-50 -50 100 100"
        className="relative w-full h-full"
        role="img"
        aria-label="RIFTSCAPE Player Registry security seal"
      >
        <defs>
          <path
            id={textPathId}
            d="M 0,-42 A 42,42 0 1,1 -0.01,-42"
            fill="none"
          />
          <radialGradient id={foilId} cx="35%" cy="30%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#EAB308" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#CA8A04" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id={heartId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1432e" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>

        {/* Seal body */}
        <circle r="46" fill="#0a0a0a" fillOpacity="0.82" />
        <circle
          r="46"
          fill="none"
          stroke={`url(#${foilId})`}
          strokeWidth="1.4"
        />
        <circle
          r="35.5"
          fill="none"
          stroke="#EAB308"
          strokeOpacity="0.5"
          strokeWidth="0.4"
        />
        <circle
          r="17"
          fill="none"
          stroke="#EAB308"
          strokeOpacity="0.6"
          strokeWidth="0.5"
        />

        {/* Milled edge ticks */}
        <g stroke="#EAB308" strokeOpacity="0.45" strokeWidth="0.5">
          {Array.from({ length: 72 }, (_, i) => {
            const angle = (i / 72) * Math.PI * 2;
            const inner = i % 6 === 0 ? 40.5 : 42.5;
            return (
              <line
                key={i}
                x1={Math.cos(angle) * inner}
                y1={Math.sin(angle) * inner}
                x2={Math.cos(angle) * 44.5}
                y2={Math.sin(angle) * 44.5}
              />
            );
          })}
        </g>

        {/* Guilloche engraving */}
        <g fill="none" stroke="#EAB308">
          {ROSETTES.map((ring, i) => (
            <path
              key={i}
              d={rosettePath(ring.R, ring.r, ring.d, ring.turns)}
              strokeWidth={ring.width}
              strokeOpacity={ring.opacity}
            />
          ))}
        </g>

        {/* Circular legend */}
        <text
          fill="#EAB308"
          fillOpacity="0.85"
          fontSize="5.2"
          fontFamily="var(--font-jetbrains), monospace"
          letterSpacing="1.15"
        >
          <textPath href={`#${textPathId}`} startOffset="0">
            {CIRCLE_TEXT.repeat(2)}
          </textPath>
        </text>

        {/* Center emblem: hardcore heart, struck into a darkened field */}
        <circle r="15" fill="#0a0a0a" fillOpacity="0.9" />
        <g shapeRendering="crispEdges">
          {HEART_SPRITE.flatMap((row, y) =>
            row.split("").map((cell, x) => {
              if (cell === ".") return null;

              return (
                <rect
                  key={`${x}-${y}`}
                  x={HEART_ORIGIN_X + x * HEART_PIXEL}
                  y={HEART_ORIGIN_Y + y * HEART_PIXEL}
                  width={HEART_PIXEL}
                  height={HEART_PIXEL}
                  fill={cell === "*" ? "#f87171" : `url(#${heartId})`}
                />
              );
            })
          )}
        </g>

        <text
          textAnchor="middle"
          y="12"
          fill="#EAB308"
          fillOpacity="0.7"
          fontSize="4"
          fontFamily="var(--font-jetbrains), monospace"
          letterSpacing="1.4"
        >
          26.2
        </text>
      </svg>
    </div>
  );
}
