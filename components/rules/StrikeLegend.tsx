"use client";

import { motion } from "motion/react";

export function StrikeLegend() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="mb-12 pb-8 border-b-2 border-black"
    >
      <h2 className="font-mc-header text-xl md:text-2xl leading-relaxed text-foreground mc-text-shadow mb-6">
        Strike System
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BLACK Strike */}
        <div className="mc-panel pixel-corners border-2 border-black p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="pixel-slot bg-purple-800 border-2 border-black pixel-corners-sm px-3 py-1">
              <span className="font-mc-header text-xs text-purple-100 tracking-widest">
                BLACK
              </span>
            </div>
            <span className="font-mc-body text-[10px] text-neutral-400 uppercase tracking-widest">
              Automatic Removal
            </span>
          </div>

          <div className="pixel-slot bg-neutral-950 border-2 border-black p-4">
            <div className="space-y-3">
              <div>
                <p className="font-mc-sub text-xs text-foreground uppercase tracking-widest mb-1">
                  Player Consequence
                </p>
                <p className="font-mc-body text-xs text-neutral-300">
                  1 BLACK strike = immediate permanent removal
                </p>
              </div>

              <div>
                <p className="font-mc-sub text-xs text-foreground uppercase tracking-widest mb-1">
                  Faction Consequence
                </p>
                <p className="font-mc-body text-xs text-neutral-300">
                  2 BLACK strikes = faction disbandment + permanent reform ban
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-700">
                <p className="font-mc-body text-[10px] text-neutral-400">
                  Examples: duping, exploit abuse, severe harassment, hate
                  speech
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RED Strike */}
        <div className="mc-panel pixel-corners border-2 border-black p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="pixel-slot bg-red-700 border-2 border-black pixel-corners-sm px-3 py-1">
              <span className="font-mc-header text-xs text-red-100 tracking-widest">
                RED
              </span>
            </div>
            <span className="font-mc-body text-[10px] text-neutral-400 uppercase tracking-widest">
              Three-Strike System
            </span>
          </div>

          <div className="pixel-slot bg-neutral-950 border-2 border-black p-4">
            <div className="space-y-3">
              <div>
                <p className="font-mc-sub text-xs text-foreground uppercase tracking-widest mb-1">
                  Player Consequence
                </p>
                <p className="font-mc-body text-xs text-neutral-300">
                  3 RED strikes = permanent removal
                </p>
                <p className="font-mc-body text-xs text-neutral-400 mt-1">
                  After 2 RED strikes: temporary ban (3–14 days, scales with
                  severity)
                </p>
              </div>

              <div>
                <p className="font-mc-sub text-xs text-foreground uppercase tracking-widest mb-1">
                  Faction Consequence
                </p>
                <p className="font-mc-body text-xs text-neutral-300">
                  8 RED strikes = faction disbandment + permanent reform ban
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-700">
                <p className="font-mc-body text-[10px] text-neutral-400">
                  Examples: griefing, claim violations, minor exploits,
                  toxicity, raid violations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
