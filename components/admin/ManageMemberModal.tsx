"use client";

import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  Clock,
  Loader2,
  PawPrint,
  Skull,
  Swords,
} from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import type { EnrolledPlayer } from "@/lib/players";
import type { PlayerPower } from "@/lib/server-status";
import {
  formatIssueTimestamp,
  registryNumber,
} from "@/lib/players/riftscape-id";
import { SecuritySeal } from "@/components/user/SecuritySeal";
import { TIER_META } from "@/lib/store/supporter-items";

interface ManageMemberModalProps {
  player: EnrolledPlayer | null;
  onClose: () => void;
  onUpdated: (player: EnrolledPlayer) => void;
  onRemoved: (id: string) => void;
}

const emptySubscribe = () => () => {};

const TIERS: EnrolledPlayer["tier"][] = [
  "member",
  "survivor",
  "voyager",
  "weaver",
  "sentinel",
  "archon",
];

/**
 * Portaled to `document.body` so it always sits outside the roster list's
 * scroll container and above the sticky header, regardless of z-index or
 * `overflow`/`transform` ancestors in between.
 */
export function ManageMemberModal({
  player,
  onClose,
  onUpdated,
  onRemoved,
}: ManageMemberModalProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {player && (
        <ManageMemberModalContent
          key={player.id}
          player={player}
          onClose={onClose}
          onUpdated={onUpdated}
          onRemoved={onRemoved}
        />
      )}
    </AnimatePresence>,
    document.body,
  );
}

type Busy =
  | "tier"
  | "life"
  | "verify"
  | "strikes"
  | "points"
  | "remove"
  | "delete-account"
  | null;

function JoinDateBadge({ date }: { date?: string }) {
  return (
    <div className="mc-chip pixel-raised pixel-corners-sm border-2 border-black shrink-0 flex flex-col items-center gap-0.5 px-2.5 py-1.5">
      <span className="font-mc-sub text-[7px] uppercase tracking-widest text-foreground/40">
        Joined
      </span>
      <span className="font-mc-body text-[9px] text-foreground/70 whitespace-nowrap">
        {formatIssueTimestamp(date)}
      </span>
    </div>
  );
}

function PowerStat({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof Swords;
  color: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="mc-chip pixel-corners-sm pixel-slot border-2 border-black px-1.5 py-1.5 flex flex-col items-center justify-center gap-0.5">
      <div className="flex items-center gap-1" style={{ color }}>
        <Icon size={10} />
        <span className="font-mc-sub text-[7px] tracking-wider uppercase text-foreground/40">
          {label}
        </span>
      </div>
      <div className="font-mc-header text-xs text-foreground leading-relaxed">
        {value}
      </div>
    </div>
  );
}

function ManageMemberModalContent({
  player,
  onClose,
  onUpdated,
  onRemoved,
}: {
  player: EnrolledPlayer;
  onClose: () => void;
  onUpdated: (player: EnrolledPlayer) => void;
  onRemoved: (id: string) => void;
}) {
  const [lifeNumber, setLifeNumber] = useState(player.life_number);
  const [redStrikes, setRedStrikes] = useState(player.red_strikes ?? 0);
  const [points, setPoints] = useState(player.points ?? 0);
  const [strikesOpen, setStrikesOpen] = useState(false);
  const [busy, setBusy] = useState<Busy>(null);
  const [error, setError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);

  const [mcDataOpen, setMcDataOpen] = useState(false);

  const [powerOpen, setPowerOpen] = useState(false);
  const [powerLoading, setPowerLoading] = useState(false);
  const [powerFetched, setPowerFetched] = useState(false);
  const [powerData, setPowerData] = useState<PlayerPower | null>(null);
  const [powerError, setPowerError] = useState("");

  const verified = Boolean(player.mc_verified_at);

  async function togglePower() {
    const opening = !powerOpen;
    setPowerOpen(opening);
    if (!opening || powerFetched) return;

    setPowerLoading(true);
    setPowerError("");
    try {
      const res = await fetch(`/api/admin/players/${player.id}/power`);
      const data = await res.json();

      if (!res.ok) {
        setPowerError(data.error ?? "No power data found for this member.");
      } else {
        setPowerData(data.player);
      }
    } catch {
      setPowerError("Something went wrong. Try again.");
    } finally {
      setPowerFetched(true);
      setPowerLoading(false);
    }
  }

  async function patch(body: Record<string, unknown>, kind: Busy) {
    setBusy(kind);
    setError("");
    try {
      const res = await fetch(`/api/admin/players/${player.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      onUpdated(data.player);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setBusy(null);
    }
  }

  async function handleRemove() {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }

    setBusy("remove");
    setError("");
    try {
      const res = await fetch(`/api/admin/players/${player.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setBusy(null);
        return;
      }

      onRemoved(player.id);
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(null);
    }
  }

  async function handleDeleteAccount() {
    if (!confirmDeleteAccount) {
      setConfirmDeleteAccount(true);
      return;
    }

    setBusy("delete-account");
    setError("");
    try {
      const res = await fetch(`/api/admin/players/${player.id}/account`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setBusy(null);
        return;
      }

      onRemoved(player.id);
      onClose();
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(null);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md mc-panel-raised pixel-corners p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-mc-sub text-foreground/50 hover:text-accent transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-3">
          Manage Member
        </div>

        {/* Identity */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-black">
          <Image
            src={`https://mc-heads.net/avatar/${encodeURIComponent(player.mc_user)}/64`}
            alt={player.mc_user}
            width={64}
            height={64}
            className="w-12 h-12 shrink-0 pixelated pixel-corners-sm border-2 border-black"
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-mc-header text-sm mc-text-shadow leading-tight truncate">
              {player.mc_user}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="mc-chip pixel-raised pixel-corners-sm font-mc-sub text-[8px] uppercase tracking-wider text-accent/80 px-2 py-1">
                {registryNumber(player.id)}
              </span>
            </div>
          </div>
          <JoinDateBadge date={player.created_at} />
        </div>

        {/* Tier */}
        <div className="mb-6 pb-6 border-b-2 border-black">
          <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
            Tier
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((tier) => {
              const meta = TIER_META[tier];
              const active = player.tier === tier;
              return (
                <button
                  key={tier}
                  disabled={busy !== null}
                  onClick={() =>
                    tier !== player.tier && patch({ tier }, "tier")
                  }
                  className={`pixel-corners-sm border-2 border-black font-mc-sub text-[9px] uppercase tracking-wider px-2 py-2 transition-colors ${
                    active
                      ? "pixel-slot bg-black/60"
                      : "pixel-raised bg-black/20 hover:bg-black/40"
                  }`}
                  style={{ color: active ? meta.text : "var(--mc-common)" }}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* RED Strikes */}
        <div className="mb-6 pb-6 border-b-2 border-black">
          <button
            onClick={() => setStrikesOpen((v) => !v)}
            className="mc-btn pixel-corners w-full py-2.5 px-3 flex items-center gap-3"
          >
            <span className="font-mc-sub text-xs uppercase tracking-widest shrink-0">
              Strikes
            </span>
            <div className="flex-1 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => {
                const lit = i < Math.min(redStrikes, 3);
                return (
                  <div
                    key={i}
                    className={`flex-1 h-7 pixel-corners-sm border-2 border-black flex items-center justify-center transition-colors ${
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
            <ChevronDown
              size={14}
              className={`shrink-0 text-foreground/50 transition-transform ${
                strikesOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {strikesOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  <div>
                    <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
                      Strike Count
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy !== null || redStrikes <= 0}
                        onClick={() => setRedStrikes((n) => Math.max(0, n - 1))}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        −
                      </button>
                      <div className="mc-input pixel-corners-sm flex-1 flex items-center justify-center py-2">
                        <span
                          className="font-mc-header text-sm mc-text-shadow"
                          style={{
                            color:
                              redStrikes > 0
                                ? "var(--mc-danger)"
                                : "var(--accent)",
                          }}
                        >
                          {redStrikes}
                        </span>
                      </div>
                      <button
                        disabled={busy !== null}
                        onClick={() => setRedStrikes((n) => n + 1)}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        +
                      </button>
                      <button
                        disabled={
                          busy !== null ||
                          redStrikes === (player.red_strikes ?? 0)
                        }
                        onClick={() =>
                          patch({ red_strikes: redStrikes }, "strikes")
                        }
                        className="mc-btn mc-btn-danger pixel-corners-sm px-4 py-2 font-mc-sub text-[10px] uppercase tracking-wider shrink-0"
                      >
                        {busy === "strikes" ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
                      Temp Ban Points
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy !== null || points <= 0}
                        onClick={() => setPoints((n) => Math.max(0, n - 1))}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        −
                      </button>
                      <div className="mc-input pixel-corners-sm flex-1 flex items-center justify-center py-2">
                        <span
                          className="font-mc-header text-sm mc-text-shadow"
                          style={{
                            color:
                              points > 0 ? "var(--mc-danger)" : "var(--accent)",
                          }}
                        >
                          {points}
                        </span>
                      </div>
                      <button
                        disabled={busy !== null}
                        onClick={() => setPoints((n) => n + 1)}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        +
                      </button>
                      <button
                        disabled={
                          busy !== null || points === (player.points ?? 0)
                        }
                        onClick={() => patch({ points }, "points")}
                        className="mc-btn mc-btn-danger pixel-corners-sm px-4 py-2 font-mc-sub text-[10px] uppercase tracking-wider shrink-0"
                      >
                        {busy === "points" ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Minecraft Data */}
        <div className="mb-6 pb-6 border-b-2 border-black">
          <button
            onClick={() => setMcDataOpen((v) => !v)}
            className="mc-btn pixel-corners w-full py-3 px-3 flex items-center justify-between gap-2 font-mc-sub text-xs uppercase tracking-widest"
          >
            <span>Minecraft Data</span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-foreground/50 transition-transform ${
                mcDataOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {mcDataOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-4">
                  <div>
                    <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
                      Life Number
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy !== null || lifeNumber <= 0}
                        onClick={() => setLifeNumber((n) => Math.max(0, n - 1))}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        −
                      </button>
                      <div className="mc-input pixel-corners-sm flex-1 flex items-center justify-center py-2">
                        <span
                          className="font-mc-header text-sm mc-text-shadow"
                          style={{
                            color:
                              lifeNumber > 0
                                ? "var(--accent)"
                                : "var(--mc-danger)",
                          }}
                        >
                          {lifeNumber}
                        </span>
                      </div>
                      <button
                        disabled={busy !== null}
                        onClick={() => setLifeNumber((n) => n + 1)}
                        className="mc-btn pixel-corners-sm w-10 h-10 font-mc-header text-sm shrink-0"
                      >
                        +
                      </button>
                      <button
                        disabled={
                          busy !== null || lifeNumber === player.life_number
                        }
                        onClick={() =>
                          patch({ life_number: lifeNumber }, "life")
                        }
                        className="mc-btn mc-btn-accent pixel-corners-sm px-4 py-2 font-mc-sub text-[10px] uppercase tracking-wider shrink-0"
                      >
                        {busy === "life" ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
                      Minecraft Verification
                    </label>
                    <div className="flex items-center gap-2">
                      <SecuritySeal
                        verified={verified}
                        className="w-11 h-11 shrink-0"
                      />
                      <button
                        disabled={busy !== null}
                        onClick={() => patch({ verified: !verified }, "verify")}
                        className={`mc-btn pixel-corners flex-1 py-3 font-mc-sub text-xs uppercase tracking-widest ${
                          verified ? "mc-btn-danger" : "mc-btn-accent"
                        }`}
                      >
                        {busy === "verify"
                          ? "Updating…"
                          : verified
                            ? "Revoke Verification"
                            : "Mark as Verified"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Power Data */}
        <div className="mb-6 pb-6 border-b-2 border-black">
          <button
            onClick={togglePower}
            className="mc-btn pixel-corners w-full py-3 px-3 flex items-center justify-between gap-2 font-mc-sub text-xs uppercase tracking-widest"
          >
            <span>Power Data</span>
            <ChevronDown
              size={14}
              className={`shrink-0 text-foreground/50 transition-transform ${
                powerOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <AnimatePresence>
            {powerOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                {powerLoading ? (
                  <div className="pt-4">
                    <span className="mc-chip pixel-slot pixel-corners-sm border-2 border-black inline-flex items-center gap-2 px-3 py-2 font-mc-sub text-[10px] uppercase tracking-wider text-[color:var(--mc-info)]">
                      <Loader2 size={12} className="animate-spin" />
                      Loading…
                    </span>
                  </div>
                ) : powerError ? (
                  <div className="pt-4">
                    <span className="mc-chip pixel-slot pixel-corners-sm border-2 border-black inline-flex items-center gap-2 px-3 py-2 font-mc-sub text-[10px] uppercase tracking-wider text-[color:var(--mc-danger)]">
                      <AlertTriangle size={12} />
                      {powerError}
                    </span>
                  </div>
                ) : powerData ? (
                  <div className="grid grid-cols-3 gap-1.5 pt-4">
                    <PowerStat
                      icon={Activity}
                      color="var(--mc-legendary)"
                      label="Score"
                      value={Math.round(powerData.score).toLocaleString()}
                    />
                    <PowerStat
                      icon={Clock}
                      color="var(--mc-common)"
                      label="Playtime"
                      value={`${Math.round(powerData.playtimeHours)}h`}
                    />
                    <PowerStat
                      icon={Swords}
                      color="var(--accent)"
                      label="PvP Kills"
                      value={powerData.pvpKills}
                    />
                    <PowerStat
                      icon={Skull}
                      color="var(--mc-danger)"
                      label="PvP Deaths"
                      value={powerData.pvpDeaths}
                    />
                    <PowerStat
                      icon={PawPrint}
                      color="var(--mc-success)"
                      label="Mob Kills"
                      value={powerData.mobKills}
                    />
                    <PowerStat
                      icon={Activity}
                      color="var(--mc-legendary)"
                      label="Active"
                      value={`${Math.round(powerData.activityIndex * 100)}%`}
                    />
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="font-mc-body text-xs text-[color:var(--mc-danger)] mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Danger zone */}
        <div className="space-y-4">
          <label className="block font-mc-sub text-[9px] text-[color:var(--mc-danger)]/70 tracking-widest uppercase mb-2">
            Danger Zone
          </label>
          <div>
            <button
              disabled={busy !== null}
              onClick={handleRemove}
              className="mc-btn mc-btn-danger pixel-corners w-full py-3 font-mc-sub text-xs uppercase tracking-widest"
            >
              {busy === "remove"
                ? "Removing…"
                : confirmRemove
                  ? "Click Again to Confirm"
                  : "Remove From Season"}
            </button>
            <p className="mt-1.5 font-mc-body text-[10px] text-foreground/40 leading-relaxed">
              Removes them from this season only — identity and tier are kept.
            </p>
          </div>
          <div>
            <button
              disabled={busy !== null}
              onClick={handleDeleteAccount}
              className="mc-btn mc-btn-danger pixel-corners w-full py-3 font-mc-sub text-xs uppercase tracking-widest"
            >
              {busy === "delete-account"
                ? "Deleting…"
                : confirmDeleteAccount
                  ? "Click Again to Confirm"
                  : "Delete Account"}
            </button>
            <p className="mt-1.5 font-mc-body text-[10px] text-foreground/40 leading-relaxed">
              Permanently deletes their identity and every season&apos;s
              history. Cannot be undone.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
