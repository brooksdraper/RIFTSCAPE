import { getStripe } from "@/lib/store/stripe";
import { getStoreItemById } from "@/lib/store/store-items";
import { getProfileByMinecraftUsername, TIER_RANK } from "@/lib/players";
import { getCurrentProfile } from "@/lib/auth/profile";
import { MINECRAFT_USERNAME_PATTERN } from "@/lib/validation";

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

  // Buying for yourself needs no input at all — the session says who you are.
  // Only a gift has a recipient to name.
  let recipient = buyer;

  if (isGift) {
    const recipientUsername = String(body?.minecraftUsername ?? "").trim();

    if (!MINECRAFT_USERNAME_PATTERN.test(recipientUsername)) {
      return Response.json(
        { error: "Enter a valid Minecraft username." },
        { status: 400 }
      );
    }

    const giftee = await getProfileByMinecraftUsername(recipientUsername);
    if (!giftee) {
      return Response.json(
        { error: "No enrolled account matches that Minecraft username." },
        { status: 404 }
      );
    }

    recipient = giftee;
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

  // Prefer the canonical site URL over the request's own origin, which can
  // resolve to an internal/proxy hostname behind Vercel's edge network.
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: item.priceCents,
          product_data: {
            name: item.name,
            description: `For ${recipient.mc_user}`,
            tax_code: "txcd_10201000",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      itemId: item.id,
      buyerMinecraftUsername: buyer.mc_user,
      recipientMinecraftUsername: recipient.mc_user,
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
