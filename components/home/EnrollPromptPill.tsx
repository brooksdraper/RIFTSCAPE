"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { LogOut } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { DiscordIdentity } from "@/lib/auth/discord";
import { AccountPillShell } from "./AccountPillShell";

/**
 * Signed in with Discord, but no survivor enrolled yet — the state that only
 * exists now that identity and enrollment are separate steps.
 */
export function EnrollPromptPill({ discord }: { discord: DiscordIdentity }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await getSupabaseBrowser().auth.signOut();
    router.refresh();
  };

  return (
    <AccountPillShell>
      <div className="inline-flex items-center gap-3 px-3 py-2 mc-panel-raised pixel-corners pixel-slot font-mc-body text-xs">
        <span className="flex items-center gap-2">
          {discord.avatarUrl ? (
            <Image
              src={discord.avatarUrl}
              alt={discord.username}
              width={24}
              height={24}
              className="w-5 h-5 shrink-0 border-2 border-black"
            />
          ) : (
            <DiscordIcon className="w-4 h-4 shrink-0 text-foreground/60" />
          )}
          <span className="text-foreground/80 mc-text-shadow">
            {discord.username}
          </span>
        </span>

        <Link
          href="/#enroll"
          className="mc-btn pixel-corners-sm px-3 py-1.5 font-mc-sub text-[9px] text-accent uppercase tracking-wider"
        >
          Finish Enrolling
        </Link>

        <motion.button
          type="button"
          onClick={handleSignOut}
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
