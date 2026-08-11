"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, PartyPopper } from "lucide-react";

interface PurchaseSuccessModalProps {
  purchase?: string;
}

export function PurchaseSuccessModal({ purchase }: PurchaseSuccessModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(purchase === "success");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate the webhook synchronization process
    const timeouts = [
      setTimeout(() => setStep(1), 1500), // DB Sync complete
      setTimeout(() => setStep(2), 3000), // Discord Role complete
      setTimeout(() => setStep(3), 4500), // Minecraft Rank complete
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove the ?purchase=success query param so refreshing doesn't show it again
    router.replace("/store");
  };

  const tasks = [
    { label: "Syncing Supabase Data", stepComplete: 1 },
    { label: "Assigning Discord Role", stepComplete: 2 },
    { label: "Applying Minecraft Rank", stepComplete: 3 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md pointer-events-auto overflow-hidden mc-panel-raised pixel-corners relative"
            >
              {/* Enchanting-table style header rule */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[color:var(--mc-success)]/0 via-[color:var(--mc-success)] to-[color:var(--mc-success)]/0" />

              <div className="p-8">
                <div className="flex flex-col items-center mb-8 text-center">
                  <div className="w-14 h-14 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center mb-5">
                    <PartyPopper className="w-7 h-7 text-[color:var(--mc-success)]" />
                  </div>
                  <h2 className="font-mc-header text-base text-white mb-3 mc-text-shadow leading-relaxed">
                    Purchase Successful
                  </h2>
                  <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed">
                    Thank you for your support! We are applying your rewards in
                    the background.
                  </p>
                </div>

                {/* Sync checklist — reads as a progressing advancement list */}
                <div className="space-y-2 mb-8">
                  {tasks.map((task, index) => {
                    const isComplete = step >= task.stepComplete;
                    const isActive = step === index;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 border-2 border-black pixel-corners-sm pixel-slot transition-colors duration-500 ${
                          isComplete
                            ? "bg-neutral-900 text-[color:var(--mc-success)]"
                            : isActive
                              ? "bg-neutral-900/60 text-neutral-200"
                              : "bg-black/40 text-neutral-500"
                        }`}
                      >
                        <div className="shrink-0">
                          {isComplete ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <CheckCircle2 className="w-4 h-4 text-[color:var(--mc-success)]" />
                            </motion.div>
                          ) : isActive ? (
                            <Loader2 className="w-4 h-4 text-[color:var(--mc-success)] animate-spin" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-neutral-700" />
                          )}
                        </div>
                        <span className="font-mc-body text-[11px]">
                          {task.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={handleClose}
                  disabled={step < 3}
                  className={`mc-btn pixel-corners w-full py-3 px-4 flex items-center justify-center font-mc-sub text-xs uppercase tracking-widest ${
                    step >= 3 ? "mc-btn-accent" : "text-neutral-500"
                  }`}
                >
                  {step >= 3 ? "Return to Store" : "Syncing..."}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
