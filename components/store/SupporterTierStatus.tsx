"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Timer } from "lucide-react";
import {
  SURVIVOR_HOURS_REQUIRED,
  TIER_META,
  countUnlocked,
  meetsSurvivorGate,
  supporterItems,
  type SupporterViewer,
} from "@/lib/supporter-items";

interface SupporterTierStatusProps {
  minecraftUsername: string | null;
  viewer: SupporterViewer;
}

/**
 * The player's standing in the vault: which tag they hold, how far along the
 * Survivor playtime gate they are, how much of the catalog that opens, and the
 * one accent action on the page — the upgrade that unlocks the rest.
 */
export function SupporterTierStatus({
  minecraftUsername,
  viewer,
}: SupporterTierStatusProps) {
  const total = supporterItems.length;
  const unlocked = countUnlocked(viewer);
  const percent = Math.round((unlocked / total) * 100);
  const meta = viewer.tier ? TIER_META[viewer.tier] : null;
  // The Survivor tag itself is the proof; playtime only drives the progress bar.
  const survivorEarned =
    (viewer.tier !== null && viewer.tier !== "member") ||
    meetsSurvivorGate(viewer.playtimeHours);

  const cta = !viewer.tier
    ? { href: "/", label: "Sign In at HQ →" }
    : viewer.tier === "sponsor"
      ? null
      : viewer.tier === "supporter"
        ? { href: "/store", label: "Upgrade to Sponsor →" }
        : { href: "/store", label: "Get a Supporter Tag →" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mc-panel-raised pixel-corners p-6 mb-12 flex flex-col md:flex-row md:items-center gap-6"
    >
      {/* Identity — player head in its own slot, tag beneath the name */}
      <div className="flex items-center gap-4 md:w-64 shrink-0">
        <div className="w-14 h-14 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
          <Image
            src={`https://mc-heads.net/avatar/${encodeURIComponent(
              minecraftUsername || "steve",
            )}/64`}
            alt={minecraftUsername ?? "Steve"}
            width={64}
            height={64}
            className="w-full h-full object-contain pixelated"
          />
        </div>
        <div className="min-w-0">
          <span className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-1">
            Signed In As
          </span>
          <span className="block font-mc-header text-sm truncate mc-text-shadow leading-tight">
            {minecraftUsername ?? "Guest"}
          </span>
          {meta ? (
            <span
              className="inline-block mt-2 font-mc-sub text-[9px] uppercase tracking-wider px-2 py-0.5 border-2 pixel-corners-sm bg-black/60"
              style={{ color: meta.text, borderColor: meta.border }}
            >
              {viewer.tier === "member" ? "No Tag Yet" : `${meta.label} Tag`}
            </span>
          ) : (
            <span className="inline-block mt-2 font-mc-body text-[11px] text-foreground/50">
              Not signed in
            </span>
          )}
        </div>
      </div>

      {/* Unlock progress — recessed track, accent fill */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <span className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase">
            Vault Unlocked
          </span>
          <span className="font-mc-header text-sm text-accent mc-text-shadow">
            {unlocked} / {total}
          </span>
        </div>
        <div className="h-4 bg-black/70 border-2 border-black pixel-corners-sm pixel-slot overflow-hidden">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Survivor gate readout — playtime, not purchase */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-1.5 mc-chip pixel-corners-sm pixel-slot font-mc-sub text-[9px] uppercase tracking-wider px-2 py-1 ${
              survivorEarned
                ? "text-[color:var(--mc-success)]"
                : "text-neutral-400"
            }`}
          >
            <Timer size={11} />
            {viewer.playtimeHours === null
              ? `Survivor Tag — ${SURVIVOR_HOURS_REQUIRED}h Online`
              : `Survivor Tag — ${viewer.playtimeHours}h / ${SURVIVOR_HOURS_REQUIRED}h`}
          </span>
          <span className="font-mc-body text-[11px] text-neutral-400 leading-relaxed">
            {survivorEarned
              ? "Earned — the Survivor set is yours."
              : viewer.playtimeHours === null
                ? "Online time isn't synced to the site yet."
                : "Keep playing to earn the Survivor set."}
          </span>
        </div>
      </div>

      {cta && (
        <Link
          href={cta.href}
          className="mc-btn mc-btn-accent pixel-corners shrink-0 px-6 py-4 font-mc-sub text-xs uppercase tracking-widest text-center"
        >
          {cta.label}
        </Link>
      )}
    </motion.div>
  );
}
