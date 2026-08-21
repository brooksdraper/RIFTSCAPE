"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useState } from "react";
import type { EnrolledPlayer } from "@/lib/players";
import {
  formatIssueTimestamp,
  registryNumber,
} from "@/lib/players/riftscape-id";
import { SecuritySeal } from "@/components/user/SecuritySeal";
import { ManageMemberModal } from "@/components/admin/ManageMemberModal";

export function SurvivorRosterList({ players }: { players: EnrolledPlayer[] }) {
  const [roster, setRoster] = useState(players);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const selectedPlayer = roster.find((p) => p.id === selectedId) ?? null;
  const visible = roster.filter((p) =>
    p.mc_user.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <h2 className="font-mc-header text-xl sm:text-2xl text-foreground mc-text-shadow leading-relaxed">
          Survivor Roster
        </h2>
        <div className="mc-input pixel-corners-sm flex items-center gap-2 px-3 py-2 w-full sm:w-56">
          <Search size={14} className="text-foreground/40 shrink-0" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery(searchInput);
            }}
            placeholder="Search..."
            className="w-full bg-transparent outline-none font-mc-body text-sm text-foreground placeholder:text-neutral-600"
          />
        </div>
      </div>

      {roster.length === 0 ? (
        <p className="font-mc-body text-sm text-foreground/50">
          No survivors have enrolled yet.
        </p>
      ) : visible.length === 0 ? (
        <p className="font-mc-body text-sm text-foreground/50">
          No survivors match your search.
        </p>
      ) : (
        <div className="mc-scroll flex flex-col gap-1.5 max-h-[560px] overflow-y-auto pr-1">
          {visible.map((player, i) => (
            <motion.button
              key={player.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedId(player.id)}
              className="mc-chip pixel-corners-sm pixel-slot flex items-center gap-3 px-3 py-2 w-full text-left cursor-pointer hover:bg-accent/20 transition-colors"
            >
              <span className="mc-chip pixel-raised pixel-corners-sm font-mc-sub text-[8px] uppercase tracking-wider text-accent/80 px-2 py-1 shrink-0">
                {registryNumber(player.id)}
              </span>
              <Image
                src={`https://mc-heads.net/avatar/${encodeURIComponent(player.mc_user)}/32`}
                alt={player.mc_user}
                width={32}
                height={32}
                className="w-8 h-8 shrink-0 pixelated pixel-corners-sm"
              />
              <span className="font-mc-sub text-lg underline text-foreground truncate">
                {player.mc_user}
              </span>
              <span className="font-mc-sub text-[10px] uppercase tracking-wider text-foreground/60 shrink-0 ml-auto">
                {formatIssueTimestamp(player.created_at)}
              </span>
              <SecuritySeal
                verified={Boolean(player.mc_verified_at)}
                className="w-8 h-8 shrink-0"
              />
            </motion.button>
          ))}
        </div>
      )}

      <ManageMemberModal
        player={selectedPlayer}
        onClose={() => setSelectedId(null)}
        onUpdated={(updated) =>
          setRoster((prev) =>
            prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p))
          )
        }
        onRemoved={(id) => {
          setRoster((prev) => prev.filter((p) => p.id !== id));
          setSelectedId(null);
        }}
      />
    </>
  );
}
