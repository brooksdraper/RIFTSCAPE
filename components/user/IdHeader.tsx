"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function IdHeader() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center text-foreground/60 hover:text-accent font-mono text-sm tracking-widest uppercase transition-colors mb-8"
      >
        <span className="mr-2">←</span> Back to HQ
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-10 sm:mb-14"
      >
        <span className="inline-flex items-center gap-2 font-mono text-accent text-sm tracking-[0.2em] uppercase bg-accent/10 px-4 py-2 rounded-full border border-accent/20 mb-6">
          Player Registry
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </span>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase drop-shadow-2xl text-white mb-4">
          RIFTSCAPE <span className="text-accent">ID</span>
        </h1>

        <p className="text-lg text-foreground/70 max-w-2xl mx-auto font-light">
          Your current RIFTSCAPE Member Status is: {}
        </p>
      </motion.div>
    </>
  );
}
