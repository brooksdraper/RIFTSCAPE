export type StoreTheme = "yellow" | "red" | "magenta";

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
  grantsTier?: "supporter" | "sponsor";
  maxLifeNumber?: number;
}

export const storeItems: StoreItem[] = [
  {
    id: "supporter",
    name: "Supporter Tag",
    image: "/img/supporter_tag.png",
    theme: "yellow",
    price: "$7.99",
    priceCents: 799,
    description:
      "Show your support for Sulfuria. Grants a yellow shield chat tag and silver class queueing.",
    features: [
      "Yellow Supporter Shield Tag",
      "Silver Class Queueing",
      "Discord Role",
    ],
    popular: false,
    grantsTier: "supporter",
  },
  {
    id: "sponsor",
    name: "Sponsor Tag",
    image: "/img/sponsor_tag.png",
    theme: "red",
    price: "$19.99",
    priceCents: 1999,
    description:
      "The ultimate flex. Grants a red shield chat tag, gold class queueing, and a bold name in chat.",
    features: [
      "Red Sponsor Shield Tag",
      "Gold Class Queueing",
      "Bold Name Format",
      "Discord Role",
    ],
    bonus: { amount: "1", icon: "/img/extra_life.png", alt: "Extra Life" },
    popular: true,
    grantsTier: "sponsor",
  },
  {
    id: "extra-life",
    name: "Extra Life",
    image: "/img/extra_life.png",
    theme: "magenta",
    price: "$12.99",
    priceCents: 1299,
    description:
      "Cheated death? Buy a second chance. Single-use item that revives you if you fall during the 60 days.",
    features: ["Single-Use Revive", "Max 2 Per Season", "Cannot Be Gifted"],
    popular: false,
    giftable: false,
    maxLifeNumber: 3,
  },
];

export function getStoreItemById(id: string): StoreItem | undefined {
  return storeItems.find((item) => item.id === id);
}
