export interface WikiItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: "flower" | "leaf" | "potion" | "flask" | "skull";
  iconUrl?: string;
  rarity?: "Common" | "Rare" | "Epic" | "Legendary";
  roleOrType: string;
  stats: Record<string, string | number>;
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
    stats: {
      "Output Yield": "4x Buds",
      "Base Ingredient": "Lily of the Valley",
      "Used For": "Lily Bushel",
    },
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
    stats: {
      "Crafting Method": "2x Sugar Cane (Side-by-side)",
      "Primary Use": "Herbal Binding",
      Yield: "1x Fiber Set",
    },
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
    stats: {
      "Cures Status": "Infection",
      "Hunger Saver": "Stops Rapid Depletion",
      "Poison Block": "100% Prevention",
    },
    abilitiesOrEffects: [
      "Infection Cure: Instantly purges the Infection debuff on use.",
      "Hunger & Poison Prevention: Halts rapid hunger drain and prevents progression to fatal poison.",
    ],
    recipe: ["1x Lily Bud", "2x Sugar Cane Fibers"],
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
    stats: {
      "Hunger Drain": "Rapid / 5x Rate",
      Lethality: "High (Leads to Poison)",
      Remedy: "Lily Bushel",
    },
    abilitiesOrEffects: [
      "Phase 1 - Rapid Hunger Drain: Drains food levels rapidly until depleted.",
      "Phase 2 - Lethal Poisoning: Once food reaches zero, inflicts continuous poison damage.",
      "Remedy Cure: Consuming 1x Lily Bushel immediately cures Infection and resets hunger drain.",
    ],
    recipe: ["Cured by consuming: 1x Lily Bushel"],
  },
];
