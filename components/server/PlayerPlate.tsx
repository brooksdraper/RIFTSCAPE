"use client";

import { useState } from "react";
import Image from "next/image";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { signInWithDiscord } from "@/lib/auth/sign-in";
import type { EnrolledPlayer } from "@/lib/players";
import type { Viewer } from "@/lib/auth/profile";

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
    <div className="pixel-slot pixel-corners border-2 border-black bg-black/60 p-5 flex flex-col">
      <span className="font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
        {label}
      </span>
      {children}
    </div>
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

/** Signed in with Discord, but never enrolled — nothing to show but the fix. */
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
            Signed in, but not enrolled in the run — no life has been issued to
            you yet.
          </div>
        </div>
      </div>
    </Frame>
  );
}

function SignedOutPlate() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSignIn = async () => {
    setStatus("loading");
    const { error } = await signInWithDiscord("/server");
    if (error) setStatus("error");
  };

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
            Sign in to see your tier and remaining lives.
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={status === "loading"}
        className="mc-btn pixel-corners mt-5 w-full px-4 py-3.5 font-mc-sub text-[11px] text-accent uppercase tracking-widest inline-flex items-center justify-center gap-2"
      >
        <DiscordIcon className="w-4 h-4 shrink-0" />
        {status === "loading" ? "Connecting..." : "Sign In With Discord"}
      </button>

      {status === "error" && (
        <p className="mt-2.5 font-mc-body text-xs text-[color:var(--mc-danger)]">
          Could not reach Discord. Try again.
        </p>
      )}
    </Frame>
  );
}

export function PlayerPlate({ viewer }: { viewer: Viewer }) {
  if (viewer.profile) return <EnrolledPlate profile={viewer.profile} />;
  if (viewer.discord) return <UnenrolledPlate name={viewer.discord.username} />;
  return <SignedOutPlate />;
}
