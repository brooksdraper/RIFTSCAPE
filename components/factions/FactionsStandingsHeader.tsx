"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Flag } from "lucide-react";

export function FactionsStandingsHeader() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center text-foreground/60 hover:text-accent font-mc-sub text-xs tracking-widest uppercase transition-colors mb-8"
      >
        <span className="mr-2">←</span> Back to HQ
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden mc-panel pixel-corners-lg mb-16"
      >
        <div className="absolute inset-0">
          <Image
            src="/img/Sulfuria_Mountains.png"
            alt="Sulfuria Mountains"
            fill
            priority
            className="object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 px-6 py-20 md:py-28 text-center">
          <span className="inline-block mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase px-6 py-2 mb-6 mc-text-shadow">
            Factions
          </span>
          <h1 className="font-mc-header text-3xl sm:text-4xl md:text-5xl text-white mb-5 mc-text-shadow leading-relaxed">
            Faction <span className="text-accent">Standings</span>
          </h1>
          <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mx-auto leading-relaxed mb-8">
            The season leaderboard — bragging rights for whoever&apos;s on top.
          </p>
          <Link
            href="/preregister-factions"
            className="mc-btn mc-btn-accent pixel-corners inline-flex items-center gap-2 px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
          >
            <Flag size={14} />
            Join The Fight
          </Link>
        </div>
      </motion.div>
    </>
  );
}
