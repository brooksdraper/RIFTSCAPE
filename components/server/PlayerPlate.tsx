"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { EnrolledPlayer } from "@/lib/players";

/**
 * The field terminal identifies its viewer through the in-game token, not a
 * Supabase session — there is no browser to sign in from inside the
 * Minecraft client. `invalid` covers a missing, expired, or forged token;
 * `unenrolled` is a verified Minecraft account with no RIFTSCAPE profile yet.
 */
export type FieldTerminalPlayer =
  | { status: "enrolled"; profile: EnrolledPlayer }
  | { status: "unenrolled"; mcUser: string }
  | { status: "invalid" };

const LIVES_TOTAL = 3;

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

/** Same ramp the ID card and store use — the tier reads as one color everywhere. */
const TIER_COLOR: Record<EnrolledPlayer["tier"], string> = {
  member: "var(--mc-common)",
  survivor: "var(--mc-info)",
  supporter: "var(--mc-rare)",
  sponsor: "var(--mc-danger)",
};

function Frame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="pixel-slot pixel-corners border-2 border-black bg-black/60 p-5 flex flex-col"
    >
      <span className="font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
        {label}
      </span>
      {children}
    </motion.div>
  );
}

/**
 * The vanilla hardcore heart row: one slot per life, spent lives drained
 * rather than removed so the total stays readable at a glance.
 */
function LifeHearts({ lifeNumber }: { lifeNumber: number }) {
  const remaining = Math.max(0, LIVES_TOTAL - lifeNumber + 1);

  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: LIVES_TOTAL }, (_, i) => (
        <Image
          key={i}
          src="/img/hardcore-64x64.png"
          alt=""
          aria-hidden
          width={64}
          height={64}
          className={`w-6 h-6 pixelated ${
            i < remaining ? "" : "grayscale opacity-20"
          }`}
        />
      ))}
      <span className="font-mc-body text-xs text-neutral-400 ml-2">
        {remaining} of {LIVES_TOTAL}
      </span>
    </div>
  );
}

function EnrolledPlate({ profile }: { profile: EnrolledPlayer }) {
  const badge = TIER_BADGE[profile.tier];

  return (
    <Frame label="Survivor">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-2">
          <Image
            src={`https://mc-heads.net/avatar/${encodeURIComponent(profile.mc_user)}/160`}
            alt={profile.mc_user}
            width={160}
            height={160}
            className="w-full h-full object-contain pixelated"
          />
        </div>

        <div className="min-w-0">
          <div className="font-mc-header text-base leading-relaxed mc-text-shadow truncate">
            {profile.mc_user}
          </div>
          <span
            className="mt-2 inline-flex items-center gap-1.5 mc-chip pixel-corners-sm pixel-slot px-2.5 py-1.5 font-mc-sub text-[10px] uppercase tracking-wider"
            style={{ color: TIER_COLOR[profile.tier] }}
          >
            {badge && (
              <Image
                src={badge}
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="w-3.5 h-3.5 pixelated"
              />
            )}
            {TIER_LABEL[profile.tier]}
          </span>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t-2 border-black">
        <span className="block font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest mb-2.5">
          Lives Remaining
        </span>
        <LifeHearts lifeNumber={profile.life_number} />
      </div>
    </Frame>
  );
}

/** A verified Minecraft account with no RIFTSCAPE profile — nothing to show but the fix. */
function UnenrolledPlate({ name }: { name: string }) {
  return (
    <Frame label="Survivor">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
          <span className="font-mc-header text-xl text-neutral-600">?</span>
        </div>
        <div className="min-w-0">
          <div className="font-mc-header text-base leading-relaxed mc-text-shadow truncate">
            {name}
          </div>
          <div className="font-mc-body text-xs text-neutral-400 mt-2 leading-relaxed">
            Not enrolled in the run yet — no life has been issued to you.
          </div>
        </div>
      </div>
    </Frame>
  );
}

/** Missing, expired, or forged token — the terminal can't tell who's asking. */
function InvalidTokenPlate() {
  return (
    <Frame label="Survivor">
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
          <span className="font-mc-header text-xl text-neutral-600">?</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-mc-header text-base leading-relaxed mc-text-shadow text-neutral-500">
            Unidentified
          </div>
          <div className="font-mc-body text-xs text-neutral-400 mt-1.5 leading-relaxed">
            Could not verify your session. Close and reopen the field terminal
            in-game to reconnect.
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function PlayerPlate({ player }: { player: FieldTerminalPlayer }) {
  if (player.status === "enrolled") return <EnrolledPlate profile={player.profile} />;
  if (player.status === "unenrolled") return <UnenrolledPlate name={player.mcUser} />;
  return <InvalidTokenPlate />;
}
