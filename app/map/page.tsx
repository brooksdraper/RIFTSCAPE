"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { MapHeader } from "@/components/map/MapHeader";
import { MapOverview } from "@/components/map/MapOverview";
import { RegionCard } from "@/components/map/RegionCard";
import { PointsOfInterest } from "@/components/map/PointsOfInterest";
import { MAP_REGIONS } from "@/components/map/map-data";

export default function MapPage() {
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

        <MapHeader />

        <MapOverview />

        <section className="mb-16">
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
            <div>
              <h2 className="font-mc-header text-lg sm:text-xl text-foreground tracking-tight mc-text-shadow">
                Featured Regions
              </h2>
              <p className="font-mc-body text-xs text-neutral-400 mt-2">
                Ground-level scouting reports from six charted biomes on
                Sulfuria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MAP_REGIONS.map((region, index) => (
              <RegionCard key={region.id} region={region} index={index} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 pb-4 border-b-2 border-black">
            <h2 className="font-mc-header text-lg sm:text-xl text-foreground tracking-tight mc-text-shadow">
              Charted Landmarks
            </h2>
            <p className="font-mc-body text-xs text-neutral-400 mt-2">
              Visible from orbit, unconfirmed on the ground. Scout at your
              own risk.
            </p>
          </div>

          <PointsOfInterest />
        </section>
      </div>
    </main>
  );
}
