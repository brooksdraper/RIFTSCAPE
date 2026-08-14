"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, Store as StoreIcon } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { CopyIpButton } from "@/components/ui/CopyIpButton";
import { ScrollHint } from "./ScrollHint";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 00-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 00-5.487 0 12.36 12.36 0 00-.617-1.23.077.077 0 00-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 00-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 00.031.055 20.03 20.03 0 005.993 2.98.078.078 0 00.084-.026c.462-.62.874-1.275 1.226-1.963a.075.075 0 00-.041-.106 13.2 13.2 0 01-1.872-.878.076.076 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.764 8.18 1.764 12.061 0a.074.074 0 01.078.009c.12.098.246.198.373.292a.076.076 0 01-.006.127 12.4 12.4 0 01-1.873.878.076.076 0 00-.04.107c.36.687.772 1.341 1.225 1.962a.077.077 0 00.084.028 19.963 19.963 0 006-2.98.077.077 0 00.032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 00-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.211 0 2.176 1.077 2.157 2.38 0 1.312-.955 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
    </svg>
  );
}

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

      {/* CTA row — bento grid of actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-3 sm:grid-rows-2 gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl mx-auto"
      >
        <CopyIpButton
          ip="play.RIFTSCAPE.net"
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

        <button className="mc-btn pixel-corners col-span-2 px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex items-center justify-center gap-3">
          <DiscordIcon className="w-5 h-5" />
          Join Discord
        </button>
      </motion.div>

      {/* Scroll Hint */}
      <ScrollHint />
    </div>
  );
}
