"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Map as MapIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { LIVE_MAP_URL } from "@/lib/links";

const MAP_HOST = new URL(LIVE_MAP_URL).host;
const PING_INTERVAL_MS = 10_000;

type PingState = "checking" | "online" | "offline";

function usePing(host: string, intervalMs: number) {
  const [state, setState] = useState<PingState>("checking");
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const start = performance.now();
      try {
        // Opaque no-cors probe — we only care whether it resolves and how
        // long it takes, not the response body.
        await fetch(`https://${host}/`, {
          mode: "no-cors",
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        if (cancelled) return;
        setMs(Math.round(performance.now() - start));
        setState("online");
      } catch {
        if (cancelled) return;
        setMs(null);
        setState("offline");
      }
    }

    check();
    const id = setInterval(check, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [host, intervalMs]);

  return { state, ms };
}

const PING_STYLE: Record<PingState, { label: string; color: string }> = {
  checking: { label: "Pinging…", color: "var(--mc-common)" },
  online: { label: "Online", color: "var(--mc-success)" },
  offline: { label: "Unreachable", color: "var(--mc-danger)" },
};

export function MapOverview() {
  const { state, ms } = usePing(MAP_HOST, PING_INTERVAL_MS);
  const { label, color } = PING_STYLE[state];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
      className="mb-16"
    >
      <div className="mc-panel-raised pixel-corners-lg border-2 border-black p-3 sm:p-4">
        <div className="relative w-full aspect-[16/9] pixel-slot pixel-corners border-2 border-black overflow-hidden bg-black">
          <Image
            src="/img/Sulfuria.png"
            alt="Overview map of Sulfuria"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Live map HUD: connection readout + jump to the real thing */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-stretch gap-3">
          <div className="mc-chip pixel-corners-sm pixel-slot px-4 py-2.5 flex-1 flex items-center justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <div className="font-mc-sub text-[8px] sm:text-[9px] text-neutral-400 uppercase tracking-widest">
                {MAP_HOST}
              </div>
              <div
                className="font-mc-header text-[11px] sm:text-xs mc-text-shadow leading-relaxed mt-1"
                style={{ color }}
              >
                {label}
                {state === "online" && ms !== null ? ` · ${ms}ms` : null}
              </div>
            </div>

            <span className="relative flex h-2.5 w-2.5 shrink-0">
              {state === "online" && (
                <span
                  className="absolute inline-flex h-full w-full animate-ping opacity-75"
                  style={{ backgroundColor: color }}
                />
              )}
              <span
                className="relative inline-flex h-2.5 w-2.5"
                style={{ backgroundColor: color }}
              />
            </span>
          </div>

          <Link
            href={LIVE_MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mc-btn mc-btn-accent pixel-corners px-6 py-2.5 font-mc-sub text-xs uppercase tracking-widest flex items-center justify-center gap-2 shrink-0"
          >
            <MapIcon className="w-4 h-4 shrink-0" strokeWidth={2} />
            View Live
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
