import { getCurrentUser, isAdminUser } from "@/lib/auth/profile";
import { deletePlayerAccountAdmin, getProfilesByIdsAdmin } from "@/lib/players";
import { unwhitelistPlayer } from "@/lib/server-status";

/**
 * Permanently deletes a survivor's identity — cascades to every season's
 * enrollment and every faction they own, across every season. A real
 * account-removal request, separate from `DELETE /api/admin/players/[id]`,
 * which only removes them from the current season.
 *
 * Also unwhitelists them in-game (DL-4), same rationale as the season-only
 * removal route: best-effort, looked up before the row is gone, logged
 * rather than returned on failure.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user)) {
    return Response.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;

  const [player] = await getProfilesByIdsAdmin([id]);

  const removed = await deletePlayerAccountAdmin(id);
  if (!removed) {
    return Response.json(
      { error: "Failed to delete this account. Try again." },
      { status: 500 }
    );
  }

  if (player?.mc_uuid) {
    const unwhitelisted = await unwhitelistPlayer(player.mc_uuid);
    if (!unwhitelisted) {
      console.error(
        `Deleted profile ${id} but failed to unwhitelist ${player.mc_uuid}.`
      );
    }
  }

  return Response.json({ success: true }, { status: 200 });
}
