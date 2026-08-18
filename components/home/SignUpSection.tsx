"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { signInWithDiscord } from "@/lib/auth/sign-in";
import type { Viewer } from "@/lib/auth/profile";

const HOLD_DURATION = 900;

export function SignUpSection({ viewer }: { viewer: Viewer }) {
  const router = useRouter();
  const { discord, profile } = viewer;
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [holding, setHolding] = useState(false);
  const holdingRef = useRef(false);

  // Enrollment is now capped by the profiles primary key (one row per Discord
  // account), so there is no device cookie to read and no hydration dance.
  const isEnrolled = profile !== null || status === "success";

  const handleSignIn = async () => {
    setStatus("loading");
    const { error } = await signInWithDiscord("/#enroll");
    if (error) {
      setStatus("error");
      setMessage("Could not reach Discord. Try again.");
    }
  };

  const submitEnrollment = async () => {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftUsername }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're enrolled. See you on Sulfuria.");
      setMinecraftUsername("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  const canHold =
    !isEnrolled && status !== "loading" && minecraftUsername.trim().length > 0;

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
          isEnrolled ? "text-[color:var(--mc-legendary)]" : "text-accent"
        }`}
      >
        {isEnrolled ? "[x] Enrolled" : "[v] Enrollment Open"}
      </span>
      <h2 className="font-mc-header text-2xl md:text-3xl mb-5 mc-text-shadow leading-relaxed">
        Sign Up
      </h2>
      <p className="font-mc-body text-sm text-neutral-300/90 leading-relaxed mb-3">
        Welcome to RIFTSCAPE&apos;s first 60-day challenge. Sign in with
        Discord, then claim your Minecraft username to enroll. One life.* Make
        it count.
      </p>
      <p className="font-mc-body text-[11px] text-foreground/40 mb-10 leading-relaxed">
        *Up to two additional lives may be purchased via the Store. Accounts
        submitted here are held for the duration of the 60-Day challenge and
        completely wiped once it concludes. One survivor per Discord account.
      </p>

      {isEnrolled ? (
        <div className="p-4 mc-panel pixel-corners text-[color:var(--mc-legendary)]/90 font-mc-body text-xs flex items-center gap-3">
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
            {profile
              ? `${profile.mc_user} is enrolled for this run.`
              : "You're enrolled for this run."}
          </span>
        </div>
      ) : !discord ? (
        <button
          type="button"
          onClick={handleSignIn}
          disabled={status === "loading"}
          className="mc-btn pixel-corners inline-flex items-center justify-center gap-3 px-8 py-4 font-mc-sub text-xs uppercase tracking-widest text-accent self-start"
        >
          <DiscordIcon className="w-4 h-4 shrink-0" />
          {status === "loading"
            ? "Connecting..."
            : "Sign In With Discord To Enroll"}
        </button>
      ) : (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full flex flex-col gap-4"
        >
          {/* Identity is settled by OAuth, so it reads out rather than inputs. */}
          <div className="mc-panel pixel-corners pixel-slot flex items-center gap-3 px-5 py-4">
            {discord.avatarUrl ? (
              <Image
                src={discord.avatarUrl}
                alt={discord.username}
                width={32}
                height={32}
                className="w-8 h-8 shrink-0 border-2 border-black"
              />
            ) : (
              <DiscordIcon className="w-5 h-5 shrink-0 text-foreground/60" />
            )}
            <div className="min-w-0">
              <div className="font-mc-sub text-[9px] tracking-widest uppercase text-accent/60 mb-1">
                Discord Verified
              </div>
              <div className="font-mc-body text-sm text-foreground/90 truncate">
                {discord.username}
              </div>
            </div>
          </div>

          <input
            type="text"
            required
            placeholder="Minecraft Username"
            value={minecraftUsername}
            onChange={(e) => setMinecraftUsername(e.target.value)}
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
              {status === "loading"
                ? "Enrolling..."
                : holding
                  ? "Keep Holding..."
                  : "Hold to Enroll"}
            </span>
          </button>
        </form>
      )}

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
