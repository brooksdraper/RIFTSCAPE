"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { setAccountCookie } from "@/lib/account";

const fieldVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

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

export function AccountLoginPill() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [minecraftUsername, setMinecraftUsername] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const closeDropdown = () => {
    setOpen(false);
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minecraftUsername, discordUsername }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setAccountCookie({
        minecraftUsername: data.minecraftUsername,
        discordUsername: data.discordUsername,
      });
      setOpen(false);
      setStatus("idle");
      setMinecraftUsername("");
      setDiscordUsername("");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      ref={containerRef}
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="sticky top-0 z-50 flex justify-start p-3"
    >
      <div className="relative">
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mc-btn pixel-corners inline-flex items-center gap-2 px-4 py-2 font-mc-sub text-[10px] text-accent uppercase tracking-widest"
        >
          Sign In
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 top-full mt-2 w-64 flex flex-col gap-2 p-4 mc-panel-raised pixel-corners pixel-slot origin-top"
            >
              <motion.input
                type="text"
                required
                placeholder="Minecraft Username"
                value={minecraftUsername}
                onChange={(e) => setMinecraftUsername(e.target.value)}
                custom={0}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="mc-input pixel-corners-sm w-full px-3 py-2 font-mc-body text-xs"
              />
              <motion.input
                type="text"
                required
                placeholder="Discord Username"
                value={discordUsername}
                onChange={(e) => setDiscordUsername(e.target.value)}
                custom={1}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="mc-input pixel-corners-sm w-full px-3 py-2 font-mc-body text-xs"
              />

              <motion.div
                custom={2}
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-2 mt-1"
              >
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  className="mc-btn mc-btn-accent pixel-corners-sm flex-1 px-3 py-2 font-mc-sub uppercase tracking-wider text-[10px]"
                >
                  {status === "loading" ? "Checking..." : "Sign In"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={closeDropdown}
                  className="mc-btn pixel-corners-sm px-3 py-2 font-mc-sub text-foreground/60 uppercase tracking-wider text-[10px]"
                >
                  Cancel
                </motion.button>
              </motion.div>

              <AnimatePresence>
                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="font-mc-body text-xs text-[color:var(--mc-danger)]"
                  >
                    {message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
