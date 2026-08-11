"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CountdownTimer } from "./CountdownTimer";
import { CopyIpButton } from "@/components/ui/CopyIpButton";
import { ScrollHint } from "./ScrollHint";

export function HeroSection() {
  return (
    <div className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col justify-center items-center text-center">
      {/* Sign plate — the wiki's banner pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 mc-panel-raised pixel-corners pixel-slot px-6 py-2"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          • Project Sulfuria // Commencing Aug 21
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        <h1 className="font-mc-header text-4xl sm:text-5xl md:text-7xl text-white mb-6 mc-text-shadow leading-relaxed">
          Sulfuria
        </h1>
        <p className="font-mc-body text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-3 leading-relaxed">
          A 100-Day Zombie Apocalypse Factions Hardcore Challenge. Custom map.
          Fabric mods. One life.*
        </p>
        <p className="font-mc-body text-[11px] text-foreground/40 max-w-xl mx-auto mb-10">
          *Up to two additional lives may be purchased via the Store.
        </p>
      </motion.div>

      {/* Countdown */}
      <CountdownTimer />

      {/* CTA row — hotbar of actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 w-full justify-center"
      >
        <CopyIpButton ip="play.RIFTSCAPE.net" />

        <Link
          href="/store"
          className="mc-btn pixel-corners px-8 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex items-center justify-center"
        >
          Store
        </Link>

        <button className="mc-btn pixel-corners px-8 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest">
          Join Discord
        </button>
      </motion.div>

      {/* Scroll Hint */}
      <ScrollHint />
    </div>
  );
}
