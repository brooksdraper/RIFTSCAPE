"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  hasEnrolledDeviceMarker,
  setAccountCookie,
  setEnrolledDeviceMarker,
} from "@/lib/account";

const HOLD_DURATION = 900;

export function SignUpSection() {
  const router = useRouter();
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [holding, setHolding] = useState(false);
  const [isDeviceEnrolled, setIsDeviceEnrolled] = useState(false);
  const holdingRef = useRef(false);

  useEffect(() => {
    // Reads a client-only cookie; setting state here (not in the initializer)
    // avoids a server/client hydration mismatch.
    if (hasEnrolledDeviceMarker()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDeviceEnrolled(true);
    }
  }, []);

  const submitEnrollment = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftUsername, discordUsername }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        if (res.status === 429) {
          setIsDeviceEnrolled(true);
          setEnrolledDeviceMarker();
        }
        return;
      }

      setStatus("success");
      setMessage("You're enrolled. See you on Sulfuria.");
      setAccountCookie({ minecraftUsername, discordUsername });
      setEnrolledDeviceMarker();
      setIsDeviceEnrolled(true);
      setMinecraftUsername("");
      setDiscordUsername("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  const canHold =
    !isDeviceEnrolled &&
    status !== "loading" &&
    minecraftUsername.trim().length > 0 &&
    discordUsername.trim().length > 0;

  const startHold = () => {
    if (!canHold) return;
    holdingRef.current = true;
    setHolding(true);
  };

  const cancelHold = () => {
    holdingRef.current = false;
    setHolding(false);
  };

  const handleHoldComplete = () => {
    if (holdingRef.current) {
      holdingRef.current = false;
      setHolding(false);
      submitEnrollment();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col"
    >
      <span
        className={`mc-panel-raised pixel-corners pixel-slot font-mc-sub text-[11px] tracking-widest uppercase px-4 py-2 mb-6 self-start mc-text-shadow ${
          isDeviceEnrolled ? "text-[color:var(--mc-legendary)]" : "text-accent"
        }`}
      >
        {isDeviceEnrolled ? "• Device Enrolled" : "• Enrollment Open"}
      </span>
      <h2 className="font-mc-header text-2xl md:text-3xl mb-5 mc-text-shadow leading-relaxed">
        Sign Up
      </h2>
      <p className="font-mc-body text-sm text-neutral-300/90 leading-relaxed mb-3">
        Welcome to RIFTSCAPE&apos;s first 100-day challenge. Enter your
        Minecraft and Discord usernames to enroll. One life.* Make it count.
      </p>
      <p className="font-mc-body text-[11px] text-foreground/40 mb-10 leading-relaxed">
        *Up to two additional lives may be purchased via the Store. Accounts
        submitted here are held for the duration of the 100-Day challenge and
        completely wiped once it concludes. Limit one enrollment per device.
      </p>

      {isDeviceEnrolled && (
        <div className="mb-6 p-4 mc-panel pixel-corners text-[color:var(--mc-legendary)]/90 font-mc-body text-xs flex items-center gap-3">
          <svg
            className="w-4 h-4 shrink-0 text-[color:var(--mc-legendary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>
            This device has already registered a survivor for this run.
          </span>
        </div>
      )}

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full flex flex-col gap-4"
      >
        <input
          type="text"
          required
          disabled={isDeviceEnrolled}
          placeholder="Minecraft Username"
          value={minecraftUsername}
          onChange={(e) => setMinecraftUsername(e.target.value)}
          className="mc-input pixel-corners w-full px-5 py-4 font-mc-body text-sm"
        />
        <input
          type="text"
          required
          disabled={isDeviceEnrolled}
          placeholder="Discord Username"
          value={discordUsername}
          onChange={(e) => setDiscordUsername(e.target.value)}
          className="mc-input pixel-corners w-full px-5 py-4 font-mc-body text-sm"
        />

        <button
          type="button"
          disabled={!canHold}
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onPointerCancel={cancelHold}
          className="mc-btn pixel-corners relative overflow-hidden px-8 py-4 font-mc-sub text-xs uppercase tracking-widest select-none"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: holding ? "100%" : "0%" }}
            transition={
              holding
                ? { duration: HOLD_DURATION / 1000, ease: "linear" }
                : { duration: 0.2, ease: "easeOut" }
            }
            onAnimationComplete={handleHoldComplete}
            className="absolute inset-y-0 left-0 bg-accent"
          />
          <span
            className={`relative z-10 transition-colors duration-150 ${
              !canHold
                ? "text-foreground/40"
                : holding
                  ? "text-background"
                  : "text-accent"
            }`}
          >
            {isDeviceEnrolled
              ? "Device Limit Reached (1 Per Device)"
              : status === "loading"
                ? "Enrolling..."
                : holding
                  ? "Keep Holding..."
                  : "Hold to Enroll"}
          </span>
        </button>
      </form>

      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`mt-6 font-mc-body text-sm mc-text-shadow ${
              status === "success"
                ? "text-[color:var(--mc-success)]"
                : "text-[color:var(--mc-danger)]"
            }`}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
