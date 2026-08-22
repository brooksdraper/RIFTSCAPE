export interface WikiItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: "flower" | "leaf" | "potion" | "flask" | "skull";
  iconUrl?: string;
  rarity?: "Common" | "Rare" | "Epic" | "Legendary";
  roleOrType: string;
  abilitiesOrEffects: string[];
  recipe: string[];
}

export const WIKI_DATA: WikiItem[] = [
  {
    id: "lily-buds",
    name: "Lily Buds",
    tagline:
      "Essential herbal crafting component extracted from Lily of the Valley.",
    description:
      "Fresh herbal buds processed from Lily of the Valley flowers. Yields 4 Lily Buds when placed in a crafting grid, which are then combined with Sugar Cane Fibers to craft the Infection-curing Lily Bushel.",
    icon: "flower",
    iconUrl: "/img/lily_buds.png",
    rarity: "Common",
    roleOrType: "Crafting Ingredient",
    abilitiesOrEffects: [
      "Crafting Output: 1x Lily of the Valley in crafting grid yields 4x Lily Buds.",
      "Sugar Cane Fiber Note: Place 2x Sugar Cane side-by-side in crafting grid to craft Sugar Cane Fibers.",
    ],
    recipe: ["1x Lily of the Valley (Yields 4x Lily Buds)"],
  },
  {
    id: "sugar-cane-fibers",
    name: "Sugar Cane Fibers",
    tagline:
      "Refined plant fibers used as herbal binding for potions and remedies.",
    description:
      "Strong, fibrous strings extracted from fresh sugar cane stalks placed side by side in a crafting table. Essential for binding Lily Buds into a restorative Lily Bushel.",
    icon: "leaf",
    iconUrl: "/img/sugar_cane_fibers.png",
    rarity: "Common",
    roleOrType: "Crafting Ingredient",
    abilitiesOrEffects: [
      "Crafting Pattern: Place 2 Sugar Cane horizontally side-by-side in the crafting grid.",
      "Antidote Binding: Combines with 1x Lily Bud to create the Lily Bushel antidote.",
    ],
    recipe: ["2x Sugar Cane (Horizontal side-by-side in crafting table)"],
  },
  {
    id: "lily-bushel",
    name: "Lily Bushel",
    tagline:
      "Herbal antidote that completely cures the Infection status effect.",
    description:
      "A bound herbal bundle crafted from Lily Buds and Sugar Cane Fibers. Consuming this remedy immediately cures Infection, stopping rapid hunger depletion before it turns into deadly poisoning.",
    icon: "potion",
    iconUrl: "/img/lily_bushel.png",
    rarity: "Rare",
    roleOrType: "Consumable / Antidote",
    abilitiesOrEffects: [
      "Infection Cure: Instantly purges the Infection debuff on use.",
      "Hunger & Poison Prevention: Halts rapid hunger drain and prevents progression to fatal poison.",
    ],
    recipe: ["1x Lily Bud", "2x Sugar Cane Fibers"],
  },
  {
    id: "coin-silver",
    name: "Silver Coin",
    tagline: "Common currency scavenged from the fallen.",
    description:
      "A tarnished silver coin dropped by slain zombies. Traded and hoarded across the wasteland, and prized by tinkerers who know it can be reforged into something far more valuable.",
    icon: "flask",
    iconUrl: "/img/coin_silver.png",
    rarity: "Common",
    roleOrType: "Currency",
    abilitiesOrEffects: [
      "Zombie Drop: 1/6 chance to drop from a slain Zombie.",
      "Crafting Ingredient: Surround with Gold Nuggets in a crafting table to forge Gold Coins.",
    ],
    recipe: ["Dropped by: Zombie (1/6 chance)"],
  },
  {
    id: "coin-gold",
    name: "Gold Coin",
    tagline: "Rare coin forged by reworking silver with gold nuggets.",
    description:
      "A gleaming gold coin, minted by surrounding a Silver Coin with Gold Nuggets in a crafting table. Far scarcer than its silver counterpart and sought after for high-value trades.",
    icon: "flask",
    iconUrl: "/img/coin_gold.png",
    rarity: "Rare",
    roleOrType: "Currency",
    abilitiesOrEffects: [
      "Crafting Output: 1x Silver Coin surrounded by 8x Gold Nuggets yields 2x Gold Coins.",
    ],
    recipe: [
      "1x Silver Coin (center)",
      "8x Gold Nuggets (surrounding)",
      "Yields 2x Gold Coin",
    ],
  },
  {
    id: "infection-effect",
    name: "Infection Effect",
    tagline:
      "Hazardous affliction that rapidly drains hunger until poisoning occurs.",
    description:
      "A dangerous status condition contracted from environmental hazards or infected bites. Accelerates hunger depletion at extreme speeds, turning into deadly poison damage once hunger reaches zero.",
    icon: "skull",
    iconUrl: "/img/infection.png",
    rarity: "Epic",
    roleOrType: "Status Effect / Debuff",
    abilitiesOrEffects: [
      "Phase 1 - Rapid Hunger Drain: Drains food levels rapidly until depleted.",
      "Phase 2 - Lethal Poisoning: Once food reaches zero, inflicts continuous poison damage.",
      "Remedy Cure: Consuming 1x Lily Bushel immediately cures Infection and resets hunger drain.",
    ],
    recipe: ["Cured by consuming: 1x Lily Bushel"],
  },
];
