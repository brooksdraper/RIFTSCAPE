import type { Metadata } from "next";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";
import { IdHeader } from "@/components/user/IdHeader";
import { IdCard } from "@/components/user/IdCard";
import { NoCredentialsNotice } from "@/components/user/NoCredentialsNotice";
import { getCurrentProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "RIFTSCAPE ID | Player Registry",
  description: "Your official RIFTSCAPE player identification card.",
};

export default async function UserPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <IdHeader />

        {/* IN DEV DISCLAIMER */}
        <div
          className="
        text-center py-4 bg-neutral-950/80 text-red-500 border-2 border-black pixel-corners pixel-slot max-w-md mx-auto my-10"
        >
          <p className="text-sm font-medium">
            *This feature is not ready for release and is currently in
            development. Some features may be missing or incomplete.
          </p>
        </div>

        {profile ? <IdCard profile={profile} /> : <NoCredentialsNotice />}

        {profile && (
          <p className="mt-8 text-center font-mono text-xs text-foreground/35 max-w-xl mx-auto leading-relaxed">
            Issued by The RIFTSCAPE Network. Registry ID is derived from your
            permanent account record and cannot be reassigned.
          </p>
        )}
      </div>
    </main>
  );
}
