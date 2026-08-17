"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { EnrolledPlayer } from "@/lib/players";
import {
  formatIdSerial,
  formatIssueDate,
  machineReadableZone,
  registryNumber,
} from "@/lib/players/riftscape-id";
import { Barcode } from "./Barcode";
import { SecuritySeal } from "./SecuritySeal";

const TIER_LABEL: Record<EnrolledPlayer["tier"], string> = {
  member: "Member",
  survivor: "Survivor",
  supporter: "Supporter",
  sponsor: "Sponsor",
};

const TIER_BADGE: Record<EnrolledPlayer["tier"], string | null> = {
  member: null,
  survivor: null,
  supporter: "/img/supporter_tag.png",
  sponsor: "/img/sponsor_tag.png",
};

/** Mirrors the wiki/store rarity ramp: tier name color + muted card border. */
const TIER_STYLE: Record<
  EnrolledPlayer["tier"],
  { text: string; border: string }
> = {
  member: { text: "var(--mc-common)", border: "#3f3f3f" },
  survivor: { text: "var(--mc-info)", border: "#2a6a6a" },
  supporter: { text: "var(--mc-rare)", border: "#8a8a2a" },
  sponsor: { text: "var(--mc-danger)", border: "#8a2a2a" },
};

/** Small labelled data cell, laid out like an inventory tooltip field. */
function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/60 mb-1">
        {label}
      </div>
      <div className="font-mc-body text-sm text-foreground/90 truncate">
        {children}
      </div>
    </div>
  );
}

/**
 * Authored at a fixed pixel size matching real ID-1 card proportions
 * (85.6 × 53.98mm ≈ 1.586:1) and scaled as a single rigid unit via container
 * query units, the way a photo of a physical card would shrink. Letting the
 * layout reflow at narrow widths instead (the old approach) is what made it
 * read as a tall, squarish stack rather than a wide ID card.
 */
const CARD_WIDTH = 640;
const CARD_HEIGHT = 403;

export function IdCard({ profile }: { profile: EnrolledPlayer }) {
  const tier = TIER_STYLE[profile.tier];
  const tierBadge = TIER_BADGE[profile.tier];
  const [mrzLine1, mrzLine2] = machineReadableZone(
    profile.id,
    profile.mc_user,
    profile.tier,
    profile.life_number,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.1, ease: "easeOut" } }}
      className="w-full mx-auto"
      style={{ maxWidth: CARD_WIDTH, containerType: "inline-size" }}
    >
      <div
        className="relative w-full"
        style={{ aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}` }}
      >
        <div
          style={{
            borderColor: tier.border,
            width: CARD_WIDTH,
            transform: `scale(calc(100cqw / ${CARD_WIDTH}px))`,
            transformOrigin: "top left",
          }}
          className="absolute top-0 left-0 mc-panel-raised pixel-corners border-2 overflow-hidden"
        >
          {/* ── Top band ─────────────────────────────────────────── */}
          <div className="mc-chip pixel-slot flex items-center justify-between gap-3 px-7 py-2.5 border-b-2 border-black">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2 h-7 bg-accent shrink-0" />
              <div className="min-w-0">
                <div className="font-mc-header text-base leading-tight text-foreground mc-text-shadow">
                  RIFTSCAPE
                </div>
                <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/70 mt-1 whitespace-nowrap">
                  Player Identification
                </div>
              </div>
            </div>

            <div className="font-mc-body text-[10px] text-right leading-relaxed text-foreground/50 shrink-0">
              <div className="text-accent/80">{registryNumber(profile.id)}</div>
              <div className="tracking-widest uppercase">
                Issued {formatIssueDate(profile.created_at)}
              </div>
            </div>
          </div>

          {/* ── Card body ────────────────────────────────────────── */}
          <div className="px-7 py-4 flex gap-7">
            {/* Player head */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <div className="w-24 h-24 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
                <Image
                  src={`https://mc-heads.net/avatar/${encodeURIComponent(
                    profile.mc_user,
                  )}/256`}
                  alt={`${profile.mc_user}'s Minecraft skin`}
                  width={256}
                  height={256}
                  className="w-full h-full object-contain pixelated"
                />
              </div>
              <div className="font-mc-sub text-[9px] tracking-widest uppercase text-foreground/35">
                Specimen
              </div>
            </div>

            {/* Data fields */}
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5">
              <Field label="Minecraft Name">
                <span className="font-mc-header text-base text-foreground mc-text-shadow leading-tight">
                  {profile.mc_user}
                </span>
              </Field>

              <div className="flex gap-6">
                <Field label="Discord Handle" className="flex-1 min-w-0">
                  {profile.dc_user || "—"}
                </Field>

                <Field label="Registry ID" className="shrink-0">
                  <span className="text-accent/90 tracking-wider">
                    {formatIdSerial(profile.id)}
                  </span>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-0.5">
                <div>
                  <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/60 mb-1">
                    Class
                  </div>
                  <span
                    style={{ color: tier.text }}
                    className="inline-flex items-center gap-1 mc-chip pixel-corners-sm pixel-slot px-2 py-1 font-mc-sub text-[11px] uppercase tracking-wider"
                  >
                    {tierBadge && (
                      <Image
                        src={tierBadge}
                        alt=""
                        aria-hidden
                        width={32}
                        height={32}
                        className="w-3 h-3 pixelated"
                      />
                    )}
                    {TIER_LABEL[profile.tier]}
                  </span>
                </div>

                <div>
                  <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/60 mb-1">
                    Life
                  </div>
                  <span className="inline-flex items-center gap-1 mc-chip pixel-corners-sm pixel-slot px-2 py-1 font-mc-sub text-[11px] uppercase tracking-wider text-[color:var(--mc-danger)] whitespace-nowrap">
                    <Image
                      src="/img/hardcore-64x64.png"
                      alt=""
                      aria-hidden
                      width={64}
                      height={64}
                      className="w-3 h-3 pixelated"
                    />
                    {String(profile.life_number).padStart(2, "0")} / 03
                  </span>
                </div>

                <div>
                  <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/60 mb-1">
                    Season
                  </div>
                  <span className="inline-flex items-center mc-chip pixel-corners-sm pixel-slot px-2 py-1 font-mc-sub text-[11px] uppercase tracking-wider text-foreground/80">
                    BETA.1
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Security strip: barcode + verified seal ─────────── */}
          <div className="flex items-center gap-4 px-7 py-2.5 border-t-2 border-black">
            <div className="mc-chip pixel-slot flex-1 min-w-0 px-3 py-2">
              <Barcode id={profile.id} className="text-accent" />
            </div>
            <SecuritySeal
              verified={Boolean(profile.mc_verified_at)}
              className="shrink-0 w-14 h-14"
            />
          </div>

          {/* ── Machine-readable zone ────────────────────────────── */}
          <div className="mc-chip pixel-slot px-7 py-1.5 border-t-2 border-black overflow-hidden">
            <pre className="font-mc-body text-[10px] leading-relaxed tracking-widest text-foreground/50 whitespace-pre">
              {mrzLine1}
              {"\n"}
              {mrzLine2}
            </pre>
          </div>

          {/* Footer */}
          <div className="mc-chip pixel-slot px-7 py-1 border-t-2 border-black font-mc-sub text-[9px] tracking-widest uppercase text-foreground/35 text-center whitespace-nowrap">
            Property of The RIFTSCAPE Network · One life issued per player
          </div>
        </div>
      </div>
    </motion.div>
  );
}
