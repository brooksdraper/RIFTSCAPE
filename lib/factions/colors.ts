/**
 * The 16 vanilla dye colors a banner's base can be. Hex values match the
 * accepted community reference for Minecraft's dye/wool palette, not an
 * arbitrary color picker — a faction's base color is always one of these.
 */
export const FACTION_BASE_COLORS = [
  { id: "white", label: "White", hex: "#F9FFFE" },
  { id: "light_gray", label: "Light Gray", hex: "#9D9D97" },
  { id: "gray", label: "Gray", hex: "#474F52" },
  { id: "black", label: "Black", hex: "#1D1D21" },
  { id: "brown", label: "Brown", hex: "#835432" },
  { id: "red", label: "Red", hex: "#B02E26" },
  { id: "orange", label: "Orange", hex: "#F9801D" },
  { id: "yellow", label: "Yellow", hex: "#FED83D" },
  { id: "lime", label: "Lime", hex: "#80C71F" },
  { id: "green", label: "Green", hex: "#5E7C16" },
  { id: "cyan", label: "Cyan", hex: "#169C9C" },
  { id: "light_blue", label: "Light Blue", hex: "#3AB3DA" },
  { id: "blue", label: "Blue", hex: "#3C44AA" },
  { id: "purple", label: "Purple", hex: "#8932B8" },
  { id: "magenta", label: "Magenta", hex: "#C74EBD" },
  { id: "pink", label: "Pink", hex: "#F38BAA" },
] as const;

export type FactionBaseColor = (typeof FACTION_BASE_COLORS)[number]["id"];

const COLOR_IDS = new Set<string>(FACTION_BASE_COLORS.map((c) => c.id));

export function isFactionBaseColor(value: string): value is FactionBaseColor {
  return COLOR_IDS.has(value);
}

export function getFactionBaseColor(id: FactionBaseColor) {
  return FACTION_BASE_COLORS.find((c) => c.id === id)!;
}

/** Lightens a `#rrggbb` hex color by adding `amount` to each channel. */
export function lightenHex(hex: string, amount: number): string {
  const channel = (offset: number) =>
    Math.min(255, parseInt(hex.slice(offset, offset + 2), 16) + amount)
      .toString(16)
      .padStart(2, "0");

  return `#${channel(1)}${channel(3)}${channel(5)}`;
}
