"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { EnrolledPlayer } from "@/lib/players";
import { AccountPillShell } from "./AccountPillShell";

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

const TIER_PILL_CLASS: Record<EnrolledPlayer["tier"], string> = {
  member: "text-foreground/70",
  survivor: "text-[color:var(--mc-common)]",
  supporter: "text-[color:var(--mc-rare)]",
  sponsor: "text-[color:var(--mc-danger)]",
};

export function ProfileBanner({ profile }: { profile: EnrolledPlayer }) {
  const router = useRouter();
  const badge = TIER_BADGE[profile.tier];

  const handleLogout = async () => {
    await getSupabaseBrowser().auth.signOut();
    router.refresh();
  };

  return (
    <AccountPillShell>
      <div className="inline-flex items-center gap-3 px-3 py-2 mc-panel-raised pixel-corners pixel-slot font-mc-body text-xs">
        <Link
          href="/user"
          title="View your RIFTSCAPE ID"
          className="flex items-center gap-2 group"
        >
          <Image
            src={`https://mc-heads.net/avatar/${encodeURIComponent(profile.mc_user)}/24`}
            alt={profile.mc_user}
            width={24}
            height={24}
            className="w-5 h-5 shrink-0 pixelated"
          />
          <span className="text-foreground/80 group-hover:text-accent transition-colors mc-text-shadow">
            {profile.mc_user}
          </span>
        </Link>
        <span
          className={`flex items-center gap-1 font-mc-sub text-[9px] uppercase tracking-wider ${TIER_PILL_CLASS[profile.tier]}`}
        >
          {badge && (
            <Image
              src={badge}
              alt={TIER_LABEL[profile.tier]}
              width={32}
              height={32}
              className="w-3.5 h-3.5 pixelated"
            />
          )}
          {TIER_LABEL[profile.tier]}
        </span>
        <span className="flex items-center gap-1 text-[color:#f1432e]/80">
          <Image
            src="/img/hardcore-64x64.png"
            alt="Life"
            width={64}
            height={64}
            className="w-4 h-4 pixelated"
          />
          {profile.life_number}
        </span>
        <motion.button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="text-foreground/30 hover:text-foreground/70 transition-colors pl-1"
        >
          <LogOut size={13} strokeWidth={2} />
        </motion.button>
      </div>
    </AccountPillShell>
  );
}
