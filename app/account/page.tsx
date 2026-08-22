import Link from "next/link";
import { getCurrentUser, getViewer } from "@/lib/auth/profile";
import { SignInGate } from "@/components/auth/SignInGate";
import { AccountHeader } from "@/components/account/AccountHeader";
import { AccountDetailsForm } from "@/components/account/AccountDetailsForm";
import { DeleteAccountButton } from "@/components/account/DeleteAccountButton";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <SignInGate
          title="Sign In Required"
          description="Sign in with Discord to view your account."
        />
      </div>
    );
  }

  const { discord, profile } = await getViewer();

  return (
    <div className="container mx-auto px-4 py-8">
      <AccountHeader />
      <AccountDetailsForm user={user} discord={discord} profile={profile} />
      <div className="mt-6 max-w-lg mx-auto text-center">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
