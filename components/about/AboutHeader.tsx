"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CopyIpButton } from "@/components/ui/CopyIpButton";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { DISCORD_URL } from "@/lib/links";

export function AboutHeader() {
  return (
    <div className="max-w-3xl mb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 mc-panel-raised pixel-corners pixel-slot px-6 py-2 inline-block"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          • The Riftscape Project
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-mc-header text-3xl sm:text-4xl md:text-5xl mb-4 mc-text-shadow leading-relaxed"
      >
        One World. One Life. <span className="text-accent">No Mercy.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mb-8 leading-relaxed"
      >
        RIFTSCAPE runs Sulfuria — a 100-day hardcore Factions gauntlet where
        custom Fabric mods, zombie hordes, and rival factions decide
        who&apos;s still standing on Day 100.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="flex flex-col sm:flex-row flex-wrap gap-3"
      >
        <CopyIpButton
          ip="play.riftscape.net"
          variant="inline"
          className="text-xs"
        />

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mc-btn pixel-corners px-6 py-4 font-mc-sub text-xs uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <DiscordIcon className="w-4 h-4" />
          Join Discord
        </a>

        <Link
          href="/map"
          className="mc-btn pixel-corners px-6 py-4 font-mc-sub text-xs uppercase tracking-widest flex items-center justify-center"
        >
          Explore the Map
        </Link>
      </motion.div>
    </div>
  );
}
