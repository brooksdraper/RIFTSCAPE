"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Skull } from "lucide-react";
import type { EnrolledPlayer } from "@/lib/players";

/** Matches the RED three-strike system in `docs` / the rules page. */
const MAX_RED_STRIKES = 3;

/** Square pip + label — the vanilla way of reading a binary state. */
function StatusChip({ ok, label }: { ok: boolean; label: string }) {
  const color = ok ? "var(--mc-success)" : "var(--mc-danger)";

  return (
    <span className="mc-chip pixel-corners-sm pixel-slot border-2 border-black inline-flex items-center gap-1.5 px-2 py-1">
      <span
        className="w-1.5 h-1.5 shrink-0"
        style={{ backgroundColor: color }}
      />
      <span
        className="font-mc-sub text-[8px] uppercase tracking-widest"
        style={{ color }}
      >
        {label}
      </span>
    </span>
  );
}

/** One linked account: avatar slot, handle, and its link/verification state. */
function AccountCell({
  label,
  name,
  avatar,
  ok,
  status,
  className = "",
}: {
  label: string;
  name: string;
  avatar: string | null;
  ok: boolean;
  status: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${className}`}>
      <div className="w-10 h-10 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            aria-hidden
            width={64}
            height={64}
            className="w-full h-full object-contain pixelated"
          />
        ) : (
          <span className="font-mc-header text-sm text-foreground/40">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-mc-sub text-[9px] tracking-widest uppercase text-accent/60">
          {label}
        </div>
        <div className="font-mc-body text-xs text-foreground/90 truncate mb-1.5">
          {name}
        </div>
        <StatusChip ok={ok} label={status} />
      </div>
    </div>
  );
}

/** Standing readout — a label over its value, like an ID card data field. */
function StandingCell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-4 py-3 ${className}`}>
      <div className="font-mc-sub text-[9px] tracking-widest uppercase text-accent/60 mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}

export function IdHeader({ profile }: { profile: EnrolledPlayer | null }) {
  const statusColor = profile ? "var(--mc-success)" : "var(--mc-danger)";

  const strikes = profile?.red_strikes ?? 0;
  const points = profile?.points ?? 0;
  const verified = Boolean(profile?.mc_verified_at);

  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mc-sub text-[11px] uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors mb-8"
      >
        <span>←</span> Back to HQ
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`text-center ${profile ? "mb-6" : "mb-10 sm:mb-14"}`}
      >
        <span className="relative inline-flex items-center gap-2 mc-panel-raised pixel-corners pixel-slot border-2 border-black overflow-hidden font-mc-sub text-[11px] tracking-widest uppercase px-6 py-2 mc-text-shadow enchant-glint-gold">
          <span
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-foreground">RIFTSCAPE ID</span>
          <span
            className="w-2 h-2 shrink-0"
            style={{ backgroundColor: statusColor }}
          />
        </span>
      </motion.div>

      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full max-w-lg mx-auto mb-10 sm:mb-14 mc-panel pixel-corners border-2 border-black overflow-hidden"
        >
          {/* Linked accounts */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <AccountCell
              label="Discord"
              name={profile.dc_user || "Unknown"}
              avatar={profile.dc_avatar_url ?? null}
              ok={Boolean(profile.dc_user)}
              status={profile.dc_user ? "Linked" : "Not Linked"}
            />
            <AccountCell
              label="Minecraft"
              name={profile.mc_user}
              avatar={`https://mc-heads.net/avatar/${encodeURIComponent(
                profile.mc_user,
              )}/64`}
              ok={verified}
              status={verified ? "Verified" : "Unverified"}
              className="border-t-2 sm:border-t-0 sm:border-l-2 border-black"
            />
          </div>

          {/* Standing */}
          <div className="grid grid-cols-2 border-t-2 border-black">
            <StandingCell label="Red Strikes">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: MAX_RED_STRIKES }, (_, i) => {
                  const lit = i < Math.min(strikes, MAX_RED_STRIKES);
                  return (
                    <div
                      key={i}
                      className={`w-7 h-7 pixel-corners-sm border-2 border-black flex items-center justify-center ${
                        lit
                          ? "pixel-raised bg-red-700"
                          : "pixel-slot bg-black/30 opacity-40"
                      }`}
                    >
                      <Skull
                        size={12}
                        className={lit ? "text-red-100" : "text-foreground/30"}
                      />
                    </div>
                  );
                })}
              </div>
            </StandingCell>

            <StandingCell
              label="Ban Points"
              className="border-l-2 border-black"
            >
              <span className="mc-chip pixel-corners-sm pixel-slot border-2 border-black inline-flex items-baseline gap-1.5 px-2.5 py-1">
                <span
                  className="font-mc-header text-sm mc-text-shadow"
                  style={{
                    color:
                      points > 0 ? "var(--mc-danger)" : "var(--mc-success)",
                  }}
                >
                  {points}
                </span>
                <span className="font-mc-sub text-[8px] uppercase tracking-widest text-foreground/40">
                  pts
                </span>
              </span>
            </StandingCell>
          </div>
        </motion.div>
      )}
    </>
  );
}
