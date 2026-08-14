export interface MapRegion {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  threatLevel: "Low" | "Moderate" | "Extreme";
  features: string[];
}

export const MAP_REGIONS: MapRegion[] = [
  {
    id: "meadow",
    name: "Sulfuria Meadow",
    tagline: "Cherry Blossom Basin",
    threatLevel: "Low",
    image: "/img/Sulfuria_Meadow.png",
    description:
      "Petals drift over the northern basin year-round, drawn from a stretch of cherry groves that somehow outlasted the collapse. Bamboo grows thick along the waterline — one of the few places on Sulfuria where you can hear birdsong over the groaning.",
    features: [
      "Dense bamboo groves for early building supplies",
      "Open sightlines — hard for hordes to ambush",
      "Freshwater access along the northern coast",
    ],
  },
  {
    id: "swamp",
    name: "Sulfuria Swamp",
    tagline: "Mosswood Mire",
    threatLevel: "Extreme",
    image: "/img/Sulfuria_Swamp.png",
    description:
      "Vine-choked canopy blots out the sky here, and the water underneath doesn't move right. Faction scouts report the densest horde activity on the continent threading between the roots — anything that goes quiet in the Mire stays quiet.",
    features: [
      "Heaviest zombie density on the map",
      "Canopy cover blocks most natural light",
      "Rare loot pooled in the flooded lowlands",
    ],
  },
  {
    id: "plains",
    name: "Sulfuria Plains",
    tagline: "Redbank Flats",
    threatLevel: "Moderate",
    image: "/img/Sulfuria_Plains.png",
    description:
      "A river bends hard through a bowl of cracked red clay before opening onto rolling farmland. A lone watchtower still stands over the flats — whoever holds it can see a horde coming from half a continent away.",
    features: [
      "Fertile farmland along the river bend",
      "Wide open — little cover from roaming hordes",
      "Ruined watchtower holds scavenged supplies",
    ],
  },
  {
    id: "taiga",
    name: "Sulfuria Taiga",
    tagline: "The Hollow Pines",
    threatLevel: "Moderate",
    image: "/img/Sulfuria_Taiga.png",
    description:
      "Fog pools between the pines and never quite burns off. Sound doesn't travel far in the Hollow Pines, which cuts both ways — you won't hear the horde coming, but it won't hear you either.",
    features: [
      "Thick pine cover for stealth movement",
      "Fog cuts visibility to a few blocks",
      "Reliable foraging: mushrooms and berries",
    ],
  },
  {
    id: "mountains",
    name: "Sulfuria Mountains",
    tagline: "Frostbound Ridge",
    threatLevel: "Moderate",
    image: "/img/Sulfuria_Mountains.png",
    description:
      "Snow settles permanently above the treeline, and the wind carries a chill that outlasts any campfire. Hordes thin out fast at altitude — the ridge punishes the living and the dead in equal measure.",
    features: [
      "Sweeping sightlines from the summit",
      "Bitter cold drains stamina fast",
      "Sparse hordes, sparser shelter",
    ],
  },
  {
    id: "volcano",
    name: "Sulfuria Volcano",
    tagline: "Ember Crater",
    threatLevel: "Extreme",
    image: "/img/Sulfuria_Volcano.png",
    description:
      "The crater still glows. Forest presses right up against the scorched slope, close enough that the treeline looks like it's daring the mountain to erupt. No faction has held a base within sight of it for long.",
    features: [
      "Active lava flow — no safe base sites",
      "Rare ore exposed along the scorched slopes",
      "Extreme heat drains hunger fast",
    ],
  },
];

export interface PointOfInterest {
  id: string;
  name: string;
  note: string;
  icon: "mountain" | "waves" | "trees" | "cloud" | "anchor";
}

export const POINTS_OF_INTEREST: PointOfInterest[] = [
  {
    id: "scorched-mesa",
    name: "Scorched Mesa",
    note: "Cracked badlands to the north",
    icon: "mountain",
  },
  {
    id: "sundrift-dunes",
    name: "Sundrift Dunes",
    note: "Wind-carved desert, eastern coast",
    icon: "waves",
  },
  {
    id: "bright-birch-forest",
    name: "Bright Birch Forest",
    note: "Pale woodland, central highlands",
    icon: "trees",
  },
  {
    id: "sky-isles",
    name: "Sky Isles",
    note: "Fragments adrift above the coast",
    icon: "cloud",
  },
  {
    id: "west-village-archipelago",
    name: "West Village Archipelago",
    note: "Scattered settlements, western sea",
    icon: "anchor",
  },
];
