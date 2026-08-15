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
      <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-[color:var(--mc-legendary)]">
        <Lock size={26} className="animate-pulse" />
      </div>

      <h2 className="font-mc-header text-xl sm:text-2xl text-[color:var(--mc-legendary)] mb-3 mc-text-shadow leading-relaxed">
        Store Closed
      </h2>
      <p className="font-mc-body text-foreground/60 leading-relaxed text-sm">
        The Trading Post is not open right now. Check back another time.
      </p>

      {/* Remove after release */}
      <span className="font-mc-body text-foreground/60 leading-relaxed text-[8px]">
        The Trading Post will open upon server release TBD.
      </span>
    </motion.div>
  );
}
