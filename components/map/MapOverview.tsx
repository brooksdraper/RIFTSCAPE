"use client";

import { motion } from "motion/react";
import Image from "next/image";

const STATS = [
  { label: "Cartographer", value: "AquaLessPantsu" },
  { label: "Terrain", value: "Single Continent" },
  { label: "Biomes", value: "6 Charted" },
];

export function MapOverview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      className="mb-16"
    >
      <div className="mc-panel-raised pixel-corners-lg border-2 border-black p-3 sm:p-4">
        <div className="relative w-full aspect-[16/9] pixel-slot pixel-corners border-2 border-black overflow-hidden bg-black">
          <Image
            src="/img/Sulfuria.png"
            alt="Overview map of Sulfuria"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Stat readout strip */}
        <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="mc-chip pixel-corners-sm pixel-slot px-3 py-2.5 text-center"
            >
              <div className="font-mc-header text-[11px] sm:text-xs text-accent mc-text-shadow leading-relaxed truncate">
                {stat.value}
              </div>
              <div className="font-mc-sub text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
