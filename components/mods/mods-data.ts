export interface Modpack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  theme: "common" | "gold";
  popular?: boolean;
  fileSize: string;
  mods: string[];
  extras?: string[];
  downloadUrl: string;
  downloadLabel: string;
}

export const MC_VERSION = "Minecraft 26.2";
export const LOADER_VERSION = "Fabric Loader 0.19.3";

export const MODPACKS: Modpack[] = [
  {
    id: "basic",
    name: "Sulfuria Basic",
    tagline: "Everything required, nothing extra.",
    description:
      "The bare minimum to connect and survive on Sulfuria. No shaders, no polish — just the core mods the server enforces.",
    theme: "common",
    fileSize: "~180 MB",
    mods: [
      "Fabric API",
      "Fabric Language Kotlin",
      "Simple Voice Chat — Proximity Voice",
      "Tough As Nails — Temperature & Thirst",
      "RIFTSCAPE Core — Hordes, Factions & Combat",
      "Cloth Config API",
    ],
    downloadUrl: "#",
    downloadLabel: "Download Basic Pack",
  },
  {
    id: "pro",
    name: "Sulfuria Pro",
    tagline: "Basic, tuned and dressed up.",
    description:
      "Every required mod plus performance, quality-of-life, and a curated shader pack — so the hordes look as good as they hit.",
    theme: "gold",
    popular: true,
    fileSize: "~640 MB",
    mods: [
      "Fabric API",
      "Fabric Language Kotlin",
      "Simple Voice Chat — Proximity Voice",
      "Tough As Nails — Temperature & Thirst",
      "RIFTSCAPE Core — Hordes, Factions & Combat",
      "Cloth Config API",
    ],
    extras: [
      "Iris Shaders + Complementary Reimagined",
      "Sodium + Lithium (Performance Boosts)",
      "Xaero's Minimap & World Map",
      "Mouse Wheelie & Mouse Tweaks",
      "Chest Tracker",
      "Bad Optimizations",
      "AppleSkin",
    ],
    downloadUrl: "#",
    downloadLabel: "Download Pro Pack",
  },
];
