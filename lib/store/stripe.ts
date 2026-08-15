import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY.");
  }

  client = new Stripe(stripeSecretKey);
  return client;
}
