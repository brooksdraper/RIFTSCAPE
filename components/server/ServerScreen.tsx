"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import { PlayerPlate, type FieldTerminalPlayer } from "./PlayerPlate";
import { ServerReadout } from "./ServerReadout";
import type { ServerStatus } from "@/lib/server-status";
import type { SupporterViewer } from "@/lib/store/supporter-items";

type State = "online" | "offline" | "unknown";

const STATE_STYLE: Record<State, { label: string; color: string }> = {
  online: { label: "Connected", color: "var(--mc-success)" },
  offline: { label: "Offline", color: "var(--mc-danger)" },
  unknown: { label: "No Signal", color: "var(--mc-common)" },
};

interface ServerScreenProps {
  status: ServerStatus | null;
  player: FieldTerminalPlayer;
}

export function ServerScreen({ status, player }: ServerScreenProps) {
  const state: State =
    status === null ? "unknown" : status.online ? "online" : "offline";
  const { label, color } = STATE_STYLE[state];

  // Unlocks run off the account's tag, same as the supporter store. No
  // playtime source feeds the terminal, so the Survivor-gate progress stays
  // framework-only here too.
  const viewer: SupporterViewer = {
    tier: player.status === "enrolled" ? player.profile.tier : null,
    playtimeHours: null,
  };

  return (
    // A container GUI opens as a sprite, so this snaps in rather than rising
    // the way the site's pages do.
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        default: { duration: 0.18, ease: "easeOut" },
        layout: { duration: 0.22, ease: "easeOut" },
      }}
      className="relative z-10 w-full max-w-4xl mc-panel-raised pixel-corners-lg border-2 border-black p-4 sm:p-5"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-2.5 h-10 bg-accent shrink-0" />
          <div className="min-w-0">
            <div className="font-mc-header text-base sm:text-lg leading-relaxed mc-text-shadow truncate">
              Sulfuria
            </div>
            <div className="font-mc-sub text-[10px] text-accent/70 uppercase tracking-widest mt-0.5">
              Field Terminal
            </div>
          </div>
        </div>

        <div className="mc-chip pixel-corners-sm pixel-slot px-3.5 py-2.5 inline-flex items-center gap-2 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            {state === "online" && (
              <span
                className="absolute inline-flex h-full w-full animate-ping opacity-75"
                style={{ backgroundColor: color }}
              />
            )}
            <span
              className="relative inline-flex h-2.5 w-2.5"
              style={{ backgroundColor: color }}
            />
          </span>
          <span
            className="font-mc-sub text-[10px] uppercase tracking-widest whitespace-nowrap"
            style={{ color }}
          >
            {label}
          </span>
        </div>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
      >
        <PlayerPlate player={player} />
        <ServerReadout viewer={viewer} />
      </motion.div>

      {/* Wide action button, the way a vanilla menu stacks them */}
      <Link
        href="https://map.riftscape.net"
        className="mc-btn mc-btn-accent pixel-corners mt-4 sm:mt-5 w-full px-6 py-5 font-mc-sub text-sm uppercase tracking-widest flex items-center justify-center gap-3"
      >
        <MapIcon className="w-5 h-5 shrink-0" strokeWidth={2} />
        Open Map
      </Link>
    </motion.div>
  );
}
