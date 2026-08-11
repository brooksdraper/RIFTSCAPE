"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { clearAccountCookie } from "@/lib/account";
import type { EnrolledPlayer } from "@/lib/players";

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

const pillVariants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

export function ProfileBanner({ profile }: { profile: EnrolledPlayer }) {
  const router = useRouter();
  const badge = TIER_BADGE[profile.tier];

  const handleLogout = () => {
    clearAccountCookie();
    router.refresh();
  };

  return (
    <motion.div
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="sticky top-0 z-50 flex justify-start p-3"
    >
      <div className="inline-flex items-center gap-3 px-3 py-2 mc-panel-raised pixel-corners pixel-slot font-mc-body text-xs">
        <Link
          href="/user"
          title="View your RIFTSCAPE ID"
          className="flex items-center gap-2 group"
        >
          <Image
            src={`https://mc-heads.net/avatar/${encodeURIComponent(profile.minecraft_username)}/24`}
            alt={profile.minecraft_username}
            width={24}
            height={24}
            className="w-5 h-5 shrink-0 pixelated"
          />
          <span className="text-foreground/80 group-hover:text-accent transition-colors mc-text-shadow">
            {profile.minecraft_username}
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
    </motion.div>
  );
}
