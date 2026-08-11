import { cookies } from "next/headers";
import {
  ENROLLED_DEVICE_COOKIE,
  ENROLLED_DEVICE_COOKIE_MAX_AGE,
} from "@/lib/account";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  DISCORD_USERNAME_PATTERN,
  MINECRAFT_USERNAME_PATTERN,
  normalizeDiscordUsername,
} from "@/lib/validation";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (cookieStore.get(ENROLLED_DEVICE_COOKIE)?.value) {
    return Response.json(
      { error: "An account has already been enrolled from this device." },
      { status: 429 }
    );
  }

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

  const { error } = await supabaseAdmin.from("profiles").insert({
    minecraft_username: minecraftUsername,
    discord_username: discordUsername,
  });

  if (error) {
    if (error.code === "23505") {
      return Response.json(
        { error: "That Minecraft username is already enrolled." },
        { status: 409 }
      );
    }
    console.error("Failed to enroll player:", error.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  cookieStore.set(ENROLLED_DEVICE_COOKIE, "1", {
    path: "/",
    maxAge: ENROLLED_DEVICE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  return Response.json({ success: true }, { status: 201 });
}

