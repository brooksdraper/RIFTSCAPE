"use client";

import { motion } from "motion/react";

export function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40 font-mc-sub text-[10px] tracking-widest animate-pulse"
    >
      <span>SCROLL FOR INTEL</span>
      <div className="w-0.5 h-8 bg-gradient-to-b from-foreground/40 to-transparent" />
    </motion.div>
  );
}
