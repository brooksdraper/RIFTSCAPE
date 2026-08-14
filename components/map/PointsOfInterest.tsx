"use client";

import { motion } from "motion/react";
import { Mountain, Waves, Trees, Cloud, Anchor } from "lucide-react";
import { POINTS_OF_INTEREST, PointOfInterest } from "./map-data";

const ICONS: Record<PointOfInterest["icon"], typeof Mountain> = {
  mountain: Mountain,
  waves: Waves,
  trees: Trees,
  cloud: Cloud,
  anchor: Anchor,
};

export function PointsOfInterest() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {POINTS_OF_INTEREST.map((poi, index) => {
        const Icon = ICONS[poi.icon];
        return (
          <motion.div
            key={poi.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
            className="mc-chip pixel-corners-sm pixel-slot p-3.5 flex flex-col items-center text-center gap-2"
          >
            <Icon className="w-5 h-5 text-accent" strokeWidth={2} />
            <div>
              <div className="font-mc-sub text-[10px] text-foreground uppercase tracking-wider leading-tight">
                {poi.name}
              </div>
              <div className="font-mc-body text-[10px] text-neutral-500 mt-1 leading-snug">
                {poi.note}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
