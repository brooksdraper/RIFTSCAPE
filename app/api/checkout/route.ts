import { getStripe } from "@/lib/stripe";
import { getStoreItemById } from "@/lib/store-items";
import {
  getProfileByCredentials,
  getProfileByMinecraftUsername,
  TIER_RANK,
} from "@/lib/players";
import { getCurrentProfile } from "@/lib/profile";
import {
  DISCORD_USERNAME_PATTERN,
  MINECRAFT_USERNAME_PATTERN,
  normalizeDiscordUsername,
} from "@/lib/validation";

export async function POST(request: Request) {
  const buyer = await getCurrentProfile();
  if (!buyer) {
    return Response.json(
      { error: "Sign in before purchasing." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const itemId = String(body?.itemId ?? "");
  const recipientUsername = String(body?.minecraftUsername ?? "").trim();
  const recipientDiscord = normalizeDiscordUsername(
    String(body?.discordUsername ?? "")
  );
  const isGift = Boolean(body?.isGift);

  const item = getStoreItemById(itemId);
  if (!item) {
    return Response.json({ error: "Item not found." }, { status: 404 });
  }

  if (isGift && item.giftable === false) {
    return Response.json(
      { error: "This item cannot be gifted." },
      { status: 400 }
    );
  }

  if (!MINECRAFT_USERNAME_PATTERN.test(recipientUsername)) {
    return Response.json(
      { error: "Enter a valid Minecraft username." },
      { status: 400 }
    );
  }

  if (!DISCORD_USERNAME_PATTERN.test(recipientDiscord)) {
    return Response.json(
      { error: "Enter a valid Discord username." },
      { status: 400 }
    );
  }

  const recipient = isGift
    ? await getProfileByMinecraftUsername(recipientUsername)
    : await getProfileByCredentials(recipientUsername, recipientDiscord);
  if (!recipient) {
    return Response.json(
      {
        error: isGift
          ? "No enrolled account matches that Minecraft username."
          : "No enrolled account matches that Minecraft and Discord username.",
      },
      { status: 404 }
    );
  }

  const isSelfPurchase = recipient.id === buyer.id;

  if (
    isSelfPurchase &&
    item.grantsTier &&
    TIER_RANK[buyer.tier] >= TIER_RANK[item.grantsTier]
  ) {
    return Response.json(
      { error: `You already own the ${item.name}.` },
      { status: 400 }
    );
  }

  if (
    item.maxLifeNumber !== undefined &&
    recipient.life_number >= item.maxLifeNumber
  ) {
    return Response.json(
      { error: "You've already reached the max lives for this season." },
      { status: 400 }
    );
  }

  const origin = new URL(request.url).origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: item.priceCents,
          product_data: {
            name: item.name,
            description: `For ${recipient.minecraft_username}`,
            tax_code: "txcd_10201000",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      itemId: item.id,
      buyerMinecraftUsername: buyer.minecraft_username,
      recipientMinecraftUsername: recipient.minecraft_username,
    },
    success_url: `${origin}/store?purchase=success`,
    cancel_url: `${origin}/store?purchase=canceled`,
  });

  if (!session.url) {
    return Response.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }

  return Response.json({ url: session.url }, { status: 200 });
}
