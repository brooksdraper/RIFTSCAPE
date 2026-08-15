import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getDiscordIdentity } from "@/lib/auth/discord";
import { lookupMinecraftProfile } from "@/lib/players/mojang";
import { MINECRAFT_USERNAME_PATTERN } from "@/lib/validation";

/**
 * Enrollment is Discord-gated: the survivor proves who they are through OAuth
 * and supplies only their Minecraft username. Everything else — Discord
 * identity and the Minecraft UUID behind that username — comes from a
 * verified source, so nothing on a profile can be typed in and faked.
 */
export async function POST(request: Request) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      { error: "Sign in with Discord before enrolling." },
      { status: 401 }
    );
  }

  const discord = getDiscordIdentity(user);
  if (!discord) {
    return Response.json(
      { error: "This account is not linked to Discord." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const minecraftUsername = String(body?.minecraftUsername ?? "").trim();

  if (!MINECRAFT_USERNAME_PATTERN.test(minecraftUsername)) {
    return Response.json(
      { error: "Enter a valid Minecraft username." },
      { status: 400 }
    );
  }

  let mojangProfile;
  try {
    mojangProfile = await lookupMinecraftProfile(minecraftUsername);
  } catch (err) {
    console.error("Mojang lookup failed during enrollment:", err);
    return Response.json(
      { error: "Could not reach Mojang to verify that username. Try again." },
      { status: 502 }
    );
  }

  if (!mojangProfile) {
    return Response.json(
      { error: "No Minecraft account exists with that username." },
      { status: 400 }
    );
  }

  // Service role, so RLS can stay read-only for everyone: tier and life_number
  // keep their defaults and are never accepted from the request body.
  const { error } = await getSupabaseAdmin().from("profiles").insert({
    id: user.id,
    mc_user: mojangProfile.username,
    mc_uuid: mojangProfile.uuid,
    dc_nuid: discord.id,
    dc_user: discord.username,
    dc_avatar_url: discord.avatarUrl,
  });

  if (error) {
    // 23505 covers four possible collisions; the message names the one hit.
    if (error.code === "23505") {
      const alreadyEnrolled =
        error.message.includes("profiles_pkey") ||
        error.message.includes("dc_nuid");
      const mcAccountTaken = error.message.includes("mc_uuid");

      return Response.json(
        {
          error: alreadyEnrolled
            ? "This Discord account has already enrolled a survivor."
            : mcAccountTaken
              ? "That Minecraft account is already enrolled under a different Discord account."
              : "That Minecraft username is already enrolled.",
        },
        { status: 409 }
      );
    }

    console.error("Failed to enroll player:", error.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
