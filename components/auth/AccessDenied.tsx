"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({
  title = "Access Denied",
  description = "This area is restricted to server administrators.",
}: AccessDeniedProps) {
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
        className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-[color:var(--mc-danger)]"
      >
        <ShieldAlert size={26} />
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

      <Link
        href="/"
        className="mc-btn pixel-corners inline-block px-8 py-4 font-mc-sub text-xs uppercase tracking-widest text-accent"
      >
        Back to Base
      </Link>
    </motion.div>
  );
}
