"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { CopyIpButton } from "@/components/ui/CopyIpButton";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { DISCORD_URL } from "@/lib/links";
import { MapIcon } from "lucide-react";

const summaryStats = [
  { label: "Season End", value: "N/A" },
  { label: "Factions", value: "N/A" },
  { label: "Players", value: "N/A" },
  { label: "Threat Level", value: "N/A / 5" },
];

export function AboutHeader() {
  return (
    <div className="max-w-4xl mb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6 mc-panel-raised pixel-corners pixel-slot px-6 py-2 inline-block"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          The Riftscape Project
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-mc-header text-3xl sm:text-4xl md:text-5xl mb-4 mc-text-shadow leading-relaxed"
      >
        One World. Every Death Costs You. <span className="text-accent">No Mercy.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mb-6 leading-relaxed"
      >
        Sulfuria is a 60-day hardcore factions gauntlet running Hardcore Lite
        (Life Drain): every death permanently drains a heart, and when your
        hearts run out, you drop to spectator mode for good. Learn the world,
        build your position, and survive long enough to matter.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="flex flex-col sm:flex-row flex-wrap gap-3 mb-8"
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
          className="mc-btn pixel-corners px-6 py-4 font-mc-sub text-xs uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <MapIcon className="w-4 h-4" />
          Explore the Map
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl"
      >
        {summaryStats.map((stat) => (
          <div
            key={stat.label}
            className="mc-panel pixel-corners p-4 text-center flex flex-col items-center justify-center min-h-[96px]"
          >
            <span className="font-mc-sub text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
              {stat.label}
            </span>
            <span className="font-mc-header text-base sm:text-lg text-accent mc-text-shadow leading-relaxed">
              {stat.value}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
