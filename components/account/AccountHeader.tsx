"use client";

import { motion } from "motion/react";

export function AccountHeader() {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative inline-block mb-6 pixel-corners bg-neutral-900 pixel-slot px-6 py-2 border-2 border-black"
      >
        <span className="font-mc-sub text-[11px] tracking-widest uppercase mc-text-shadow">
          RIFTSCAPE ACCOUNT
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-neutral-400 text-sm leading-relaxed"
      >
        Full RIFTSCAPE.net profile and account details.
      </motion.p>
    </div>
  );
}
