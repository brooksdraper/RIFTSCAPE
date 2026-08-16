"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";

export type McVerifyResult = "success" | "invalid" | "mismatch" | "no-profile";

const COPY: Record<
  McVerifyResult,
  { heading: string; body: string; ok: boolean }
> = {
  success: {
    heading: "Minecraft Account Verified",
    body: "This ID's Minecraft identity has been confirmed against your in-game session.",
    ok: true,
  },
  invalid: {
    heading: "Verification Link Expired",
    body: "That link is invalid or has expired. Run the verification command in-game again for a fresh one.",
    ok: false,
  },
  mismatch: {
    heading: "Account Mismatch",
    body: "The Minecraft account you're logged into in-game doesn't match the one on this ID.",
    ok: false,
  },
  "no-profile": {
    heading: "No ID on Record",
    body: "Sign in with the account that enrolled before verifying its Minecraft identity.",
    ok: false,
  },
};

export function McVerifyBanner({ result }: { result: string }) {
  const copy = COPY[result as McVerifyResult];
  if (!copy) return null;

  const color = copy.ok ? "var(--mc-success)" : "var(--mc-danger)";
  const Icon = copy.ok ? CheckCircle2 : XCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto mb-8 mc-panel pixel-corners border-2 border-black px-5 py-4 flex items-start gap-3"
    >
      <div className="shrink-0 w-9 h-9 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0 flex-1">
        <div
          style={{ color }}
          className="font-mc-sub text-[11px] uppercase tracking-widest mb-1"
        >
          {copy.heading}
        </div>
        <p className="font-mc-body text-xs text-foreground/70 leading-relaxed">
          {copy.body}
        </p>
      </div>
      <Link
        href="/user"
        className="shrink-0 font-mc-sub text-[10px] uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors"
      >
        Dismiss
      </Link>
    </motion.div>
  );
}
