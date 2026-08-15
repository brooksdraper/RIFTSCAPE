"use client";

import { motion } from "motion/react";

const sections = [
  {
    title: "Entry & Expectations",
    points: [
      "All enrolling survivors must be 18 or older.",
      "All sales are final — there are no refunds or exceptions.",
      "Voice chat is required to join the server experience.",
    ],
  },
  {
    title: "World Setup",
    points: [
      "Players spawn randomly across the island, so early survival is always a gamble.",
      "Teams of 2–5 players can assemble and coordinate together.",
      "Official factions require 6 or more members and must control at least 4 chunks of land to be recognized.",
    ],
  },
  {
    title: "Survival Pressure",
    points: [
      "Zombie spawn rates gradually increase across the 100-day timeline.",
      "The wiki is the source of truth for survival and custom mechanics.",
      "Avoid the new INFECTION status effect. If it takes hold, it will eventually kill the player unless treated using the custom methods explained in the wiki.",
    ],
  },
  {
    title: "Hardcore Survival Systems",
    points: [
      "Tough as Nails is installed, so temperature and thirst matter just as much as food and armor.",
      "Every choice has consequence in a world built for survival, adaptation, and long-term planning.",
      "Refer to the roadmap on how the environment will change over the 100-day timeline, and how to prepare for each phase.",
    ],
  },
];

export function SulfuriaIntroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-5xl mb-20"
    >
      <div className="mb-6 mc-panel-raised pixel-corners pixel-slot inline-block px-5 py-2">
        <span className="font-mc-sub text-accent text-[11px] tracking-widest uppercase mc-text-shadow">
          Intro to Sulfuria
        </span>
      </div>

      <div className="mb-8 max-w-3xl">
        <h2 className="font-mc-header text-2xl md:text-3xl mb-4 mc-text-shadow leading-relaxed">
          A brutal island. A short clock. No room for weakness.
        </h2>
        <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 leading-relaxed">
          Sulfuria is a 100-day hardcore survival gauntlet where every decision
          matters. The island is hostile, the timing is unforgiving, and the
          difference between survival and disaster is often a matter of
          preparation, teamwork, and nerve. If you are stepping in, learn the
          systems early, respect the clock, and treat the wiki as your survival
          manual.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="mc-panel pixel-corners p-5 sm:p-6 flex flex-col h-full"
          >
            <h3 className="font-mc-header text-sm sm:text-base mb-4 mc-text-shadow leading-relaxed text-accent">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.points.map((point) => (
                <li
                  key={point}
                  className="font-mc-body text-xs sm:text-sm text-neutral-300/90 leading-relaxed flex gap-3"
                >
                  <span className="mt-1 text-accent">◆</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
