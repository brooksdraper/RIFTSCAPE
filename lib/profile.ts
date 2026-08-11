import { cookies } from "next/headers";
import { ACCOUNT_COOKIE, parseAccountCookie } from "@/lib/account";
import { getProfileByMinecraftUsername, type EnrolledPlayer } from "@/lib/players";

export async function getCurrentProfile(): Promise<EnrolledPlayer | null> {
  const cookieStore = await cookies();
  const account = parseAccountCookie(cookieStore.get(ACCOUNT_COOKIE)?.value);
  if (!account) return null;

  return getProfileByMinecraftUsername(account.minecraftUsername);
}
