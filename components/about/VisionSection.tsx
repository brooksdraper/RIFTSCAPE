"use client";

import { motion } from "motion/react";

export function VisionSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mb-24"
    >
      <h2 className="font-mc-header text-2xl md:text-3xl mb-5 mc-text-shadow leading-relaxed">
        The Riftscape Vision
      </h2>
      <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 leading-relaxed">
        Most servers pick a lane: sandbox survival or competitive PvP.
        Riftscape refuses to choose. Every season drops you into a
        hand-built world with a hardcore modded ecosystem, a ticking clock,
        and one life to make your mark. Factions aren&apos;t a plugin
        feature here — they&apos;re the only thing standing between you and
        the horde. Build alliances you can trust, because on Sulfuria,
        betrayal kills you just as fast as a zombie swarm.
      </p>
    </motion.div>
  );
}
