"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function SupporterStoreHeader() {
  return (
    <>
      <Link
        href="/store"
        className="inline-flex items-center text-foreground/60 hover:text-accent font-mc-sub text-xs tracking-widest uppercase transition-colors mb-8"
      >
        <span className="mr-2">←</span> Back to Supply Drop
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden mc-panel pixel-corners-lg mb-12"
      >
        <div className="absolute inset-0">
          <Image
            src="/img/Sulfuria_Meadow.png"
            alt="Sulfuria Meadow"
            fill
            priority
            className="object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 px-6 py-20 md:py-24 text-center">
          <span className="inline-block mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase px-6 py-2 mb-6 mc-text-shadow">
            Rank Perks
          </span>
          <h1 className="font-mc-header text-3xl sm:text-4xl md:text-5xl text-white mb-5 mc-text-shadow leading-relaxed">
            Cosmetic <span className="text-accent">Vault</span>
          </h1>
          <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mx-auto mb-4 leading-relaxed">
            Every chat icon, chat color, emote, and rank perk on the server.
            Nothing here is sold on its own — the Survivor set is earned with 20
            hours of online play, and the rest comes with a tag.
          </p>
          <p className="font-mc-body text-[11px] text-foreground/50 max-w-xl mx-auto leading-relaxed">
            Tags are cumulative: each one unlocks everything below it, so an
            Archon holds the whole vault. Cosmetics are cosmetic — none of them
            affect combat, loot, or the 60-day timer, and all of them reset at
            the end of the season.
          </p>
        </div>
      </motion.div>
    </>
  );
}
