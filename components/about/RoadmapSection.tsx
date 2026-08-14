"use client";

import { motion } from "motion/react";
import { ROADMAP_PHASES } from "./roadmap-data";

export function RoadmapSection() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-24 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 pb-4 border-b-2 border-black"
      >
        <span className="mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] tracking-widest uppercase px-4 py-2 mb-4 inline-block mc-text-shadow">
          • The 100-Day Roadmap
        </span>
        <h2 className="font-mc-header text-2xl md:text-3xl mb-2 mc-text-shadow leading-relaxed">
          How Sulfuria Unfolds
        </h2>
        <p className="font-mc-body text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
          Six phases, one countdown. Here&apos;s what to expect between
          spawn and sundown.
        </p>
      </motion.div>

      <div className="relative pl-8 border-l-2 border-black space-y-8 max-w-3xl">
        {ROADMAP_PHASES.map((phase, index) => (
          <motion.div
            key={phase.day}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
            className="relative"
          >
            <span className="absolute -left-[41px] top-0 w-6 h-6 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
              <span className="w-2 h-2 bg-accent" />
            </span>
            <div className="mc-panel pixel-corners p-6">
              <span className="font-mc-header text-xs text-accent mc-text-shadow">
                {phase.day}
              </span>
              <h3 className="font-mc-header text-sm sm:text-base mt-2 mb-2 mc-text-shadow leading-relaxed">
                {phase.title}
              </h3>
              <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed">
                {phase.copy}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="font-mc-body text-[11px] text-foreground/40 max-w-3xl mt-8 leading-relaxed">
        Exact milestone dates confirm in Discord as Day 0 approaches — this
        roadmap sets expectations, not a patch schedule.
      </p>
    </div>
  );
}
