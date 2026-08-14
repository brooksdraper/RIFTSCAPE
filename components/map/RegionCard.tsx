"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { MapRegion } from "./map-data";

const THREAT_STYLE: Record<
  MapRegion["threatLevel"],
  { text: string; border: string }
> = {
  Low: { text: "var(--mc-success)", border: "#2a5a2a" },
  Moderate: { text: "var(--mc-legendary)", border: "#8a5a00" },
  Extreme: { text: "var(--mc-danger)", border: "#8a2a2a" },
};

interface RegionCardProps {
  region: MapRegion;
  index?: number;
}

export function RegionCard({ region, index = 0 }: RegionCardProps) {
  const { text: threatText, border: threatBorder } =
    THREAT_STYLE[region.threatLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.1, ease: "easeOut" } }}
      style={{ borderColor: threatBorder }}
      className="bg-neutral-950/90 border-2 pixel-corners overflow-hidden flex flex-col"
    >
      <div className="relative w-full aspect-video border-b-2 border-black overflow-hidden bg-black">
        <Image
          src={region.image}
          alt={region.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-mc-header text-sm leading-tight mc-text-shadow">
            {region.name}
          </h3>
          <span
            className="shrink-0 font-mc-sub text-[9px] uppercase tracking-wider px-2 py-0.5 border-2 pixel-corners-sm bg-black/60"
            style={{ color: threatText, borderColor: threatBorder }}
          >
            {region.threatLevel}
          </span>
        </div>
        <p className="font-mc-body italic text-[11px] text-neutral-500 mb-3">
          {region.tagline}
        </p>
        <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-4">
          {region.description}
        </p>

        <div className="mt-auto space-y-1.5 bg-black/20 p-3 border-2 border-black pixel-corners-sm">
          <span className="block font-mc-sub text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
            Field Notes
          </span>
          {region.features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 font-mc-body text-[11px] text-sky-300/90"
            >
              <span className="text-sky-400 mt-0.5">◆</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
