"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, Store as StoreIcon } from "lucide-react";
import { CopyIpButton } from "@/components/ui/CopyIpButton";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { ScrollHint } from "./ScrollHint";
import { DISCORD_URL } from "@/lib/links";
import type { ServerStatus } from "@/lib/server-status";

interface HeroSectionProps {
  status: ServerStatus | null;
}

export function HeroSection({ status }: HeroSectionProps) {
  return (
    <div className="relative z-10 container mx-auto px-6 py-24 min-h-screen flex flex-col justify-center items-center text-center">
      {/* Sign plate — the wiki's banner pattern */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 flex flex-wrap items-center justify-center gap-3"
      >
        <div className="mc-panel-raised pixel-corners pixel-slot px-6 py-2">
          <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
            Project Sulfuria // Help us reach 50 Survivors
          </span>
        </div>

        {status && (
          <div className="mc-chip pixel-corners-sm pixel-slot px-3 py-2 inline-flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {status.online && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping opacity-75"
                  style={{ backgroundColor: "var(--mc-success)" }}
                />
              )}
              <span
                className="relative inline-flex h-2 w-2"
                style={{
                  backgroundColor: status.online
                    ? "var(--mc-success)"
                    : "var(--mc-danger)",
                }}
              />
            </span>
            <span
              className="font-mc-sub text-[11px] tracking-widest uppercase"
              style={{
                color: status.online ? "var(--mc-success)" : "var(--mc-danger)",
              }}
            >
              {status.online ? "Online" : "Offline"}
            </span>
            {/*status.online && (
              <span className="inline-flex items-center gap-1 font-mc-body text-foreground/60 normal-case tracking-normal text-[11px]">
                <User size={12} className="shrink-0" />
                {status.players.toLocaleString()}
              </span>
            )*/}
          </div>
        )}
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
          A 60-Day Zombie Apocalypse Factions Hardcore Challenge. Custom map.
          Fabric mods. One life.*
        </p>
        <p className="font-mc-body text-[11px] text-foreground/40 max-w-xl mx-auto mb-10">
          *Up to two additional lives may be purchased via the Store.
        </p>
      </motion.div>

      {/* CTA row — bento grid of actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 sm:grid-rows-2 gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl mx-auto"
      >
        <CopyIpButton
          ip="play.riftscape.net"
          className="col-span-2 sm:col-span-1 sm:row-span-2 h-full min-h-[104px]"
        />

        <Link
          href="/store"
          className="mc-btn pixel-corners px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex flex-col items-center justify-center gap-2"
        >
          <StoreIcon className="w-5 h-5" strokeWidth={2} />
          Store
        </Link>

        <Link
          href="/wiki"
          className="mc-btn pixel-corners px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex flex-col items-center justify-center gap-2"
        >
          <BookOpen className="w-5 h-5" strokeWidth={2} />
          Wiki
        </Link>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mc-btn pixel-corners col-span-2 px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex items-center justify-center gap-3"
        >
          <DiscordIcon className="w-5 h-5" />
          Join Discord
        </a>
      </motion.div>

      {/* Scroll Hint */}
      <ScrollHint />
    </div>
  );
}
