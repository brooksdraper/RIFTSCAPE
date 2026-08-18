"use client";

import { motion } from "motion/react";
import type { Rule } from "./rules-data";

interface RuleCardProps {
  rule: Rule;
  index?: number;
}

export function RuleCard({ rule, index = 0 }: RuleCardProps) {
  const strikeColor =
    rule.strikeType === "BLACK"
      ? "bg-purple-800 text-purple-100"
      : "bg-red-700 text-red-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      className="mc-panel pixel-corners border-2 border-black"
    >
      <div className="p-4 sm:p-5">
        {/* Header: Title + Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-mc-header text-sm sm:text-base leading-tight text-foreground">
            {rule.title}
          </h3>
          <div
            className={`pixel-slot ${strikeColor} border-2 border-black px-2 pb-1 flex-shrink-0`}
          >
            <span className="font-mc-header text-[10px] tracking-widest uppercase">
              {rule.strikeType}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="font-mc-body text-xs text-neutral-300 mb-4">
          {rule.summary}
        </p>

        {/* Violations */}
        <div className="mb-4">
          <p className="font-mc-sub text-[10px] text-foreground uppercase tracking-widest mb-2">
            Violations
          </p>
          <ul className="space-y-1">
            {rule.violations.map((violation, i) => (
              <li key={i} className="font-mc-body text-xs text-neutral-400">
                <span className="mr-2">•</span>
                {violation}
              </li>
            ))}
          </ul>
        </div>

        {/* Consequence Box */}
        <div className="pixel-slot bg-neutral-950 border-2 border-black p-3 space-y-2">
          <div>
            <p className="font-mc-sub text-[10px] text-foreground uppercase tracking-widest">
              Consequence
            </p>
            <p className="font-mc-body text-xs text-neutral-300">
              {rule.consequence}
            </p>
          </div>

          {rule.tempBan && (
            <div className="pt-2 border-t border-neutral-700">
              <p className="font-mc-sub text-[10px] text-foreground uppercase tracking-widest">
                Temp Ban
              </p>
              <p className="font-mc-body text-xs text-neutral-300">
                {rule.tempBan}
              </p>
            </div>
          )}

          {rule.factionImpact && (
            <div className="pt-2 border-t border-neutral-700">
              <p className="font-mc-sub text-[10px] text-foreground uppercase tracking-widest">
                Faction Impact
              </p>
              <p className="font-mc-body text-xs text-neutral-300">
                {rule.factionImpact}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
