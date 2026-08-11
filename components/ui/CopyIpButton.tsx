"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";

interface CopyIpButtonProps {
  ip?: string;
  className?: string;
}

export function CopyIpButton({
  ip = "play.RIFTSCAPE.net",
  className = "",
}: CopyIpButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <motion.button
      layout
      onClick={handleCopyIp}
      type="button"
      aria-label="Copy server IP address"
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      className={`mc-btn mc-btn-accent pixel-corners px-8 py-4 font-mc-sub text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer overflow-hidden ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Copy className="w-4 h-4 stroke-[2.5]" />
            {ip}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
