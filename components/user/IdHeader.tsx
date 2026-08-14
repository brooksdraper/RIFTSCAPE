"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function IdHeader() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mc-sub text-[11px] uppercase tracking-widest text-foreground/60 hover:text-accent transition-colors mb-8"
      >
        <span>←</span> Back to HQ
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10 sm:mb-14"
      >
        <span className="inline-flex items-center gap-2 mc-panel-raised pixel-corners pixel-slot border-2 border-black font-mc-sub text-accent text-[11px] tracking-widest uppercase px-6 py-2 mc-text-shadow mb-6">
          <span className="w-2 h-2 bg-accent shrink-0" />
          Player Registry
        </span>

        <h1 className="font-mc-header text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 mc-text-shadow leading-relaxed">
          RIFTSCAPE <span className="text-accent">ID</span>
        </h1>

        <p className="font-mc-body text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Your current RIFTSCAPE member status, issued on enrollment.
        </p>
      </motion.div>
    </>
  );
}
