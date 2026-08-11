"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function NoCredentialsNotice() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto text-center border border-foreground/15 bg-neutral-950/70 backdrop-blur-xl px-6 py-12"
    >
      {/* Blank card silhouette */}
      <div className="relative mx-auto mb-7 w-40 h-24 border border-dashed border-foreground/25 flex items-center justify-center">
        <div className="w-10 h-10 border border-dashed border-foreground/25" />
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[8px] tracking-[0.25em] uppercase text-foreground/25">
          Unissued
        </span>
      </div>

      <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-3">
        No ID on Record
      </h2>
      <p className="text-foreground/60 font-light mb-8 leading-relaxed">
        Sign in with the pill in the top-left corner to pull up your RIFTSCAPE
        ID, or enroll first if you have not yet joined the run.
      </p>

      <Link
        href="/#enroll"
        className="inline-block px-8 py-4 bg-transparent border border-accent text-accent hover:bg-accent hover:text-background font-bold uppercase tracking-wider transition-colors duration-300"
      >
        Enroll Now
      </Link>
    </motion.div>
  );
}
