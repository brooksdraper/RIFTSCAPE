"use client";

import { motion } from "motion/react";

const chapters = [
  {
    title: "Start with the island",
    copy: "You are dropped into a hostile world with no safety net and no time to drift. Your first goal is to survive the opening chaos, secure essentials, and understand what the island is trying to do to you.",
  },
  {
    title: "Build toward a faction",
    copy: "Late-game survival is not a solo act. Establish a base, pick your lane, and decide whether you need a tight alliance, a growing faction, or a simpler survival plan that keeps you alive long enough to matter.",
  },
  {
    title: "Fight when the risk is worth it",
    copy: "Raids, sieges, and claims are where the world becomes real. Smart pressure wins the map. Reckless pressure gets you erased before the run even settles into its rhythm.",
  },
  {
    title: "Outlast the final push",
    copy: "Sulfuria is a short, brutal campaign. The final phase is where structure, discipline, and preparation separate survivors from the players who were still learning the rules when the clock ran out.",
  },
];

const onboardingSteps = [
  "Read the wiki and treat the mechanics as the rulebook for your first few days.",
  "Get a safe start, then decide whether you are surviving alone or building with a team.",
  "Pick your faction or alliance early so your progression has direction.",
  "Learn the pressure cycle before you take your first high-risk fight.",
];

export function SulfuriaIntroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mb-20"
    >
      <div className="mb-6 mc-panel-raised pixel-corners pixel-slot inline-block px-5 py-2">
        <span className="font-mc-sub text-accent text-[11px] tracking-widest uppercase mc-text-shadow">
          Join the run
        </span>
      </div>

      <div className="mb-8 max-w-4xl">
        <h2 className="font-mc-header text-2xl md:text-3xl mb-4 mc-text-shadow leading-relaxed">
          The first week decides the rest of your run.
        </h2>
        <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 leading-relaxed max-w-3xl">
          Sulfuria is not a passive server. It is a campaign with a visible arc:
          set up, survive, adapt, expand, and decide whether you are built to
          endure the pressure when the world starts closing in.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.title}
            className="mc-panel pixel-corners p-5 sm:p-6 flex flex-col h-full"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mc-sub text-[10px] uppercase tracking-widest text-neutral-400">
                Chapter {index + 1}
              </span>
              <span className="w-7 h-7 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center font-mc-header text-[11px] text-accent">
                {index + 1}
              </span>
            </div>
            <h3 className="font-mc-header text-sm sm:text-base mb-3 mc-text-shadow leading-relaxed text-accent">
              {chapter.title}
            </h3>
            <p className="font-mc-body text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
              {chapter.copy}
            </p>
          </div>
        ))}
      </div>

      <div className="mc-panel pixel-corners p-5 sm:p-6">
        <h3 className="font-mc-header text-sm sm:text-base mb-4 text-accent mc-text-shadow leading-relaxed">
          The onboarding path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {onboardingSteps.map((step, index) => (
            <div
              key={step}
              className="mc-panel-raised pixel-corners pixel-slot p-4 flex gap-3 items-start"
            >
              <span className="w-7 h-7 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center font-mc-header text-[11px] text-accent">
                {index + 1}
              </span>
              <p className="font-mc-body text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
