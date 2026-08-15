import type { EnrolledPlayer } from "@/lib/players";

/**
 * The Supporter Store catalog — every cosmetic bundled with the tags sold on
 * `/store`. Nothing here is bought individually: an entry unlocks the moment
 * the viewer's tag reaches its `tier`, which is why each item carries a tier
 * rather than a price.
 *
 * The bottom rung is the exception. `survivor`-tier entries aren't bought at
 * all — the server promotes an account from `member` to `survivor` after
 * `SURVIVOR_HOURS_REQUIRED` hours of online play. Everything above it is
 * bought on /store.
 */
export type SupporterTier = EnrolledPlayer["tier"];

/** Hours of online play the server requires before granting the Survivor tag. */
export const SURVIVOR_HOURS_REQUIRED = 20;

export interface SupporterItem {
  id: string;
  name: string;
  /** Italic sub-label under the name — the wiki cards' `roleOrType` slot. */
  kind: string;
  description: string;
  tier: SupporterTier;
  /** In-game command, shown as an inventory chip. */
  command?: string;
  /** Unicode stand-in painted in the tier color inside the icon slot. */
  glyph?: string;
  /** Real Minecraft asset — takes precedence over `glyph`. */
  image?: string;
  /** Chat-color preview; any CSS color or gradient. */
  swatch?: string;
  /** The single glinting entry on the page. Never set this on two items. */
  featured?: boolean;
}

export interface SupporterCategory {
  id: string;
  title: string;
  subtitle: string;
  items: SupporterItem[];
}

/** Ordering for gate checks. Mirrors `TIER_RANK` in `lib/players`, but kept
 *  local so client bundles don't pull the Supabase client along with it. */
export const SUPPORTER_TIER_ORDER: Record<SupporterTier, number> = {
  member: 0,
  survivor: 1,
  supporter: 2,
  sponsor: 3,
};

export const TIER_META: Record<
  SupporterTier,
  {
    label: string;
    text: string;
    border: string;
    badge: string;
    /** What the locked card says you need. */
    gate: string;
  }
> = {
  member: {
    label: "Member",
    text: "var(--mc-common)",
    border: "#3f3f3f",
    badge: "Member",
    gate: "Enrollment",
  },
  survivor: {
    label: "Survivor",
    text: "var(--mc-common)",
    border: "#3f3f3f",
    badge: "Survivor",
    gate: `${SURVIVOR_HOURS_REQUIRED}h Online`,
  },
  supporter: {
    label: "Supporter",
    text: "var(--mc-rare)",
    border: "#8a8a2a",
    badge: "Supporter",
    gate: "Supporter Tag",
  },
  sponsor: {
    label: "Sponsor",
    text: "var(--mc-danger)",
    border: "#8a2a2a",
    badge: "Sponsor",
    gate: "Sponsor Tag",
  },
};

export const supporterCategories: SupporterCategory[] = [
  {
    id: "chat-icons",
    title: "Chat Icons",
    subtitle:
      "The sprite that sits in front of your name in chat. One equipped at a time.",
    items: [
      {
        id: "icon-pickaxe",
        name: "Pickaxe",
        kind: "Chat Icon",
        description:
          "The veteran's marker. Earned once you've put 20 hours into the season.",
        tier: "survivor",
        glyph: "⛏",
        command: "/icon pickaxe",
      },
      {
        id: "icon-sprout",
        name: "Meadow Sprout",
        kind: "Chat Icon",
        description:
          "A sulfuric bloom from the meadow biome. Earned, not bought.",
        tier: "survivor",
        glyph: "❀",
        command: "/icon sprout",
      },
      {
        id: "icon-heart",
        name: "Heart",
        kind: "Chat Icon",
        description:
          "Wear your remaining lives on your sleeve. Turns gray on your last one.",
        tier: "supporter",
        glyph: "❤",
        command: "/icon heart",
      },
      {
        id: "icon-star",
        name: "Star",
        kind: "Chat Icon",
        description: "A clean four-point star. Quiet flex, no animation.",
        tier: "supporter",
        glyph: "✦",
        command: "/icon star",
      },
      {
        id: "icon-skull",
        name: "Infected Skull",
        kind: "Chat Icon",
        description:
          "Marks you as a veteran of the outbreak. Pairs with the infection wiki set.",
        tier: "supporter",
        glyph: "☠",
        command: "/icon skull",
      },
      {
        id: "icon-supporter-shield",
        name: "Supporter Shield",
        kind: "Tag Icon",
        description:
          "The yellow shield tag granted by the Supporter Tag. Applied automatically on purchase.",
        tier: "supporter",
        image: "/img/supporter_tag.png",
        command: "/icon supporter",
      },
      {
        id: "icon-sponsor-shield",
        name: "Sponsor Shield",
        kind: "Tag Icon",
        description:
          "The red shield tag granted by the Sponsor Tag. Outranks and replaces the yellow shield.",
        tier: "sponsor",
        image: "/img/sponsor_tag.png",
        command: "/icon sponsor",
      },
      {
        id: "icon-crown",
        name: "Crown",
        kind: "Chat Icon",
        description:
          "Sponsor-exclusive. Renders in gold regardless of the chat color you equip.",
        tier: "sponsor",
        glyph: "♛",
        command: "/icon crown",
      },
      {
        id: "icon-flame",
        name: "Sulfur Flame",
        kind: "Chat Icon",
        description:
          "Sponsor-exclusive. The only icon with a two-frame flicker in chat.",
        tier: "sponsor",
        glyph: "✹",
        command: "/icon flame",
      },
    ],
  },
  {
    id: "chat-colors",
    title: "Chat Colors",
    subtitle:
      "Recolor the text of every message you send. Vanilla color codes, no custom hex.",
    items: [
      {
        id: "color-gray",
        name: "Stone Gray",
        kind: "Chat Color",
        description:
          "The first recolor a survivor earns. Muted enough to read on any background.",
        tier: "survivor",
        swatch: "#b0b0b0",
        command: "/chatcolor gray",
      },
      {
        id: "color-white",
        name: "Bone White",
        kind: "Chat Color",
        description: "Maximum contrast against the night-time HUD.",
        tier: "survivor",
        swatch: "#ffffff",
        command: "/chatcolor white",
      },
      {
        id: "color-yellow",
        name: "Yellow",
        kind: "Chat Color",
        description:
          "Matches the Supporter shield. The tier's signature color in chat.",
        tier: "supporter",
        swatch: "#ffff55",
        command: "/chatcolor yellow",
      },
      {
        id: "color-aqua",
        name: "Aqua",
        kind: "Chat Color",
        description: "Cold blue, readable underwater and in the swamp fog.",
        tier: "supporter",
        swatch: "#55ffff",
        command: "/chatcolor aqua",
      },
      {
        id: "color-light-purple",
        name: "Light Purple",
        kind: "Chat Color",
        description: "Amethyst tone borrowed from the Extra Life item.",
        tier: "supporter",
        swatch: "#e070ff",
        command: "/chatcolor lightpurple",
      },
      {
        id: "color-gold",
        name: "Gold",
        kind: "Chat Color",
        description:
          "The vanilla XP gold. Reads as staff-adjacent — use sparingly.",
        tier: "supporter",
        swatch: "#ffaa00",
        command: "/chatcolor gold",
      },
      {
        id: "color-red",
        name: "Redstone",
        kind: "Chat Color",
        description:
          "Sponsor-exclusive. Shares the alert red, so it cuts through a busy chat.",
        tier: "sponsor",
        swatch: "#ff5555",
        command: "/chatcolor red",
      },
      {
        id: "color-gradient",
        name: "Rift Gradient",
        kind: "Animated Chat Color",
        description:
          "Sponsor-exclusive. Your message fades across the rarity ramp, one character at a time.",
        tier: "sponsor",
        swatch:
          "linear-gradient(135deg, #ff5555 0%, #ffaa00 40%, #ffff55 70%, #e070ff 100%)",
        command: "/chatcolor gradient",
        featured: true,
      },
    ],
  },
  {
    id: "emotes",
    title: "Emotes & Commands",
    subtitle:
      "Cosmetic commands. None of them affect combat, loot, or the 100-day timer.",
    items: [
      {
        id: "cmd-wave",
        name: "Wave",
        kind: "Emote",
        description:
          "Basic greeting emote. The first command the Survivor set hands you.",
        tier: "survivor",
        glyph: "✋",
        command: "/wave",
      },
      {
        id: "cmd-sit",
        name: "Sit",
        kind: "Emote",
        description: "Sit on any block, stair, or slab you're standing on.",
        tier: "supporter",
        glyph: "🪑",
        command: "/sit",
      },
      {
        id: "cmd-lay",
        name: "Lay",
        kind: "Emote",
        description: "Lie down without a bed. Does not skip the night.",
        tier: "supporter",
        glyph: "🛏",
        command: "/lay",
      },
      {
        id: "cmd-spin",
        name: "Spin",
        kind: "Emote",
        description: "Rotate in place. Cancels the moment you move.",
        tier: "supporter",
        glyph: "🌀",
        command: "/spin",
      },
      {
        id: "cmd-hat",
        name: "Hat",
        kind: "Emote",
        description:
          "Wear your held item on your head. Purely visual — no armor value.",
        tier: "supporter",
        glyph: "🎩",
        command: "/hat",
      },
      {
        id: "cmd-nick",
        name: "Nickname",
        kind: "Command",
        description:
          "Sponsor-exclusive. Set a colored display name. Your real username stays visible on the tab list.",
        tier: "sponsor",
        glyph: "✎",
        command: "/nick <name>",
      },
      {
        id: "cmd-firework",
        name: "Firework",
        kind: "Command",
        description:
          "Sponsor-exclusive. Launch a cosmetic firework. Deals no damage, on a 60s cooldown.",
        tier: "sponsor",
        glyph: "✷",
        command: "/firework",
      },
    ],
  },
  {
    id: "rank-perks",
    title: "Rank Perks",
    subtitle:
      "The non-cosmetic half of each tag. Applied automatically once your purchase syncs.",
    items: [
      {
        id: "perk-discord-role",
        name: "Discord Role",
        kind: "Rank Perk",
        description:
          "A colored role in the Sulfuria Discord plus access to the supporter channels.",
        tier: "supporter",
        glyph: "◈",
      },
      {
        id: "perk-silver-queue",
        name: "Silver Class Queueing",
        kind: "Rank Perk",
        description:
          "Skip ahead of members in the join queue when the server hits capacity.",
        tier: "supporter",
        glyph: "❖",
      },
      {
        id: "perk-gold-queue",
        name: "Gold Class Queueing",
        kind: "Rank Perk",
        description:
          "Top of the join queue — ahead of silver class and everyone below it.",
        tier: "sponsor",
        glyph: "❖",
      },
      {
        id: "perk-bold-name",
        name: "Bold Name Format",
        kind: "Rank Perk",
        description:
          "Sponsor-exclusive. Your username renders bold in chat, on signs, and in death messages.",
        tier: "sponsor",
        glyph: "B",
      },
      {
        id: "perk-extra-life",
        name: "Bundled Extra Life",
        kind: "Consumable",
        description:
          "The Sponsor Tag ships with one Extra Life. Counts toward the two-per-season cap.",
        tier: "sponsor",
        image: "/img/extra_life.png",
      },
    ],
  },
];

export const supporterItems: SupporterItem[] = supporterCategories.flatMap(
  (category) => category.items,
);

/**
 * What the page knows about the person looking at it.
 *
 * Unlocks run off `tier` alone — the account's tag is the record of what it
 * has earned or bought. `playtimeHours` is framework for the Survivor gate:
 * it drives the "how close am I" readout, not the unlock itself, and nothing
 * feeds it yet, so it arrives as `null`. Once online time is tracked, pass it
 * here and the progress chip starts counting; no other call site changes.
 */
export interface SupporterViewer {
  tier: SupporterTier | null;
  playtimeHours: number | null;
}

export function meetsSurvivorGate(playtimeHours: number | null): boolean {
  if (playtimeHours === null) return false;
  return playtimeHours >= SURVIVOR_HOURS_REQUIRED;
}

export function isUnlocked(
  item: SupporterItem,
  viewer: SupporterViewer,
): boolean {
  if (viewer.tier === null) return false;
  return SUPPORTER_TIER_ORDER[viewer.tier] >= SUPPORTER_TIER_ORDER[item.tier];
}

export function countUnlocked(viewer: SupporterViewer): number {
  return supporterItems.filter((item) => isUnlocked(item, viewer)).length;
}
