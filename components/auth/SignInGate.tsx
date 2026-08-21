"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { signInWithDiscord } from "@/lib/auth/sign-in";

interface SignInGateProps {
  title?: string;
  description?: string;
}

export function SignInGate({
  title = "Sign In Required",
  description = "Sign in with Discord to continue.",
}: SignInGateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-foreground/30"
      >
        <Lock size={26} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
        className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32, ease: "easeOut" }}
        className="font-mc-body text-foreground/60 mb-8 leading-relaxed text-sm"
      >
        {description}
      </motion.p>

      <motion.button
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
        onClick={() => signInWithDiscord()}
        className="mc-btn mc-btn-accent pixel-corners inline-block px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
      >
        Sign In With Discord
      </motion.button>
    </motion.div>
  );
}
