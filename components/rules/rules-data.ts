export type StrikeType = "BLACK" | "RED";

export interface Rule {
  id: string;
  title: string;
  strikeType: StrikeType;
  summary: string;
  violations: string[];
  consequence: string;
  tempBan?: string;
  factionImpact?: string;
}

export interface RuleCategory {
  id: string;
  title: string;
  subtitle: string;
  rules: Rule[];
}

// CONDUCT & COMMUNITY
const conductRules: Rule[] = [
  {
    id: "conduct-1",
    title: "Hate Speech & Discrimination",
    strikeType: "BLACK",
    summary:
      "No slurs, racist/sexist/transphobic language, or dehumanizing content",
    violations: [
      "Using slurs in chat",
      "Making derogatory comments about identity groups",
      "Creating offensive usernames or skins targeting identity",
    ],
    consequence:
      "BLACK strike + immediate removal. | RIFTSCAPE has a no tolerance policy for hate speech. Any player found using slurs or discriminatory language will be permanently erased from all RIFTSCAPE technologies.",
    factionImpact:
      "Faction leader may face faction penalties if not addressed internally",
  },
  {
    id: "conduct-2",
    title: "Harassment & Targeted Abuse",
    strikeType: "BLACK",
    summary: "No sustained targeting, threats, doxing, or sexual harassment",
    violations: [
      "Following player across the map to harass",
      "Repeated insults or personal attacks",
      "Threats of action against real person or doxxing",
      "Sexual harassment or unwanted advances",
    ],
    consequence: "BLACK strike (threats/doxing) or RED strike (repeated abuse)",
    tempBan: "+ 7-14 pts.",
    factionImpact:
      "Faction counts as minor violation; leader should enforce internally",
  },
  {
    id: "conduct-3",
    title: "Spam & Chat Flooding",
    strikeType: "RED",
    summary: "No excessive messages, caps spam, or chat manipulation",
    violations: [
      "Sending same message 5+ times rapidly",
      "Spam capslock or repeated symbols",
      "Command flooding or chat bot abuse",
      "Intentionally triggering spam filters",
    ],
    consequence: "RED strike + temp mute (24-48 hours)",
    tempBan: "+ 1-2 pts.",
    factionImpact: "Minor; counts as RED strike if repeated",
  },
  {
    id: "conduct-4",
    title: "Account Sharing & Impersonation",
    strikeType: "BLACK",
    summary:
      "One account per person; no sharing logins or pretending to be someone else",
    violations: [
      "Logging in as another player's account",
      "Using shared account with multiple people",
      "Pretending to be admin, moderator, or another player",
      "Name spoofing to impersonate",
      "Attempting to exploit network functions or bypass security",
    ],
    consequence: "BLACK strike + removal of all accounts involved",
    factionImpact:
      "Faction loses all players involved; may be disbanded if core members",
  },
  {
    id: "conduct-5",
    title: "Recording & Privacy Violations",
    strikeType: "RED",
    summary: "No recording/streaming private conversations without consent",
    violations: [
      "Recording private Discord/chat conversations",
      "Screenshotting DMs and sharing without consent",
      "Streaming server with map/base locations visible to strangers",
      "Sharing voice recordings without permission",
    ],
    consequence:
      "RED strike + takedown notice (BLACK strike if denied removal of content or malicious intent)",
    tempBan: "+ 3-7 pts.",
    factionImpact: "Minor; counts as RED strike if repeated",
  },
];

// SURVIVAL GAMEPLAY
const survivalRules: Rule[] = [
  {
    id: "survival-1",
    title: "Griefing",
    strikeType: "RED",
    summary:
      "Do not irreparably destroy or modify another player's/faction's builds, claims, or landscaping. *VOID when \"In Combat\"",
    violations: [
      "Filling moats or modifying terrain",
      "Chopping trees or destroying landscaping",
      "Removing light sources or changing environments",
    ],
    consequence: "RED strike + forced restoration / material compensation",
    tempBan: "+ 3-7 pts.",
    factionImpact: "Minor; counts as RED strike if repeated",
  },
  {
    id: "survival-2",
    title: "Duping & Item Exploits",
    strikeType: "BLACK",
    summary: "No duplicating items through glitches or exploits",
    violations: ["Any known bug used to duplicate resources"],
    consequence: "BLACK strike + item removal",
    factionImpact:
      "Faction receives BLACK strike; may be disbanded if complicit or repeated",
  },
  {
    id: "survival-3",
    title: "Mob Farm Lag Abuse",
    strikeType: "RED",
    summary:
      "Farms must not cause server lag; any farm causing TPS drop below 18 must be reduced",
    violations: [
      "Running massive mob farm during prime time",
      "AFK farming that tanks server TPS",
      "Stacking multiple high-load farms in same chunk",
      "Refusing to reduce farm after admin request",
    ],
    consequence: "RED strike",
    tempBan: "+ 1-2 pts.",
    factionImpact: "Faction RED strike",
  },
  {
    id: "survival-4",
    title: "PVP",
    strikeType: "RED",
    summary:
      "Explosives, full-charge maces, and high velocity spears can only be used during scheduled raids",
    violations: [
      "Using respawn anchor to PvP outside raid time",
      "Bed bombing in neutral zone",
      "Using high-damage weapons outside raid context",
    ],
    consequence: "RED strike + combat reset",
    tempBan: "+ 4-12 pts.",
    factionImpact: "Faction RED strike",
  },
];

// FACTION WARS & PVP
const factionRules: Rule[] = [
  {
    id: "faction-1",
    title: "Sportsmanship & Good Faith",
    strikeType: "RED",
    summary:
      "Refrain from entirely obliterating a player's or faction's progress. Raids should be competitive, not eliminationist. Leave room for counterplay and recovery.",
    violations: [
      "Systematically destroying all infrastructure to prevent any recovery",
      "Repeatedly raiding the same faction weekly with no legitimate strategic goal",
      "Stealing all valuables and destroying all resource generation",
      "Intentionally making the game unplayable for a faction for extended periods",
    ],
    consequence:
      "RED strike if pattern is established + possible raid reversal or restoration",
    tempBan: "+ 7-14 pts.",
    factionImpact: "Faction RED strike; reputational damage",
  },
  {
    id: "faction-2",
    title: "Safe Zone Protection",
    strikeType: "BLACK",
    summary: "No PvP or raiding in designated safe zones (Spawn)",
    violations: [
      "Attacking players in safe zones",
      "Placing explosives or damaging blocks in safe zones",
      "Ambushing players who flee to safe zones",
    ],
    consequence: "BLACK (intentional); RED (accidental)",
    tempBan: "+ 3-7 pts.",
    factionImpact: "2 Faction RED strikes",
  },
];

// FACTION STRUCTURE REFERENCE
// Teams: 1–4 players. Can own claims and farm, but cannot form official factions.
// Factions: 5+ players + 4 chunks minimum of occupied/controlled land. Official server group with raid rights.
// Note: Moderation in faction wars is intentionally light to allow free-willed, emergent gameplay.
// Players accept the risk of reduced admin oversight in exchange for competitive freedom.

// RIFTSCAPE MECHANICS
const riftscapeRules: Rule[] = [
  {
    id: "riftscape-1",
    title: "System Exploitation & Abuse",
    strikeType: "BLACK",
    summary:
      "Do not exploit, abuse, modify, or alter network systems or game functions. This includes all bugs, glitches, and unintended mechanics.",
    violations: [
      "Using any known bug or glitch for advantage",
      "Duping items through exploits",
      "Breaking game mechanics or systems",
      "Circumventing intended limitations via technical loopholes",
      "Altering or interfering with server network functions",
    ],
    consequence: "BLACK strike",
    factionImpact: "Faction BLACK strike; may be disbanded if complicit",
  },
  {
    id: "riftscape-2",
    title: "Deceitful & Malicious Behavior",
    strikeType: "BLACK",
    summary:
      "No deceitful or malicious behavior intended to damage the server, subvert systems, or harm players. This catches all loopholes.",
    violations: [
      "Deliberate exploitation of server systems",
      "Behavior that undermines fair play or server integrity",
      "Coordinated attempts to break mechanics or crash systems",
      "Any behavior clearly intended to cause harm that doesn't fit other rules",
    ],
    consequence: "BLACK strike",
    factionImpact: "Faction BLACK strike; may be disbanded if complicit",
  },
];

export const RULES_DATA: RuleCategory[] = [
  {
    id: "conduct",
    title: "Conduct & Community",
    subtitle: "Server behavior and communication standards",
    rules: conductRules,
  },
  {
    id: "survival",
    title: "Survival Gameplay",
    subtitle: "Protecting builds, claims, and fair play",
    rules: survivalRules,
  },
  {
    id: "faction",
    title: "Faction Wars & PvP",
    subtitle: "Raid conduct and competitive integrity",
    rules: factionRules,
  },
  {
    id: "riftscape",
    title: "RIFTSCAPE Mechanics",
    subtitle: "Protecting custom server events and systems",
    rules: riftscapeRules,
  },
];
