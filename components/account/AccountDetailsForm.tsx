"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { User } from "@supabase/supabase-js";
import type { DiscordIdentity } from "@/lib/auth/discord";
import type { EnrolledPlayer } from "@/lib/players";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

const TIER_LABEL: Record<EnrolledPlayer["tier"], string> = {
  member: "Member",
  survivor: "Survivor",
  voyager: "Voyager",
  weaver: "Weaver",
  sentinel: "Sentinel",
  archon: "Archon",
};

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Small labelled data cell, laid out like an inventory tooltip field. */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mc-chip pixel-corners-sm pixel-slot px-4 py-3">
      <div className="font-mc-sub text-[10px] tracking-widest uppercase text-accent/60 mb-1">
        {label}
      </div>
      <div className="font-mc-body text-sm text-foreground/90 truncate">
        {children}
      </div>
    </div>
  );
}

/** Section wrapper with a small heading above a Field grid. */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="font-mc-sub text-[10px] text-foreground/40 tracking-widest uppercase mb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

export function AccountDetailsForm({
  user,
  discord,
  profile,
}: {
  user: User;
  discord: DiscordIdentity | null;
  profile: EnrolledPlayer | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 max-w-2xl mx-auto mc-panel-raised pixel-corners px-6 py-6"
    >
      <div className="flex items-center gap-3 mb-6">
        {discord?.avatarUrl ? (
          <Image
            src={discord.avatarUrl}
            alt={discord.username}
            width={40}
            height={40}
            className="w-10 h-10 shrink-0 border-2 border-black"
          />
        ) : (
          <div className="w-10 h-10 shrink-0 mc-chip pixel-slot flex items-center justify-center">
            <DiscordIcon className="w-5 h-5 text-foreground/60" />
          </div>
        )}
        <h2 className="font-mc-sub text-accent text-sm tracking-widest uppercase">
          Account Details
        </h2>
      </div>

      <Section title="Discord">
        <Field label="Handle">{discord?.username ?? "—"}</Field>
        <Field label="Discord ID">{discord?.id ?? "—"}</Field>
      </Section>

      <Section title="Database Account">
        <Field label="Email">{user.email ?? "—"}</Field>
        <Field label="User ID">{user.id}</Field>
        <Field label="Account Created">{formatDate(user.created_at)}</Field>
        <Field label="Last Sign-In">{formatDate(user.last_sign_in_at)}</Field>
      </Section>

      {profile ? (
        <>
          <Section title="Player Profile">
            <Field label="Minecraft Username">{profile.mc_user}</Field>
            <Field label="Minecraft UUID">{profile.mc_uuid ?? "—"}</Field>
            <Field label="Tier">{TIER_LABEL[profile.tier]}</Field>
            <Field label="Life Remaining">{profile.life_number}</Field>
            <Field label="Enrolled">{formatDate(profile.created_at)}</Field>
            <Field label="Profile ID">{profile.id}</Field>
          </Section>

          <Section title="Verification & Moderation">
            <Field label="Minecraft Verified">
              {profile.mc_verified_at
                ? formatDate(profile.mc_verified_at)
                : "Not verified"}
            </Field>
            <Field label="Whitelist Agreement">
              {profile.agreed_at
                ? formatDate(profile.agreed_at)
                : "Not accepted"}
            </Field>
            <Field label="Whitelisted">
              {profile.whitelisted_at
                ? formatDate(profile.whitelisted_at)
                : "Not whitelisted"}
            </Field>
            <Field label="Red Strikes">{profile.red_strikes ?? 0}</Field>
            <Field label="Moderation Points">{profile.points ?? 0}</Field>
          </Section>
        </>
      ) : (
        <Section title="Player Profile">
          <Field label="Enrollment">Not enrolled this season</Field>
        </Section>
      )}
    </motion.div>
  );
}
