"use client";

import { AnimatePresence } from "motion/react";
import { ProfileBanner } from "./ProfileBanner";
import { AccountLoginPill } from "./AccountLoginPill";
import type { EnrolledPlayer } from "@/lib/players";

export function AccountPillSwitcher({ profile }: { profile: EnrolledPlayer | null }) {
  return (
    <AnimatePresence mode="wait">
      {profile ? (
        <ProfileBanner key="profile" profile={profile} />
      ) : (
        <AccountLoginPill key="login" />
      )}
    </AnimatePresence>
  );
}
