import type { EnrolledPlayer } from "@/lib/players";

export type StoreTheme = "green" | "blue" | "yellow" | "red" | "magenta";

export const StoreOpen = false; // Set to true when the store is open for purchases

export interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: string;
  priceCents: number;
  description: string;
  features: string[];
  popular?: boolean;
  theme: StoreTheme;
  bonus?: { amount: string; icon: string; alt: string };
  giftable?: boolean;
  grantsTier?: "voyager" | "weaver" | "sentinel" | "archon";
  maxLifeNumber?: number;
}

export const storeItems: StoreItem[] = [
  {
    id: "voyager",
    name: "Voyager Tag",
    image: "/img/tag_voyager.png",
    theme: "blue",
    price: "$9.99",
    priceCents: 999,
    description:
      "Begin your dimensional journey. Grants a blue shield chat tag and bronze tier queueing.",
    features: [
      "Blue Voyager Shield Tag",
      //"Bronze Class Queueing",
      "Discord Role",
    ],
    popular: false,
    grantsTier: "voyager",
  },
  {
    id: "weaver",
    name: "Weaver Tag",
    image: "/img/tag_weaver.png",
    theme: "green",
    price: "$19.99",
    priceCents: 1999,
    description:
      "Manipulate the fabric of the map. Grants a green shield chat tag and silver tier queueing.",
    features: [
      "Green Weaver Shield Tag",
      //"Silver Class Queueing",
      "Discord Role",
    ],
    popular: true,
    grantsTier: "weaver",
  },
  {
    id: "sentinel",
    name: "Sentinel Tag",
    image: "/img/tag_sentinel.png",
    theme: "yellow",
    price: "$34.99",
    priceCents: 3499,
    description:
      "Guard the realm against all threats. Grants a yellow shield chat tag and gold tier queueing.",
    features: [
      "Yellow Sentinel Shield Tag",
      //"Gold Class Queueing",
      "Discord Role",
    ],
    popular: false,
    grantsTier: "sentinel",
  },
  {
    id: "archon",
    name: "Archon Tag",
    image: "/img/tag_archon.png",
    theme: "red",
    price: "$54.99",
    priceCents: 5499,
    description:
      "Achieve supreme cosmic authority. Grants a red shield chat tag, diamond tier queueing, and a bold name in chat.",
    features: [
      "Red Archon Shield Tag",
      //"Diamond Class Queueing",
      "Bold Name Format",
      "Discord Role",
    ],
    bonus: { amount: "1", icon: "/img/extra_life.png", alt: "Extra Life" },
    popular: false,
    grantsTier: "archon",
  },
  {
    id: "extra-life",
    name: "Extra Life",
    image: "/img/extra_life.png",
    theme: "magenta",
    price: "$12.99",
    priceCents: 1299,
    description:
      "Cheated death? Buy a second chance. Grants a second bank of ten hearts once Life Drain empties your first ten.",
    features: ["Grants 10 Hearts", "Max 1 Per Season", "Cannot Be Gifted"],
    popular: false,
    giftable: false,
    maxLifeNumber: 1,
  },
];

export function getStoreItemById(id: string): StoreItem | undefined {
  return storeItems.find((item) => item.id === id);
}

/**
 * Delta price for upgrading into `item`'s rank from whatever rank the buyer
 * already holds: the target's price minus the price of the rank tag they're
 * standing on. Full price when they don't currently hold a lower rank in
 * this ladder (no tier yet, or already at/above `item`'s rank — gifting a
 * rank you already own to someone else is a full-price purchase, not an
 * upgrade).
 */
export function getUpgradePriceCents(
  item: StoreItem,
  currentTier: EnrolledPlayer["tier"] | null,
): number {
  if (!item.grantsTier || !currentTier) return item.priceCents;

  const ownedItem = storeItems.find((i) => i.grantsTier === currentTier);
  if (!ownedItem || ownedItem.priceCents >= item.priceCents) {
    return item.priceCents;
  }

  return item.priceCents - ownedItem.priceCents;
}

export function formatPriceCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
