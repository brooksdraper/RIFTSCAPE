"use client";

import { motion } from "motion/react";
import { MC_VERSION, LOADER_VERSION } from "./mods-data";

export function ModsHeader() {
  return (
    <div className="text-center max-w-4xl mx-auto mb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative inline-block mb-6 pixel-corners bg-neutral-900 pixel-slot px-6 py-2 border-2 border-black"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          RIFTSCAPE MODPACKS
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-mc-header text-3xl sm:text-4xl text-foreground tracking-tight mb-4 mc-text-shadow leading-relaxed"
      >
        Choose Your <span className="text-accent">Loadout</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
      >
        Both packs run on the same Fabric build and connect to the same
        server. Pro just adds shaders, performance mods, and QoL on top.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="inline-flex flex-wrap items-center justify-center gap-2"
      >
        <span className="bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot font-mc-body text-[11px] text-neutral-300 tracking-wide px-3 py-1">
          {MC_VERSION}
        </span>
        <span className="bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot font-mc-body text-[11px] text-neutral-300 tracking-wide px-3 py-1">
          {LOADER_VERSION}
        </span>
      </motion.div>
    </div>
  );
}
