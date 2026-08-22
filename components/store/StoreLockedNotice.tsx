"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";

export function StoreLockedNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ borderColor: "#8a5a00" }}
      className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 px-6 py-12 mb-16 relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-[color:var(--mc-legendary)]"
      >
        <Lock size={26} className="animate-pulse" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="font-mc-header text-xl sm:text-2xl text-[color:var(--mc-legendary)] mb-3 mc-text-shadow leading-relaxed"
      >
        Store Closed
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32, ease: "easeOut" }}
        className="font-mc-body text-foreground/60 leading-relaxed text-sm mb-7"
      >
        The Trading Post is not open right now. Check back another time.
      </motion.p>

      {/* Remove after release */}
      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        className="inline-block mc-chip pixel-corners-sm pixel-slot font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase px-4 py-2"
      >
        Opens on Server Release &mdash; TBD
      </motion.span>
    </motion.div>
  );
}
