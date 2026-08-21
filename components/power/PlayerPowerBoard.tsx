"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  Activity,
  Clock,
  Crown,
  PawPrint,
  Search,
  Skull,
  Swords,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { PlayerPower } from "@/lib/server-status";

type RankedPlayer = PlayerPower & { rank: number };

const PODIUM_ORDER = [1, 0, 2]; // display order: #2, #1, #3

const TIER = {
  1: { text: "gold", border: "#D4AF37", label: "Gold" },
  2: { text: "silver", border: "#A8A9AD", label: "Silver" },
  3: { text: "brown", border: "#554A3C", label: "Bronze" },
  common: { text: "var(--mc-common)", border: "#3f3f3f", label: "Survivor" },
} as const;

function tierFor(rank: number) {
  return TIER[rank as 1 | 2 | 3] ?? TIER.common;
}

function StatChip({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Swords;
  color: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="mc-chip pixel-corners-sm pixel-slot border-2 border-black px-1.5 py-1.5 flex flex-col items-center justify-center gap-0.5">
      <div className="flex items-center gap-1" style={{ color }}>
        <Icon size={10} />
        <span className="font-mc-sub text-[7px] tracking-wider uppercase text-foreground/40">
          {label}
        </span>
      </div>
      <div className="font-mc-header text-xs text-foreground leading-relaxed">
        {value}
      </div>
    </div>
  );
}

/** The top-3 hero card, shown only in the podium. */
function PlayerCard({ player }: { player: RankedPlayer }) {
  const tier = tierFor(player.rank);
  const isFirst = player.rank === 1;
  const kd = (player.pvpKills / Math.max(player.pvpDeaths, 1)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3, transition: { duration: 0.1, ease: "easeOut" } }}
      style={{ borderColor: tier.border }}
      className={`mc-panel pixel-corners border-2 flex flex-col items-center text-center px-4 py-7 w-full max-w-xs ${
        isFirst ? "enchant-glint enchant-glint-gold" : ""
      }`}
    >
      <div
        className="font-mc-sub text-[10px] tracking-widest uppercase mb-2.5 flex items-center gap-1.5"
        style={{ color: tier.text }}
      >
        {isFirst && <Crown size={13} />}#{player.rank}
      </div>

      <Image
        src={`https://mc-heads.net/avatar/${encodeURIComponent(player.uuid)}/64`}
        alt={player.name}
        width={56}
        height={56}
        className="pixelated border-2 border-black shrink-0 mb-2.5 w-14 h-14"
      />

      <h3
        className="font-mc-header text-base text-foreground mc-text-shadow leading-relaxed truncate max-w-full mb-3"
        style={{ color: tier.text }}
      >
        {player.name}
      </h3>

      <div className="w-full mc-chip pixel-corners-sm pixel-slot border-2 border-black px-3 py-2 mb-3">
        <div className="font-mc-header text-xl text-accent leading-relaxed mc-text-shadow">
          {Math.round(player.score).toLocaleString()}
        </div>
        <div className="font-mc-sub text-[8px] tracking-widest uppercase text-foreground/50">
          Power Score
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 w-full mb-2.5">
        <StatChip
          icon={Swords}
          color="var(--accent)"
          label="PvP Kills"
          value={player.pvpKills}
        />
        <StatChip
          icon={Skull}
          color="var(--mc-danger)"
          label="K/D"
          value={kd}
        />
        <StatChip
          icon={PawPrint}
          color="var(--mc-success)"
          label="Mob Kills"
          value={player.mobKills}
        />
        <StatChip
          icon={Activity}
          color="var(--mc-legendary)"
          label="Active"
          value={`${Math.round(player.activityIndex * 100)}%`}
        />
      </div>

      <div className="inline-flex items-center gap-1.5 font-mc-body text-[11px] text-foreground/60">
        <Clock size={11} />
        {Math.round(player.playtimeHours)}h logged
      </div>
    </motion.div>
  );
}

/** Everyone outside the podium (4th place and under) — a compact row. */
function PlayerRow({ player, index }: { player: RankedPlayer; index: number }) {
  const tier = tierFor(player.rank);
  const kd = (player.pvpKills / Math.max(player.pvpDeaths, 1)).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="mc-chip pixel-corners-sm pixel-slot flex items-center gap-3 px-3 py-2 w-full"
    >
      <span
        className="font-mc-header text-sm w-8 shrink-0 leading-relaxed text-center"
        style={{ color: tier.text }}
      >
        #{player.rank}
      </span>
      <Image
        src={`https://mc-heads.net/avatar/${encodeURIComponent(player.uuid)}/32`}
        alt={player.name}
        width={32}
        height={32}
        className="w-8 h-8 shrink-0 pixelated pixel-corners-sm"
      />
      <span
        className="font-mc-sub text-sm text-foreground truncate"
        style={{ color: player.rank <= 3 ? tier.text : undefined }}
      >
        {player.name}
      </span>

      <span className="mc-chip pixel-corners-sm border-2 border-black px-2 py-1 inline-flex items-center gap-1.5 font-mc-header text-accent shrink-0 ml-auto">
        {Math.round(player.score).toLocaleString()}
        <span className="font-mc-sub text-[8px] text-foreground/40 tracking-wider uppercase">
          Pwr
        </span>
      </span>

      <div className="hidden md:flex items-center gap-3 shrink-0 font-mc-body text-xs text-foreground/70">
        <span className="inline-flex items-center gap-1 text-accent">
          <Swords size={12} />
          {player.pvpKills}
        </span>
        <span
          className="inline-flex items-center gap-1"
          style={{ color: "var(--mc-danger)" }}
        >
          <Skull size={12} />
          {player.pvpDeaths}
        </span>
        <span className="hidden lg:inline-flex items-center gap-1">
          KD {kd}
        </span>
        <span
          className="hidden lg:inline-flex items-center gap-1"
          style={{ color: "var(--mc-success)" }}
        >
          <PawPrint size={12} />
          {player.mobKills}
        </span>
        <span
          className="hidden xl:inline-flex items-center gap-1"
          style={{ color: "var(--mc-legendary)" }}
        >
          <Activity size={12} />
          {Math.round(player.activityIndex * 100)}%
        </span>
        <span className="hidden xl:inline-flex items-center gap-1">
          <Clock size={12} />
          {Math.round(player.playtimeHours)}h
        </span>
      </div>
    </motion.div>
  );
}

export function PlayerPowerBoard({
  players,
  generatedAt,
}: {
  players: PlayerPower[];
  generatedAt: number | null;
}) {
  const [query, setQuery] = useState("");

  const ranked: RankedPlayer[] = useMemo(
    () =>
      [...players]
        .sort((a, b) => b.score - a.score)
        .map((player, i) => ({ ...player, rank: i + 1 })),
    [players],
  );

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const visible = searching
    ? ranked.filter((p) => p.name.toLowerCase().includes(q))
    : ranked;

  const podium = !searching ? ranked.slice(0, 3) : [];
  const rest = !searching ? ranked.slice(3) : visible;

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
        <h2 className="font-mc-header text-xl sm:text-2xl text-foreground mc-text-shadow leading-relaxed">
          Survivor Power
        </h2>
        <div className="mc-input pixel-corners-sm flex items-center gap-2 px-3 py-2 w-full sm:w-56">
          <Search size={14} className="text-foreground/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full bg-transparent outline-none font-mc-body text-sm text-foreground placeholder:text-neutral-600"
          />
        </div>
      </div>

      {players.length === 0 ? (
        <p className="font-mc-body text-sm text-foreground/50">
          Power data is unavailable right now.
        </p>
      ) : visible.length === 0 ? (
        <p className="font-mc-body text-sm text-foreground/50">
          No survivors match your search.
        </p>
      ) : (
        <>
          {podium.length > 0 && (
            <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 mb-6">
              {PODIUM_ORDER.map((idx) => {
                const player = podium[idx];
                if (!player) return null;
                return (
                  <div
                    key={player.uuid}
                    className={
                      player.rank === 1 ? "order-first md:order-none" : ""
                    }
                  >
                    <PlayerCard player={player} />
                  </div>
                );
              })}
            </div>
          )}

          {rest.length > 0 && (
            <div className="mc-scroll flex flex-col gap-1.5 max-h-[560px] overflow-y-auto pr-1">
              {rest.map((player, i) => (
                <PlayerRow key={player.uuid} player={player} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {generatedAt && (
        <p className="font-mc-body text-[10px] text-foreground/40 text-center mt-6">
          Snapshot generated {new Date(generatedAt).toLocaleString()}
        </p>
      )}
    </>
  );
}
