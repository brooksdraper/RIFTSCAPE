"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function IdHeader({ hasAccount }: { hasAccount: boolean }) {
  const statusColor = hasAccount ? "var(--mc-success)" : "var(--mc-danger)";

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mc-sub text-[11px] uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors mb-8"
      >
        <span>←</span> Back to HQ
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-10 sm:mb-14"
      >
        <span className="relative inline-flex items-center gap-2 mc-panel-raised pixel-corners pixel-slot border-2 border-black overflow-hidden font-mc-sub text-[11px] tracking-widest uppercase px-6 py-2 mc-text-shadow mb-6 enchant-glint-gold">
          <span
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-foreground">RIFTSCAPE</span>{" "}
          <span className="text-accent">ID</span>
          <span
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: statusColor }}
          />
        </span>
      </motion.div>
    </>
  );
}
