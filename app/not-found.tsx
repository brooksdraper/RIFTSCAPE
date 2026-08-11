"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";

const REDIRECT_SECONDS = 10;

export default function NotFound() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, router]);

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center overflow-hidden">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 mc-panel pixel-corners-lg p-10 sm:p-12 max-w-lg w-full mx-4 text-center">
        <div className="inline-block mx-auto mb-6 px-6 pb-4 bg-neutral-800 border-2 border-black pixel-corners-sm pixel-slot">
          <h1 className="font-mc-header text-6xl sm:text-7xl leading-relaxed mc-text-shadow text-red-500">
            404
          </h1>
        </div>

        <p className="font-mc-body text-sm text-neutral-300/90 leading-relaxed mb-8 max-w-sm mx-auto">
          This block hasn&apos;t been generated yet, or the chunk you&apos;re
          looking for doesn&apos;t exist.
        </p>

        {/* Redirect countdown — XP-bar style */}
        <div className="mb-8 max-w-xs mx-auto">
          <div className="h-3 pixel-slot pixel-corners-sm overflow-hidden">
            <div
              className="h-full bg-accent transition-[width] duration-1000 ease-linear"
              style={{ width: `${(secondsLeft / REDIRECT_SECONDS) * 100}%` }}
            />
          </div>
          <p className="font-mc-sub text-[10px] text-neutral-500 tracking-widest uppercase mt-2">
            Returning to spawn in {secondsLeft}s
          </p>
        </div>

        <Link
          href="/"
          className="mc-btn mc-btn-accent pixel-corners px-8 py-4 font-mc-sub text-xs uppercase tracking-widest inline-flex items-center justify-center"
        >
          Back to Spawn
        </Link>
      </div>
    </main>
  );
}
