"use client";

import { motion } from "motion/react";

/**
 * The sticky top-left plate every account pill sits on. Shared so the signed
 * out, enrolled, and half-enrolled pills swap in place instead of jumping.
 */
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

export function AccountPillShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="sticky top-0 z-50 flex justify-start p-3"
    >
      {children}
    </motion.div>
  );
}
