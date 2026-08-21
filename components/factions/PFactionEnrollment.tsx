"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Check, CheckCircle2, Crown, Flag, Users } from "lucide-react";
import {
  FACTION_BASE_COLORS,
  getFactionBaseColor,
  lightenHex,
  type FactionBaseColor,
} from "@/lib/factions/colors";
import type { Faction } from "@/lib/factions";
import { FACTION_NAME_PATTERN } from "@/lib/validation";

export type FactionWithMembers = Faction & {
  memberProfiles: { id: string; mc_user: string }[];
};

interface FactionEnrollmentProps {
  mcUsername: string;
  mcUuid: string;
  ownedFaction: Faction | null;
  factions: FactionWithMembers[];
  viewerProfile: { id: string; mc_user: string };
  initialViewerFactionId: string | null;
}

const MAX_VISIBLE_MEMBERS = 5;

export function FactionEnrollment({
  mcUsername,
  mcUuid,
  ownedFaction,
  factions,
  viewerProfile,
  initialViewerFactionId,
}: FactionEnrollmentProps) {
  const [faction, setFaction] = useState<Faction | null>(ownedFaction);
  const [rosters, setRosters] = useState(factions);
  const [viewerFactionId, setViewerFactionId] = useState(
    initialViewerFactionId,
  );
  const [tab, setTab] = useState<"create" | "join">(
    faction ? "create" : viewerFactionId ? "join" : "create",
  );

  const [name, setName] = useState("");
  const [baseColor, setBaseColor] = useState<FactionBaseColor | null>(null);
  const [createStatus, setCreateStatus] = useState<
    "idle" | "submitting" | "error"
  >("idle");
  const [createError, setCreateError] = useState<string | null>(null);

  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinErrorId, setJoinErrorId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const canSubmit =
    FACTION_NAME_PATTERN.test(name.trim()) &&
    baseColor !== null &&
    createStatus !== "submitting";

  async function handleCreate() {
    if (!canSubmit) return;

    setCreateStatus("submitting");
    setCreateError(null);

    try {
      const res = await fetch("/api/factions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), baseColor }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data?.error ?? "Something went wrong. Try again.");
        setCreateStatus("error");
        return;
      }

      setFaction(data.faction);
      setViewerFactionId(data.faction.id);
      setRosters((prev) => [
        ...prev,
        { ...data.faction, memberProfiles: [] },
      ]);
    } catch {
      setCreateError("Could not reach the server. Try again.");
      setCreateStatus("error");
    }
  }

  async function handleJoin(factionId: string) {
    if (!viewerProfile || viewerFactionId) return;

    setJoiningId(factionId);
    setJoinErrorId(null);
    setJoinError(null);

    try {
      const res = await fetch("/api/factions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factionId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setJoinErrorId(factionId);
        setJoinError(data?.error ?? "Something went wrong. Try again.");
        return;
      }

      setRosters((prev) =>
        prev.map((f) =>
          f.id === factionId
            ? {
                ...f,
                members: data.faction.members,
                memberProfiles: [
                  ...f.memberProfiles,
                  { id: viewerProfile.id, mc_user: viewerProfile.mc_user },
                ],
              }
            : f,
        ),
      );
      setViewerFactionId(factionId);
    } catch {
      setJoinErrorId(factionId);
      setJoinError("Could not reach the server. Try again.");
    } finally {
      setJoiningId(null);
    }
  }

  const isMemberElsewhere = viewerFactionId !== null && !faction;

  return (
    <section className="mb-16">
      <div className="text-center mb-10">
        <h2 className="font-mc-header text-2xl sm:text-3xl text-foreground mb-4 mc-text-shadow leading-relaxed">
          Build Your <span className="text-accent">Faction</span>
        </h2>
        <p className="font-mc-body text-neutral-400 text-sm leading-relaxed max-w-md mx-auto">
          Lead your own banner or rally under someone else&apos;s — the
          choice is yours.
        </p>
      </div>

      <div className="flex justify-center mb-10">
        <div className="inline-flex gap-1.5 mc-panel-raised pixel-corners border-2 border-black p-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "create"}
            onClick={() => setTab("create")}
            className={`mc-btn pixel-corners-sm px-6 py-3 font-mc-sub text-xs uppercase tracking-widest inline-flex items-center gap-2 ${
              tab === "create" ? "mc-btn-accent" : ""
            }`}
          >
            <Flag size={14} />
            Create
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "join"}
            onClick={() => setTab("join")}
            className={`mc-btn pixel-corners-sm px-6 py-3 font-mc-sub text-xs uppercase tracking-widest inline-flex items-center gap-2 ${
              tab === "join" ? "mc-btn-accent" : ""
            }`}
          >
            <Users size={14} />
            Join
            <span className="mc-chip pixel-corners-sm border-2 border-black px-1.5 py-0.5 text-[9px] leading-none text-white">
              {rosters.length}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "create" ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {faction ? (
              <div className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12">
                <div
                  className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center"
                  style={{ color: "var(--mc-success)" }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed">
                  Faction Registered
                </h3>
                <div className="inline-flex items-center gap-3 mc-chip pixel-corners-sm border-2 border-black px-4 py-2.5 mb-4">
                  <span
                    className="w-5 h-5 border-2 pixel-corners-sm shrink-0"
                    style={{
                      backgroundColor: getFactionBaseColor(faction.base_color)
                        .hex,
                      borderColor: lightenHex(
                        getFactionBaseColor(faction.base_color).hex,
                        -28,
                      ),
                    }}
                  />
                  <span className="font-mc-sub text-sm text-foreground uppercase tracking-wide">
                    {faction.name}
                  </span>
                </div>
                <p className="font-mc-body text-foreground/60 leading-relaxed text-sm mb-8">
                  Led by{" "}
                  <span className="text-accent font-mc-sub">
                    {mcUsername}
                  </span>
                  . {faction.members.length + 1} Members total.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("join")}
                  className="mc-btn pixel-corners inline-flex items-center gap-2 px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
                >
                  <Users size={14} />
                  View The Roster
                </button>
              </div>
            ) : isMemberElsewhere ? (
              <div className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12">
                <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-foreground/30">
                  <Users size={26} />
                </div>
                <h3 className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed">
                  Already Enlisted
                </h3>
                <p className="font-mc-body text-foreground/60 leading-relaxed text-sm mb-8">
                  You&apos;re already a member of another faction. Check the
                  Join tab to see your banner.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("join")}
                  className="mc-btn mc-btn-accent pixel-corners inline-flex items-center gap-2 px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
                >
                  <Users size={14} />
                  View My Faction
                </button>
              </div>
            ) : (
              <div className="w-full max-w-lg mx-auto mc-panel pixel-corners border-2 border-black px-6 py-10">
                <div className="mb-6">
                  <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
                    Faction Leader
                  </label>
                  <div className="mc-input pixel-corners-sm flex items-center gap-3 px-3 py-2.5">
                    <Image
                      src={`https://mc-heads.net/avatar/${encodeURIComponent(mcUuid)}/64`}
                      alt={mcUsername}
                      width={64}
                      height={64}
                      className="w-8 h-8 pixelated border-2 border-black shrink-0"
                    />
                    <span className="font-mc-body text-sm text-foreground truncate">
                      {mcUsername}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="faction-name"
                    className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2"
                  >
                    Faction Name
                  </label>
                  <div className="mc-input pixel-corners-sm flex items-center gap-3 px-3 py-2.5">
                    <Flag size={16} className="text-foreground/40 shrink-0" />
                    <input
                      id="faction-name"
                      type="text"
                      required
                      maxLength={24}
                      placeholder="The Redstone Order"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-transparent outline-none font-mc-body text-sm text-foreground placeholder:text-neutral-600"
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-3">
                    Base Color
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {FACTION_BASE_COLORS.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        role="radio"
                        aria-checked={baseColor === color.id}
                        aria-label={color.label}
                        title={color.label}
                        onClick={() => setBaseColor(color.id)}
                        className={`aspect-square pixel-corners-sm border-2 border-black transition-transform ${
                          baseColor === color.id
                            ? "scale-90 ring-2 ring-accent ring-offset-2 ring-offset-background"
                            : "hover:scale-95"
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {createError && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="font-mc-body text-xs mb-4 leading-relaxed"
                      style={{ color: "var(--mc-danger)" }}
                    >
                      {createError}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={handleCreate}
                  className="mc-btn mc-btn-accent pixel-corners w-full px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
                >
                  {createStatus === "submitting"
                    ? "Registering..."
                    : "Register Faction"}
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {rosters.length === 0 ? (
              <div className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners border-2 border-black px-6 py-12">
                <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-foreground/30">
                  <Flag size={26} />
                </div>
                <h3 className="font-mc-header text-xl sm:text-2xl text-foreground mb-3 mc-text-shadow leading-relaxed">
                  No Factions Yet
                </h3>
                <p className="font-mc-body text-foreground/60 leading-relaxed text-sm mb-8">
                  Nobody has registered a faction yet. Be the first.
                </p>
                <button
                  type="button"
                  onClick={() => setTab("create")}
                  className="mc-btn mc-btn-accent pixel-corners inline-flex items-center gap-2 px-8 py-4 font-mc-sub text-xs uppercase tracking-widest"
                >
                  <Flag size={14} />
                  Create A Faction
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {rosters.map((f, index) => {
                  const color = getFactionBaseColor(f.base_color);
                  const isLeader = f.owner_id === viewerProfile.id;
                  const isMember = viewerFactionId === f.id;
                  const overflow = Math.max(
                    f.memberProfiles.length - MAX_VISIBLE_MEMBERS,
                    0,
                  );

                  return (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                      style={{ borderColor: color.hex }}
                      className="mc-panel pixel-corners border-2 p-6 flex flex-col"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <span
                          className="w-6 h-6 border-2 border-black pixel-corners-sm shrink-0"
                          style={{
                            backgroundColor: color.hex,
                            borderColor: lightenHex(color.hex, -28),
                          }}
                        />
                        <h3 className="font-mc-header text-xl text-foreground mc-text-shadow leading-relaxed truncate">
                          {f.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <Image
                          src={`https://mc-heads.net/avatar/${encodeURIComponent(f.owner_mc_uuid)}/64`}
                          alt={f.owner_mc_user}
                          width={64}
                          height={64}
                          className="w-9 h-9 pixelated border-2 border-black shrink-0"
                        />
                        <div className="min-w-0">
                          <div
                            className="flex items-center gap-1.5 font-mc-sub text-[9px] tracking-widest uppercase"
                            style={{ color: color.hex }}
                          >
                            <Crown size={11} />
                            Leader
                          </div>
                          <div className="pixel-slot mc-chip pixel-corners-sm border-2 border-black px-2 py-1 font-mc-body text-sm text-foreground truncate">
                            {f.owner_mc_user}
                          </div>
                        </div>
                      </div>

                      <div className="mb-6 flex-grow">
                        <div
                          className="flex items-center gap-1.5 font-mc-sub text-[9px] tracking-widest uppercase mb-2 opacity-60"
                          style={{ color: color.hex }}
                        >
                          <Users size={11} />
                          Members ({f.memberProfiles.length})
                        </div>
                        {f.memberProfiles.length === 0 ? (
                          <p className="font-mc-body text-xs text-foreground/40">
                            No members yet.
                          </p>
                        ) : (
                          <div className="flex items-center">
                            {f.memberProfiles
                              .slice(0, MAX_VISIBLE_MEMBERS)
                              .map((member, i) => (
                                <Image
                                  key={member.id}
                                  src={`https://mc-heads.net/avatar/${encodeURIComponent(member.mc_user)}/64`}
                                  alt={member.mc_user}
                                  title={member.mc_user}
                                  width={64}
                                  height={64}
                                  className={`w-7 h-7 pixelated border-2 border-black shrink-0 ${i > 0 ? "-ml-1.25" : ""}`}
                                />
                              ))}
                            {overflow > 0 && (
                              <span className="-ml-2.5 w-7 h-7 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center font-mc-sub text-[9px] text-foreground/60">
                                +{overflow}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {joinErrorId === f.id && joinError && (
                        <p
                          className="font-mc-body text-xs mb-3 leading-relaxed"
                          style={{ color: "var(--mc-danger)" }}
                        >
                          {joinError}
                        </p>
                      )}

                      {isLeader ? (
                        <div className="flex items-center justify-center gap-2 pixel-corners border-2 border-black py-3 font-mc-sub text-xs uppercase tracking-widest text-accent bg-black/30">
                          <Crown size={14} />
                          You Lead This
                        </div>
                      ) : isMember ? (
                        <div
                          className="flex items-center justify-center gap-2 pixel-corners border-2 border-black py-3 font-mc-sub text-xs uppercase tracking-widest bg-black/30"
                          style={{ color: "var(--mc-success)" }}
                        >
                          <Check size={14} />
                          Joined
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            viewerFactionId !== null || joiningId === f.id
                          }
                          title={
                            viewerFactionId
                              ? "You are already in a faction"
                              : undefined
                          }
                          onClick={() => handleJoin(f.id)}
                          className="mc-btn mc-btn-accent pixel-corners w-full py-3 font-mc-sub text-xs uppercase tracking-widest"
                        >
                          {joiningId === f.id
                            ? "Joining..."
                            : viewerFactionId
                              ? "Already in a Faction"
                              : "Join Faction"}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
