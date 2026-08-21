"use client";

import { motion } from "motion/react";
import { Activity, PawPrint, Skull, Swords, Users } from "lucide-react";
import { getFactionBaseColor, lightenHex } from "@/lib/factions/colors";
import type { FactionStanding } from "@/lib/factions";

interface FactionRankedListProps {
  /** Standings from rank #4 onward, pre-sorted by power score descending. */
  standings: FactionStanding[];
  /** Rank of the first entry in `standings` (4, since 1-3 are the podium). */
  startingRank: number;
}

export function FactionRankedList({
  standings,
  startingRank,
}: FactionRankedListProps) {
  if (standings.length === 0) return null;

  return (
    <div className="mc-panel pixel-corners border-2 border-black p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-3">
        {standings.map((standing, index) => {
          const rank = startingRank + index;
          const color = getFactionBaseColor(standing.baseColor);
          const kd = (
            standing.pvpKills / Math.max(standing.pvpDeaths, 1)
          ).toFixed(1);
          const power = Math.round(standing.powerScore);

          return (
            <motion.div
              key={standing.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="pixel-slot mc-chip pixel-corners-sm border-2 border-black px-4 py-3 flex items-center gap-4"
            >
              <span className="font-mc-header text-sm text-foreground/40 w-8 shrink-0 leading-relaxed">
                #{rank}
              </span>

              <span
                className="w-4 h-4 border-2 pixel-corners-sm shrink-0"
                style={{
                  backgroundColor: color.hex,
                  borderColor: lightenHex(color.hex, -28),
                }}
              />

              <span className="font-mc-sub text-xs sm:text-sm text-foreground uppercase tracking-wide truncate flex-1">
                {standing.name}
              </span>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-mc-body text-xs text-foreground/70">
                <span className="mc-chip pixel-corners-sm border-2 border-black px-2 py-1 inline-flex items-center gap-1.5 font-mc-header text-accent">
                  {power.toLocaleString()}
                  <span className="font-mc-sub text-[8px] text-foreground/40 tracking-wider uppercase">
                    Pwr
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-accent">
                  <Swords size={12} />
                  {standing.pvpKills}
                </span>
                <span
                  className="inline-flex items-center gap-1"
                  style={{ color: "var(--mc-danger)" }}
                >
                  <Skull size={12} />
                  {standing.pvpDeaths}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1">
                  KD {kd}
                </span>
                <span
                  className="hidden md:inline-flex items-center gap-1"
                  style={{ color: "var(--mc-success)" }}
                >
                  <PawPrint size={12} />
                  {standing.mobKills}
                </span>
                <span
                  className="hidden lg:inline-flex items-center gap-1"
                  style={{ color: "var(--mc-legendary)" }}
                >
                  <Activity size={12} />
                  {Math.round(standing.activityIndex * 100)}%
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users size={12} />
                  {standing.memberCount}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
