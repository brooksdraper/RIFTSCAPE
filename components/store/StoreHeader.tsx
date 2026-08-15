"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { SaleBanner } from "./SaleBanner";

export function StoreHeader() {
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
            src="/img/Sulfuria_Swamp.png"
            alt="Sulfuria Swamp"
            fill
            priority
            className="object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10">
          <div className="py-6 md:py-8">
            <SaleBanner />
          </div>

          <div className="px-6 pb-20 md:pb-28 text-center">
            <span className="inline-block mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase px-6 py-2 mb-6 mc-text-shadow">
              Trading Post
            </span>
            <h1 className="font-mc-header text-3xl sm:text-4xl md:text-5xl text-white mb-5 mc-text-shadow leading-relaxed">
              Supply <span className="text-accent">Drop</span>
            </h1>
            <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mx-auto mb-4 leading-relaxed">
              Gear up, flex on the server, or secure a second chance. All
              purchases directly support server hosting and development.
            </p>
            <p className="font-mc-body text-[11px] text-foreground/50 max-w-xl mx-auto leading-relaxed">
              Extra lives are capped at two per account. Tags and perks are
              valid for the current 100-Day season only and do not carry over.
              Lives cannot be gifted or transferred. All purchases are final and
              non-refundable.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
