"use client";

import { AnimatePresence, motion } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

interface PurchaseNoticeProps {
  purchase?: string;
}

export function PurchaseNotice({ purchase }: PurchaseNoticeProps) {
  const [visible, setVisible] = useState(purchase === "canceled");

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 350, damping: 18 }}
          className="fixed bottom-6 inset-x-0 z-[60] flex justify-center px-4 pointer-events-none"
        >
          {/* Advancement-toast styling: raised panel, icon in its own slot */}
          <div className="pointer-events-auto flex items-center gap-3 mc-panel-raised pixel-corners pixel-slot px-5 py-4">
            <span className="w-9 h-9 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
              <TriangleAlert className="h-4 w-4 text-[color:var(--mc-legendary)] animate-pulse" />
            </span>
            <p className="font-mc-sub text-[10px] uppercase tracking-widest text-[color:var(--mc-legendary)] mc-text-shadow">
              Checkout Canceled — You Were Not Charged
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
