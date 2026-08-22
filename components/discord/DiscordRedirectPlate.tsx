"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DISCORD_URL } from "@/lib/links";
import { PortalIcon } from "@/components/discord/PortalIcon";
import { PortalProgressFill } from "@/components/discord/PortalProgressFill";
import { PortalBarParticles } from "@/components/discord/PortalBarParticles";

const REDIRECT_MS = 2000;

interface DiscordRedirectPlateProps {
  sourceId?: string;
}

export function DiscordRedirectPlate({ sourceId }: DiscordRedirectPlateProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!sourceId) return;

    fetch("/api/discord-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourceId }),
      keepalive: true,
    }).catch(() => {
      // Attribution is best-effort — never block the redirect on it.
    });
  }, [sourceId]);

  useEffect(() => {
    const start = Date.now();
    let frame: number;

    const tick = () => {
      const pct = Math.min(100, ((Date.now() - start) / REDIRECT_MS) * 100);
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        window.location.href = DISCORD_URL;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const secondsLeft = Math.max(
    1,
    Math.ceil((100 - progress) / (100 / (REDIRECT_MS / 1000))),
  );

  return (
    <div className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners px-6 py-12">
      <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
        <PortalIcon />
      </div>

      <h1 className="font-mc-header text-xl sm:text-2xl mb-3 mc-text-shadow leading-relaxed">
        Opening a Portal to Discord
      </h1>
      <p className="font-mc-body text-sm text-foreground/60 mb-8 leading-relaxed">
        Hang tight survivor, you&apos;ll land in the RIFTSCAPE Discord any
        moment now. Grab the door yourself if the portal stalls.
      </p>

      <div className="mb-8">
        <div className="relative">
          <div className="relative h-6 bg-black/70 border-2 border-black pixel-corners-sm pixel-slot overflow-hidden">
            <PortalProgressFill progress={progress} />
          </div>
          <PortalBarParticles progress={progress} />
        </div>
        <p className="mt-2 font-mc-sub text-[9px] text-[color:var(--mc-epic)] tracking-widest uppercase">
          Redirecting in {secondsLeft}s
        </p>
      </div>

      <a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mc-btn mc-btn-epic pixel-corners inline-block px-8 py-4 font-mc-sub text-xs uppercase tracking-widest mb-6"
      >
        Open Discord Now
      </a>

      <div>
        <Link
          href="/"
          className="font-mc-sub text-[11px] text-foreground/50 hover:text-accent tracking-widest uppercase transition-colors"
        >
          ← Back to Base
        </Link>
      </div>
    </div>
  );
}
