import { getSupabaseServer } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getDiscordIdentity } from "@/lib/auth/discord";
import { lookupMinecraftProfile } from "@/lib/players/mojang";
import { MINECRAFT_USERNAME_PATTERN } from "@/lib/validation";
import { getActiveSeason } from "@/lib/seasons";

/**
 * Enrollment is Discord-gated: the survivor proves who they are through OAuth
 * and supplies only their Minecraft username. Everything else — Discord
 * identity and the Minecraft UUID behind that username — comes from a
 * verified source, so nothing on a profile can be typed in and faked.
 *
 * Identity (profiles) is permanent across seasons, but enrollment
 * (season_enrollments) is per-season, so this branches three ways:
 *   1. No identity yet — full flow: validate, Mojang lookup, insert both rows.
 *   2. Identity exists, no enrollment this season — insert season_enrollments
 *      only. Mojang isn't re-checked; the identity on file is authoritative.
 *      minecraftUsername in the body is accepted but unused in this branch.
 *   3. Already enrolled this season — 409, same as today.
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

  const activeSeason = await getActiveSeason();
  if (!activeSeason) {
    return Response.json(
      { error: "Enrollment isn't open right now." },
      { status: 503 }
    );
  }

  const admin = getSupabaseAdmin();

  const { data: existingProfile, error: lookupError } = await admin
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (lookupError) {
    console.error("Failed to look up profile during enrollment:", lookupError.message);
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  if (!existingProfile) {
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

    // Service role, so RLS can stay read-only for everyone: tier keeps its
    // default and is never accepted from the request body.
    const { error: insertProfileError } = await admin.from("profiles").insert({
      id: user.id,
      mc_user: mojangProfile.username,
      mc_uuid: mojangProfile.uuid,
      dc_nuid: discord.id,
      dc_user: discord.username,
      dc_avatar_url: discord.avatarUrl,
    });

    if (insertProfileError) {
      // 23505 covers four possible collisions; the message names the one hit.
      if (insertProfileError.code === "23505") {
        const alreadyEnrolled =
          insertProfileError.message.includes("profiles_pkey") ||
          insertProfileError.message.includes("dc_nuid");
        const mcAccountTaken = insertProfileError.message.includes("mc_uuid");

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

      console.error("Failed to enroll player:", insertProfileError.message);
      return Response.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    const { error: insertEnrollmentError } = await admin
      .from("season_enrollments")
      .insert({ season_id: activeSeason.id, profile_id: user.id });

    if (insertEnrollmentError) {
      // The identity row landed, but the season_enrollments insert failed.
      // No compensating delete needed — a retry falls into branch 2 below,
      // which completes the enrollment without re-running Mojang.
      console.error(
        "Failed to create season enrollment during signup:",
        insertEnrollmentError.message
      );
      return Response.json(
        { error: "Something went wrong. Try again." },
        { status: 500 }
      );
    }

    return Response.json({ success: true }, { status: 201 });
  }

  const { data: existingEnrollment, error: enrollmentLookupError } = await admin
    .from("season_enrollments")
    .select("id")
    .eq("profile_id", existingProfile.id)
    .eq("season_id", activeSeason.id)
    .maybeSingle();

  if (enrollmentLookupError) {
    console.error(
      "Failed to look up season enrollment:",
      enrollmentLookupError.message
    );
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  if (existingEnrollment) {
    return Response.json(
      { error: "This Discord account has already enrolled a survivor." },
      { status: 409 }
    );
  }

  const { error: insertEnrollmentError } = await admin
    .from("season_enrollments")
    .insert({ season_id: activeSeason.id, profile_id: existingProfile.id });

  if (insertEnrollmentError) {
    console.error(
      "Failed to enroll returning player in active season:",
      insertEnrollmentError.message
    );
    return Response.json(
      { error: "Something went wrong. Try again." },
      { status: 500 }
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
