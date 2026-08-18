export interface RoadmapPhase {
  day: string;
  title: string;
  copy: string;
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    day: "Day 0",
    title: "Drop In",
    copy: "The world goes live, enrollment locks, and factions begin to form and claim territory.",
  },
  {
    day: "Day 1–9",
    title: "Foundations",
    copy: "Gather loot, choose your allies, and make your claim on the map before the good land is gone.",
  },
  {
    day: "Day 10–24",
    title: "Territory Wars",
    copy: "Land Claims become contestable. Faction raids become legal. Zombie hordes start scaling with server population.",
  },
  {
    day: "Day 25–42",
    title: "The Long Night",
    copy: "Mod-driven threats intensify, resources thin out, and extra lives start actually mattering.",
  },
  {
    day: "Day 43–59",
    title: "Endgame Sieges",
    copy: "Factions consolidate or collapse. Final raids target whoever's still holding territory.",
  },
  {
    day: "Day 60",
    title: "Sundown",
    copy: "The challenge ends. Survivors are immortalized on the leaderboard, the world is archived, and RIFTSCAPE resets for the next season.",
  },
];
