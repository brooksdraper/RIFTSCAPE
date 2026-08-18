"use client";

import { motion } from "motion/react";

const features = [
  {
    number: "01",
    title: "Zombie Hordes",
    description:
      "The world is a pressure cooker. Zombies are a constant threat, and the server loop is designed to keep players on their toes. The map, events, and mechanics are all tuned to create danger that makes every decision matter.",
  },
  {
    number: "02",
    title: "Factions & Territory",
    description:
      "Players can organize into groups, establish claims, and build defensible bases as the world gets more dangerous. Faction structure is part of the server loop, and raids are a real risk instead of a side activity.",
  },
  {
    number: "03",
    title: "The World & The Community",
    description:
      "The map, wiki, Discord, and server systems work together to help players understand the world before they commit. This is a project built around clear expectations and a community that thrives on the pressure of a short, brutal campaign.",
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
