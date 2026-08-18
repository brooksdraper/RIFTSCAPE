"use client";

import { motion } from "motion/react";

export function RulesHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-16"
    >
      <h1 className="font-mc-header text-4xl sm:text-5xl md:text-7xl leading-relaxed text-foreground mc-text-shadow mb-4">
        Rules & Enforcement
      </h1>
      <p className="font-mc-body text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
        RIFTSCAPE maintains fair play and community safety through a three-tier
        strike system. Every player and faction operates under the same rules.
        Read carefully — violations result in strikes, temporary bans, or
        permanent removal.
      </p>
      <p className="font-mc-body text-xs text-neutral-400 mt-4">
        Review the strike system below before exploring rules in detail.
      </p>
    </motion.div>
  );
}
