"use client";

import { AnimatePresence } from "motion/react";
import { ProfileBanner } from "./ProfileBanner";
import { AccountLoginPill } from "./AccountLoginPill";
import { EnrollPromptPill } from "./EnrollPromptPill";
import type { Viewer } from "@/lib/auth/profile";

/**
 * Three states now that Discord is the identity: signed out, signed in but not
 * enrolled, and enrolled.
 */
export function AccountPillSwitcher({ viewer }: { viewer: Viewer }) {
  const { discord, profile } = viewer;

  return (
    <AnimatePresence mode="wait">
      {profile ? (
        <ProfileBanner key="profile" profile={profile} />
      ) : discord ? (
        <EnrollPromptPill key="enroll" discord={discord} />
      ) : (
        <AccountLoginPill key="login" />
      )}
    </AnimatePresence>
  );
}
