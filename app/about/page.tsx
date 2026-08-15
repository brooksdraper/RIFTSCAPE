"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AboutHeader } from "@/components/about/AboutHeader";
import { VisionSection } from "@/components/about/VisionSection";
import { SulfuriaIntroSection } from "@/components/about/SulfuriaIntroSection";
import { AboutFeatureGrid } from "@/components/about/AboutFeatureGrid";
import { RoadmapSection } from "@/components/about/RoadmapSection";
import { FairPlaySection } from "@/components/about/FairPlaySection";

export default function AboutPage() {
  return (
    <main className="min-h-screen stone-bg text-foreground selection:bg-accent/30 overflow-x-hidden relative pb-28">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-foreground/60 hover:text-accent font-mc-sub text-xs tracking-widest uppercase transition-colors mb-8"
          >
            <span className="mr-2">←</span> Back to HQ
          </Link>
        </motion.div>

        <AboutHeader />
        <VisionSection />
        <SulfuriaIntroSection />
      </div>

      <div className="relative z-10">
        <AboutFeatureGrid />
        <RoadmapSection />
        <FairPlaySection />
      </div>
    </main>
  );
}
