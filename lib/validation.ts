export const MINECRAFT_USERNAME_PATTERN = /^[a-zA-Z0-9_]{2,32}$/;
export const DISCORD_USERNAME_PATTERN = /^[a-zA-Z0-9_.]{2,32}$/;

export function normalizeDiscordUsername(value: string) {
  return value.trim().replace(/^@/, "");
}
