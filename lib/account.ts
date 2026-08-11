export const ACCOUNT_COOKIE = "sulfuria_account";
const ACCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type Account = {
  minecraftUsername: string;
  discordUsername: string;
};

export function setAccountCookie(account: Account) {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCOUNT_COOKIE}=${encodeURIComponent(
    JSON.stringify(account)
  )}; path=/; max-age=${ACCOUNT_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAccountCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCOUNT_COOKIE}=; path=/; max-age=0`;
}

export function parseAccountCookie(raw: string | undefined | null): Account | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (!parsed?.minecraftUsername) return null;

    return {
      minecraftUsername: String(parsed.minecraftUsername),
      discordUsername: String(parsed.discordUsername ?? ""),
    };
  } catch {
    return null;
  }
}

export function getAccountCookie(): Account | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ACCOUNT_COOKIE}=`));

  return parseAccountCookie(match?.slice(ACCOUNT_COOKIE.length + 1));
}

export const ENROLLED_DEVICE_COOKIE = "sulfuria_device_enrolled";
export const ENROLLED_DEVICE_STORAGE_KEY = "sulfuria_device_enrolled";
export const ENROLLED_DEVICE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

export function setEnrolledDeviceMarker() {
  if (typeof document === "undefined") return;
  document.cookie = `${ENROLLED_DEVICE_COOKIE}=1; path=/; max-age=${ENROLLED_DEVICE_COOKIE_MAX_AGE}; SameSite=Lax`;
  try {
    localStorage.setItem(ENROLLED_DEVICE_STORAGE_KEY, "true");
  } catch {
    // ignore quota or private browsing storage errors
  }
}

export function hasEnrolledDeviceMarker(): boolean {
  if (typeof document === "undefined") return false;

  const cookieMatch = document.cookie
    .split("; ")
    .some((row) => row.startsWith(`${ENROLLED_DEVICE_COOKIE}=`));

  if (cookieMatch) return true;

  try {
    return localStorage.getItem(ENROLLED_DEVICE_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

