export interface Modpack {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  theme: "common" | "cyan";
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
    icon: "Sulfuria_Basic.png",
    tagline: "Everything required, nothing extra.",
    description:
      "The bare minimum to connect and survive on Sulfuria. No shaders, no polish — just the core mods the server enforces.",
    theme: "common",
    fileSize: "21.8 KB",
    mods: [
      "Fabric API",
      "GlitchCore API",
      "Better Combat — Combat Tweaks",
      "RIFTSCAPE Client — Server Resources",
      "Simple Voice Chat — Proximity Voice",
      "Tough As Nails — Temperature & Thirst",
      "Undead Nights — Zombie Hordes",
    ],
    downloadUrl: "/file/modpack/Sulfuria Basic 1.0.0.mrpack",
    downloadLabel: "Download Basic Pack",
  },
  {
    id: "pro",
    name: "Sulfuria Pro",
    icon: "Sulfuria_Pro.png",
    tagline: "Basic, tuned and dressed up.",
    description:
      "Every required mod plus performance, quality-of-life, and a curated shader pack — so the hordes look as good as they hit.",
    theme: "cyan",
    popular: true,
    fileSize: "~640 MB",
    mods: [
      "Fabric API",
      "GlitchCore API",
      "Better Combat — Combat Tweaks",
      "RIFTSCAPE Client — Server Resources",
      "Simple Voice Chat — Proximity Voice",
      "Tough As Nails — Temperature & Thirst",
      "Undead Nights — Zombie Hordes",
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
