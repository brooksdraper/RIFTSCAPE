"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { AccountPillShell } from "./AccountPillShell";
import { signInWithDiscord } from "@/lib/auth/sign-in";

export function AccountLoginPill() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSignIn = async () => {
    setStatus("loading");

    const { error } = await signInWithDiscord();

    // On success the browser is already navigating to Discord, so the loading
    // label just stays up until the page unloads.
    if (error) setStatus("error");
  };

  return (
    <AccountPillShell>
      <div className="flex flex-col items-start gap-2">
        <button
          type="button"
          onClick={handleSignIn}
          disabled={status === "loading"}
          className="mc-btn pixel-corners inline-flex items-center gap-2 px-4 py-2 font-mc-sub text-[10px] text-accent uppercase tracking-widest"
        >
          <DiscordIcon className="w-3.5 h-3.5 shrink-0" />
          {status === "loading" ? "Connecting..." : "Sign In With Discord"}
        </button>

        <AnimatePresence>
          {status === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="mc-panel-raised pixel-corners-sm px-3 py-2 font-mc-body text-[11px] text-[color:var(--mc-danger)]"
            >
              Could not reach Discord. Try again.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </AccountPillShell>
  );
}
