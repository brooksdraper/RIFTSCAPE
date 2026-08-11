import { getProfileByCredentials } from "@/lib/players";
import {
  DISCORD_USERNAME_PATTERN,
  MINECRAFT_USERNAME_PATTERN,
  normalizeDiscordUsername,
} from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const minecraftUsername = String(body?.minecraftUsername ?? "").trim();
  const discordUsername = normalizeDiscordUsername(
    String(body?.discordUsername ?? "")
  );

  if (!MINECRAFT_USERNAME_PATTERN.test(minecraftUsername)) {
    return Response.json(
      { error: "Enter a valid Minecraft username." },
      { status: 400 }
    );
  }

  if (!DISCORD_USERNAME_PATTERN.test(discordUsername)) {
    return Response.json(
      { error: "Enter a valid Discord username." },
      { status: 400 }
    );
  }

  const profile = await getProfileByCredentials(
    minecraftUsername,
    discordUsername
  );

  if (!profile) {
    return Response.json(
      { error: "No enrolled account matches those usernames." },
      { status: 404 }
    );
  }

  return Response.json(
    {
      minecraftUsername: profile.minecraft_username,
      discordUsername,
    },
    { status: 200 }
  );
}
