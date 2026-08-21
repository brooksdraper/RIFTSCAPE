import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { FactionsHeader } from "@/components/factions/PFactionsHeader";
import { SignInGate } from "@/components/auth/SignInGate";
import { NoCredentialsNotice } from "@/components/user/NoCredentialsNotice";
import {
  FactionEnrollment,
  type FactionWithMembers,
} from "@/components/factions/PFactionEnrollment";
import { getCurrentUser } from "@/lib/auth/profile";
import { getProfileByUserId, getProfilesByIds } from "@/lib/players";
import {
  getAllFactions,
  getFactionByMemberId,
  getFactionByOwnerId,
} from "@/lib/factions";

export const metadata: Metadata = {
  title: "Preregister for Factions | RIFTSCAPE",
  description: "Sign in to preregister for the next RIFTSCAPE factions run.",
};

export default async function PreregisterFactionsPage() {
  const user = await getCurrentUser();
  const profile = user ? await getProfileByUserId(user.id) : null;

  const [ownedFaction, memberFaction, allFactions] = profile
    ? await Promise.all([
        getFactionByOwnerId(profile.id),
        getFactionByMemberId(profile.id),
        getAllFactions(),
      ])
    : [null, null, await getAllFactions()];

  const memberIds = [...new Set(allFactions.flatMap((f) => f.members))];
  const memberProfiles = await getProfilesByIds(memberIds);
  const memberProfileById = new Map(memberProfiles.map((p) => [p.id, p]));

  const rosters: FactionWithMembers[] = allFactions.map((faction) => ({
    ...faction,
    memberProfiles: faction.members
      .map((id) => memberProfileById.get(id))
      .filter((p): p is { id: string; mc_user: string } => p !== undefined),
  }));

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />
      <div className="relative z-10 container mx-auto px-6 pt-12">
        <FactionsHeader />

        {!user ? (
          <SignInGate description="Sign in with Discord to preregister for factions." />
        ) : !profile ? (
          <NoCredentialsNotice />
        ) : (
          <FactionEnrollment
            mcUsername={profile.mc_user}
            mcUuid={profile.mc_uuid ?? ""}
            ownedFaction={ownedFaction}
            factions={rosters}
            viewerProfile={{ id: profile.id, mc_user: profile.mc_user }}
            initialViewerFactionId={
              ownedFaction?.id ?? memberFaction?.id ?? null
            }
          />
        )}
      </div>
    </main>
  );
}
