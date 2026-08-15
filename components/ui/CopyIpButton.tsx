"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check } from "lucide-react";

interface CopyIpButtonProps {
  ip?: string;
  className?: string;
  variant?: "square" | "inline";
}

export function CopyIpButton({
  ip = "play.riftscape.net",
  className = "",
  variant = "square",
}: CopyIpButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (variant === "inline") {
    // Text sits over an invisible sizer holding the longer of the two
    // strings, so the swap to "Copied!" cross-fades in place instead of
    // resizing the button.
    const sizerText = ip.length >= "Copied!".length ? ip : "Copied!";

    return (
      <button
        onClick={handleCopyIp}
        type="button"
        aria-label="Copy server IP address"
        className={`mc-btn mc-btn-accent pixel-corners px-6 py-4 font-mc-sub uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer ${className}`}
      >
        <span className="w-4 h-4 shrink-0 relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Check className="w-4 h-4 stroke-[3]" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Copy className="w-4 h-4 stroke-[2.5]" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <span className="relative inline-block text-left normal-case tracking-normal text-xs">
          <span className="invisible whitespace-nowrap">{sizerText}</span>
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="copied-label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 whitespace-nowrap"
              >
                Copied!
              </motion.span>
            ) : (
              <motion.span
                key="ip-label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 whitespace-nowrap"
              >
                {ip}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>
    );
  }

  return (
    <motion.button
      layout
      onClick={handleCopyIp}
      type="button"
      aria-label="Copy server IP address"
      transition={{ layout: { duration: 0.4, ease: "easeInOut" } }}
      className={`mc-btn mc-btn-accent pixel-corners px-4 py-4 font-mc-sub uppercase tracking-widest flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden ${className}`}
    >
      {/* Inset item slot — swaps between copy and check glyphs */}
      <span className="w-9 h-9 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-accent overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center justify-center"
            >
              <Copy className="w-4 h-4 stroke-[2.5]" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="text-xs whitespace-nowrap"
          >
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="ip-label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="normal-case tracking-normal text-[10px] leading-tight text-center break-all px-1"
          >
            {ip}
          </motion.span>
        )}
      </AnimatePresence>

      <span className="font-mc-body normal-case text-[9px] tracking-normal text-black/50">
        Tap to copy
      </span>
    </motion.button>
  );
}
