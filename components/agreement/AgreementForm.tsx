"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, CheckCircle2 } from "lucide-react";

type CheckKey = "age18" | "rules" | "terms";

const CHECKS: { key: CheckKey; label: string }[] = [
  { key: "age18", label: "I am 18 years of age or older." },
  { key: "rules", label: "I have read and agree to the server rules." },
  { key: "terms", label: "I accept the Privacy Policy and Terms of Service." },
];

export function AgreementForm({ mcUsername }: { mcUsername: string }) {
  const [checked, setChecked] = useState<Record<CheckKey, boolean>>({
    age18: false,
    rules: false,
    terms: false,
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const allChecked = CHECKS.every((c) => checked[c.key]);

  async function handleSubmit() {
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checked),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Could not reach the server. Try again.");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12"
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center"
            style={{ color: "var(--mc-success)" }}
          >
            <CheckCircle2 size={30} />
          </motion.div>
          <h2 className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed">
            Whitelisted
          </h2>
          <p className="font-mc-body text-foreground/60 leading-relaxed text-sm">
            <span className="text-accent font-mc-sub">{mcUsername}</span>
            &nbsp;has been added to the server whitelist.
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-lg mx-auto mc-panel pixel-corners border-2 border-black px-6 py-10"
        >
          <div className="space-y-4 mb-8">
            {CHECKS.map((c, i) => (
              <motion.button
                key={c.key}
                type="button"
                role="checkbox"
                aria-checked={checked[c.key]}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + i * 0.08,
                  ease: "easeOut",
                }}
                onClick={() =>
                  setChecked((prev) => ({ ...prev, [c.key]: !prev[c.key] }))
                }
                className="w-full flex items-start gap-4 text-left"
              >
                <span
                  className={`shrink-0 w-6 h-6 mt-0.5 pixel-corners-sm border-2 border-black flex items-center justify-center ${
                    checked[c.key]
                      ? "bg-accent text-black"
                      : "bg-black/70 pixel-slot"
                  }`}
                >
                  <AnimatePresence>
                    {checked[c.key] && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="flex items-center justify-center"
                      >
                        <Check size={14} strokeWidth={3} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span className="font-mc-body text-sm text-foreground/80 leading-relaxed">
                  {c.label}
                </span>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="font-mc-body text-xs mb-4 leading-relaxed"
                style={{ color: "var(--mc-danger)" }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            disabled={!allChecked || status === "submitting"}
            onClick={handleSubmit}
            className="mc-btn mc-btn-accent pixel-corners w-full px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
          >
            {status === "submitting"
              ? "Submitting..."
              : "Accept & Whitelist Me"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
