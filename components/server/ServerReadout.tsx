"use client";

import { MC_VERSION, LOADER_VERSION } from "@/components/mods/mods-data";
import type { ServerStatus } from "@/lib/server-status";

// The tiles are narrow, so they show the bare version numbers and push the
// product name down into the label. Both still come from the modpack
// constants so this can't drift from the download page.
const MC_NUMBER = MC_VERSION.split(" ").pop();
const LOADER_NUMBER = LOADER_VERSION.split(" ").pop();

const SURVIVORS_REQUIRED = 100;

interface ServerReadoutProps {
  status: ServerStatus | null;
  enrolled: number;
}

export function ServerReadout({ status, enrolled }: ServerReadoutProps) {
  const tiles = [
    {
      label: "Online Now",
      value: status?.online ? status.players.toLocaleString() : "—",
    },
    { label: "Enrolled", value: `${enrolled}/${SURVIVORS_REQUIRED}` },
    { label: "Minecraft", value: MC_NUMBER },
    { label: "Fabric", value: LOADER_NUMBER },
  ];

  return (
    <div className="pixel-slot pixel-corners border-2 border-black bg-black/60 p-5 flex flex-col">
      <span className="font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
        World
      </span>

      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="mc-chip pixel-corners-sm pixel-slot px-3 py-3.5 text-center"
          >
            <div className="font-mc-header text-sm sm:text-base text-accent mc-text-shadow leading-relaxed truncate">
              {tile.value}
            </div>
            <div className="font-mc-sub text-[9px] text-neutral-400 uppercase tracking-widest mt-1.5">
              {tile.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
