"use client";

import { useCallback, useRef, useState } from "react";

const HOLD_MS = 3000;

type Status = "idle" | "holding" | "deleting";

export function DeleteAccountButton() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);

  const cancelHold = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setProgress(0);
    setStatus((current) => (current === "holding" ? "idle" : current));
  }, []);

  const start = useCallback(() => {
    if (frameRef.current !== null) return;

    const startedAt = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const pct = Math.min(elapsed / HOLD_MS, 1);
      setProgress(pct);

      if (pct >= 1) {
        frameRef.current = null;
        setStatus("deleting");
        setTimeout(() => {
          alert("Account deletion available 09/01.");
        }, 2000);
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    setStatus("holding");
    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const label =
    status === "deleting"
      ? "Deleting…"
      : status === "holding"
        ? `Hold to Confirm… (${Math.ceil((1 - progress) * (HOLD_MS / 1000))})`
        : "Delete Account";

  return (
    <button
      type="button"
      disabled={status === "deleting"}
      onMouseDown={start}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={start}
      onTouchEnd={cancelHold}
      className="relative mc-btn-danger mc-btn pixel-corners-sm inline-block px-5 py-2.5 font-mc-sub text-[10px] uppercase tracking-wider overflow-hidden select-none"
    >
      <span
        className="absolute inset-y-0 left-0 bg-black/40"
        style={{ width: `${progress * 100}%` }}
      />
      <span className="relative">{label}</span>
    </button>
  );
}
