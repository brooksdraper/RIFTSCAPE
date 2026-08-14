"use client";

import { motion } from "motion/react";

const features = [
  {
    number: "01",
    title: "Factions & Warfare",
    description:
      "Claim land, fortify your base, and go to war on your terms. Raid rival factions for their resources, or band together to survive the horde. Every claim is contested. Every ally is a gamble.",
  },
  {
    number: "02",
    title: "Hardcore Modded Ecosystem",
    description:
      "Built on an optimized Fabric server hierarchy with custom data packs tuned for brutal survival — proximity voice chat, escalating zombie hordes, rebalanced combat. Progression is earned, not handed out.",
  },
  {
    number: "03",
    title: "Chart the World",
    description:
      "Six charted biomes, faction claims, and landmarks — scout Sulfuria from your browser before you set foot on it. Ground-level reports update as the map is explored.",
  },
];

export function AboutFeatureGrid() {
  return (
    <div className="relative z-10 deepslate-bg border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 py-24 max-w-6xl">
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
      </div>
    </div>
  );
}
