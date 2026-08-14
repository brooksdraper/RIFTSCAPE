"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function NoCredentialsNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12"
    >
      {/* Empty inventory slot */}
      <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
        <span className="font-mc-sub text-[9px] tracking-widest uppercase text-foreground/30">
          Empty
        </span>
      </div>

      <h2 className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed">
        No ID on Record
      </h2>
      <p className="font-mc-body text-foreground/60 mb-8 leading-relaxed text-sm">
        Sign in with the pill in the top-left corner to pull up your
        RIFTSCAPE ID, or enroll first if you have not yet joined the run.
      </p>

      <Link
        href="/#enroll"
        className="mc-btn mc-btn-accent pixel-corners inline-block px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
      >
        Enroll Now
      </Link>
    </motion.div>
  );
}
