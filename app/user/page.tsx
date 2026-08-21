import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { IdHeader } from "@/components/user/IdHeader";
import { IdCard } from "@/components/user/IdCard";
import { NoCredentialsNotice } from "@/components/user/NoCredentialsNotice";
import { McVerifyBanner } from "@/components/user/McVerifyBanner";
import { getCurrentProfile } from "@/lib/auth/profile";
import { markMinecraftVerified } from "@/lib/players";
import { sameMinecraftAccount, verifyMinecraftToken } from "@/lib/auth/mc-verify";

export const metadata: Metadata = {
  title: "RIFTSCAPE ID | Player Registry",
  description: "Your official RIFTSCAPE player identification card.",
};

/**
 * Resolves a `?token=` from the in-game verification command: proves the
 * player is logged into the Minecraft account behind the token's mc_uuid,
 * and — only if that matches the signed-in profile's own mc_uuid — marks the
 * profile verified. Never trusts the token's mc_uuid on its own; it only
 * ever confirms or rejects the account already on record.
 */
async function resolveMinecraftVerification(
  token: string
): Promise<"success" | "invalid" | "mismatch" | "no-profile"> {
  const profile = await getCurrentProfile();
  if (!profile) return "no-profile";

  const tokenMcUuid = await verifyMinecraftToken(token);
  if (!tokenMcUuid) return "invalid";

  if (!profile.mc_uuid || !sameMinecraftAccount(profile.mc_uuid, tokenMcUuid)) {
    return "mismatch";
  }

  await markMinecraftVerified(profile.id);
  return "success";
}

export default async function UserPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; mc_verify?: string }>;
}) {
  const { token, mc_verify } = await searchParams;

  if (token) {
    redirect(`/user?mc_verify=${await resolveMinecraftVerification(token)}`);
  }

  const profile = await getCurrentProfile();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <IdHeader profile={profile} />

        {mc_verify && <McVerifyBanner result={mc_verify} />}

        {profile ? <IdCard profile={profile} /> : <NoCredentialsNotice />}

        {profile && (
          <p className="mt-8 text-center font-mc-body text-[11px] text-foreground/35 max-w-xl mx-auto leading-relaxed">
            Issued by The RIFTSCAPE Network. Registry ID is derived from your
            permanent account record and cannot be reassigned.
          </p>
        )}
      </div>
    </main>
  );
}
