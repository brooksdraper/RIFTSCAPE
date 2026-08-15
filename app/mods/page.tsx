"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ModsHeader } from "@/components/mods/ModsHeader";
import { ModpackCard } from "@/components/mods/ModpackCard";
import { MODPACKS, MC_VERSION } from "@/components/mods/mods-data";

export default function ModsPage() {
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
        <ModsHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MODPACKS.map((pack, index) => (
            <ModpackCard key={pack.id} pack={pack} index={index} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mc-panel pixel-corners p-6 max-w-4xl mx-auto mt-10 text-center"
        >
          <h3 className="font-mc-header text-sm mb-3 mc-text-shadow">
            Installing a Pack
          </h3>
          <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed max-w-2xl mx-auto">
            Install Fabric Loader for{" "}
            <span className="text-accent">{MC_VERSION}</span>, then drop the
            downloaded pack into your launcher as a new profile. Both packs
            connect to the same server IP — Pro only changes what you see on
            your end.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-lg"
        >
          <div className="mc-panel-raised pixel-corners p-6 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="w-10 h-10 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
                <span className="font-mc-header text-[14px] text-accent">
                  ↓
                </span>
              </span>
              <h3 className="font-mc-header text-sm mc-text-shadow leading-relaxed">
                Download RIFTSCAPE Latest Standalone
              </h3>
            </div>
            <a
              href="/jar/riftscape/riftscape-1.0.0.jar"
              download
              className="mc-btn mc-btn-accent pixel-corners px-6 py-4 font-mc-sub text-[10px] uppercase tracking-widest inline-flex items-center justify-center"
            >
              Download .jar
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
