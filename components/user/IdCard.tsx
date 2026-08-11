"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { EnrolledPlayer } from "@/lib/players";
import {
  formatIdSerial,
  formatIssueDate,
  machineReadableZone,
  registryNumber,
} from "@/lib/riftscape-id";
import { SecuritySeal } from "./SecuritySeal";
import { Barcode } from "./Barcode";

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

const TIER_CLASS: Record<EnrolledPlayer["tier"], string> = {
  member: "bg-foreground/10 text-foreground/70 border-foreground/20",
  survivor: "bg-neutral-400/15 text-neutral-300 border-neutral-400/40",
  supporter: "bg-yellow-400/15 text-yellow-400 border-yellow-400/40",
  sponsor: "bg-red-500/15 text-red-400 border-red-400/40",
};

/** Small labelled data cell, laid out like a real ID field. */
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
      <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-accent/60 mb-0.5">
        {label}
      </div>
      <div className="font-mono text-xs sm:text-sm text-foreground/90 truncate">
        {children}
      </div>
    </div>
  );
}

export function IdCard({ profile }: { profile: EnrolledPlayer }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Pointer-driven tilt + sheen. Values are 0..1 across the card surface.
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const springConfig = { stiffness: 180, damping: 20, mass: 0.6 };
  const rotateX = useSpring(
    useTransform(pointerY, [0, 1], [7, -7]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(pointerX, [0, 1], [-9, 9]),
    springConfig,
  );

  const sheenX = useTransform(pointerX, [0, 1], ["0%", "100%"]);
  const sheenY = useTransform(pointerY, [0, 1], ["0%", "100%"]);
  const sheen = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(234,179,8,0.22), rgba(34,211,238,0.10) 35%, transparent 65%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    pointerX.set((e.clientX - rect.left) / rect.width);
    pointerY.set((e.clientY - rect.top) / rect.height);
  };

  const resetPointer = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  const [mrzLine1, mrzLine2] = machineReadableZone(
    profile.id,
    profile.minecraft_username,
    profile.tier,
    profile.life_number,
  );
  const tierBadge = TIER_BADGE[profile.tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{ perspective: 1400 }}
      className="w-full max-w-3xl mx-auto"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden border border-accent/30 bg-neutral-950/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        {/* Guilloche security tint */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #EAB308 0 1px, transparent 1px 7px), repeating-linear-gradient(-45deg, #EAB308 0 1px, transparent 1px 7px)",
          }}
        />
        {/* Holographic sheen following the pointer */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ background: sheen }}
        />

        {/* ── Top band ─────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between gap-3 px-5 sm:px-7 py-3 border-b border-accent/25 bg-gradient-to-r from-accent/15 via-accent/5 to-transparent">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-1.5 h-7 bg-accent shrink-0" />
            <div className="min-w-0">
              <div className="font-black uppercase tracking-tight text-base sm:text-xl leading-none text-white">
                RIFTSCAPE
              </div>
              <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-accent/70 mt-1 truncate">
                Player Identification
              </div>
            </div>
          </div>

          <div className="font-mono text-[9px] sm:text-[10px] text-right leading-tight text-foreground/50 shrink-0">
            <div className="text-accent/80">{registryNumber(profile.id)}</div>
            <div className="tracking-[0.15em] uppercase">
              Issued {formatIssueDate(profile.created_at)}
            </div>
          </div>
        </div>

        {/* ── Card body ────────────────────────────────────────── */}
        <div className="relative px-5 sm:px-7 py-5 sm:py-6 flex gap-4 sm:gap-7">
          {/* Photo */}
          <div className="shrink-0">
            <div className="relative p-1.5 border border-accent/40 bg-black/50">
              <Image
                src={`https://mc-heads.net/avatar/${encodeURIComponent(
                  profile.minecraft_username,
                )}/256`}
                alt={`${profile.minecraft_username}'s Minecraft skin`}
                width={256}
                height={256}
                className="w-20 h-20 sm:w-28 sm:h-28 [image-rendering:pixelated]"
              />
              {/* Corner registration marks */}
              <span className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-accent" />
              <span className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-accent" />
              <span className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-accent" />
              <span className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-accent" />
            </div>
            <div className="mt-1.5 font-mono text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-foreground/35 text-center">
              Specimen
            </div>
          </div>

          {/* Data fields */}
          <div className="flex-1 min-w-0 flex flex-col gap-3 sm:gap-3.5">
            <Field label="Minecraft Name">
              <span className="text-sm sm:text-lg font-bold text-white tracking-wide">
                {profile.minecraft_username}
              </span>
            </Field>

            <Field label="Discord Handle">
              {profile.discord_username || "—"}
            </Field>

            <Field label="Registry ID">
              <span className="text-accent/90 tracking-wider text-[11px] sm:text-sm">
                {formatIdSerial(profile.id)}
              </span>
            </Field>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-0.5">
              <div>
                <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-accent/60 mb-1">
                  Class
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 border font-mono text-[10px] sm:text-xs uppercase tracking-wider ${
                    TIER_CLASS[profile.tier]
                  }`}
                >
                  {tierBadge && (
                    <Image
                      src={tierBadge}
                      alt=""
                      aria-hidden
                      width={32}
                      height={32}
                      className="w-3 h-3"
                    />
                  )}
                  {TIER_LABEL[profile.tier]}
                </span>
              </div>

              <Field label="Life">
                <span className="inline-flex items-center gap-1.5 text-[color:#f1432e]">
                  <Image
                    src="/img/hardcore-64x64.png"
                    alt=""
                    aria-hidden
                    width={64}
                    height={64}
                    className="w-3.5 h-3.5"
                  />
                  {String(profile.life_number).padStart(2, "0")} / 03
                </span>
              </Field>

              <Field label="Season">BETA.1</Field>
            </div>
          </div>

          {/* Security seal */}
          <SecuritySeal className="hidden md:block w-28 h-28 shrink-0 self-center" />
        </div>

        {/* Seal for narrow screens, tucked beside the barcode */}
        <div className="relative flex items-end gap-4 px-5 sm:px-7 pb-4 border-t border-foreground/10 pt-4">
          <Barcode
            id={profile.id}
            className="flex-1 min-w-0 text-foreground/85"
          />
          <SecuritySeal className="md:hidden w-16 h-16 shrink-0" />
        </div>

        {/* ── Machine-readable zone ────────────────────────────── */}
        <div className="relative bg-black/60 border-t border-accent/20 px-5 sm:px-7 py-2.5 overflow-hidden">
          <pre className="font-mono text-[8px] sm:text-[11px] leading-relaxed text-foreground/55 whitespace-pre overflow-x-auto">
            {mrzLine1}
            {"\n"}
            {mrzLine2}
          </pre>
        </div>

        {/* Microtext footer */}
        <div
          aria-hidden
          className="relative bg-accent/10 border-t border-accent/20 px-5 sm:px-7 py-1 font-mono text-[6px] sm:text-[7px] tracking-[0.25em] uppercase text-accent/50 whitespace-nowrap overflow-hidden"
        >
          {"Property of The RIFTSCAPE Network · Void if detached · One life issued per player · ".repeat(
            4,
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
