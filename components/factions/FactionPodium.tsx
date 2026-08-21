"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  Activity,
  Clock,
  Crown,
  PawPrint,
  Skull,
  Swords,
  Users,
} from "lucide-react";
import { getFactionBaseColor, lightenHex } from "@/lib/factions/colors";
import type { FactionStanding } from "@/lib/factions";

interface FactionPodiumProps {
  /** Exactly the top 3 standings, pre-sorted by power score descending. */
  standings: FactionStanding[];
}

const PODIUM_ORDER = [1, 0, 2]; // display order: #2, #1, #3

const FORMULA_STATS: Array<{
  key: keyof FactionStanding;
  label: string;
  icon: typeof Clock;
  color: string;
  format: (standing: FactionStanding) => string | number;
}> = [
  {
    key: "playtimeHours",
    label: "Playtime",
    icon: Clock,
    color: "var(--foreground)",
    format: (s) => `${s.playtimeHours}h`,
  },
  {
    key: "pvpKills",
    label: "PvP Kills",
    icon: Swords,
    color: "var(--accent)",
    format: (s) => s.pvpKills,
  },
  {
    key: "pvpDeaths",
    label: "PvP Deaths",
    icon: Skull,
    color: "var(--mc-danger)",
    format: (s) => s.pvpDeaths,
  },
  {
    key: "mobKills",
    label: "Mob Kills",
    icon: PawPrint,
    color: "var(--mc-success)",
    format: (s) => s.mobKills,
  },
  {
    key: "activityIndex",
    label: "Activity",
    icon: Activity,
    color: "var(--mc-legendary)",
    format: (s) => `${Math.round(s.activityIndex * 100)}%`,
  },
];

export function FactionPodium({ standings }: FactionPodiumProps) {
  return (
    <div className="mc-panel pixel-corners border-2 border-black px-6 py-10 mb-10">
      <h2 className="font-mc-header text-xl sm:text-2xl text-center text-foreground mb-8 mc-text-shadow leading-relaxed">
        Top <span className="text-accent">Factions</span>
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6">
        {PODIUM_ORDER.map((rankIndex) => {
          const standing = standings[rankIndex];
          if (!standing) return null;

          const rank = rankIndex + 1;
          const isFirst = rank === 1;
          const color = getFactionBaseColor(standing.baseColor);
          const power = Math.round(standing.powerScore);

          return (
            <motion.div
              key={standing.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: rankIndex * 0.08 }}
              style={{ borderColor: color.hex }}
              className={`mc-panel pixel-corners border-2 flex flex-col items-center text-center px-6 ${
                isFirst
                  ? "py-8 w-full max-w-xs order-first md:order-none"
                  : "py-6 w-full max-w-[15rem]"
              }`}
            >
              <div
                className="font-mc-sub text-[10px] tracking-widest uppercase mb-3"
                style={{ color: color.hex }}
              >
                {isFirst ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Crown size={14} />
                    Rank #1
                  </span>
                ) : (
                  `Rank #${rank}`
                )}
              </div>

              <Image
                src={`https://mc-heads.net/avatar/${encodeURIComponent(standing.ownerMcUuid)}/64`}
                alt={standing.ownerMcUser}
                width={64}
                height={64}
                className={`pixelated border-2 border-black shrink-0 mb-3 ${
                  isFirst ? "w-16 h-16" : "w-12 h-12"
                }`}
              />

              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-4 h-4 border-2 pixel-corners-sm shrink-0"
                  style={{
                    backgroundColor: color.hex,
                    borderColor: lightenHex(color.hex, -28),
                  }}
                />
                <h3
                  className={`font-mc-header text-foreground mc-text-shadow leading-relaxed truncate ${
                    isFirst ? "text-lg" : "text-base"
                  }`}
                >
                  {standing.name}
                </h3>
              </div>

              <div className="w-full mc-chip pixel-corners-sm pixel-slot border-2 border-black px-3 py-2 mb-3">
                <div className="font-mc-header text-xl text-accent leading-relaxed mc-text-shadow">
                  {power.toLocaleString()}
                </div>
                <div className="font-mc-sub text-[8px] tracking-widest uppercase text-foreground/50">
                  Power Score
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 w-full mb-4">
                {FORMULA_STATS.map(({ key, label, icon: Icon, color, format }) => (
                  <div
                    key={key}
                    className="mc-chip pixel-corners-sm pixel-slot border-2 border-black px-1.5 py-1.5 flex flex-col items-center justify-center gap-0.5"
                  >
                    <div
                      className="flex items-center gap-1"
                      style={{ color }}
                    >
                      <Icon size={10} />
                      <span className="font-mc-sub text-[7px] tracking-wider uppercase text-foreground/40">
                        {label}
                      </span>
                    </div>
                    <div className="font-mc-header text-xs text-foreground leading-relaxed">
                      {format(standing)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="inline-flex items-center gap-1.5 font-mc-body text-xs text-foreground/60">
                <Users size={12} />
                {standing.memberCount} Members
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
