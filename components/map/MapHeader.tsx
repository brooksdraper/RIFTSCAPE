"use client";

import { motion } from "motion/react";

export function MapHeader() {
  return (
    <div className="text-center max-w-4xl mx-auto mb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative inline-block mb-6 pixel-corners bg-neutral-900 pixel-slot px-6 py-2 border-2 border-black"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          RIFTSCAPE CARTOGRAPHY
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-mc-header text-3xl sm:text-4xl text-foreground tracking-tight mb-4 mc-text-shadow leading-relaxed"
      >
        The Isle of <span className="text-accent">Sulfuria</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
      >
        A hand-crafted continent built by AquaLessPantsu — one landmass,
        every biome, and nowhere left to run once the hordes catch your
        scent.
      </motion.p>
    </div>
  );
}
