"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Info, Map as MapIcon } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Hardcore Factions",
    description:
      "Form alliances, build impenetrable fortresses, and survive the endless night. If you die, you are banned for the remainder of the 60 days. Trust no one outside your faction.",
  },
  {
    number: "02",
    title: "Custom Map: Sulfuria",
    description:
      "Explore a beautifully haunting, hand-crafted continent by AquaLessPantsu. Navigate toxic biomes, scavenge ruined cities, and fight for the limited resources that remain.",
  },
  {
    number: "03",
    title: "Fabric Enhanced",
    description:
      "A carefully curated modpack featuring proximity voice chat, brutal zombie hordes, enhanced combat mechanics, and new scavengable loot. Progression is tough, engaging, and ruthless.",
  },
];

export function FeatureGrid() {
  return (
    <div className="relative z-10 deepslate-bg border-t-2 border-black">
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <div
              key={feature.number}
              className="mc-panel pixel-corners p-6 flex flex-col"
            >
              {/* Slot-mounted index number */}
              <div className="w-11 h-11 mb-5 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
                <span className="font-mc-header text-sm text-accent mc-text-shadow">
                  {feature.number}
                </span>
              </div>
              <h3 className="font-mc-header text-sm sm:text-base mb-3 mc-text-shadow leading-relaxed">
                {feature.title}
              </h3>
              <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <Link
            href="/about"
            className="mc-btn pixel-corners px-6 py-3 font-mc-sub text-xs text-foreground uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Info className="w-4 h-4" strokeWidth={2} />
            Learn More
          </Link>
          <Link
            href="/map"
            className="mc-btn pixel-corners px-6 py-3 font-mc-sub text-xs text-foreground uppercase tracking-widest inline-flex items-center gap-2"
          >
            <MapIcon className="w-4 h-4" strokeWidth={2} />
            View Map
          </Link>
        </div>
      </div>
    </div>
  );
}
