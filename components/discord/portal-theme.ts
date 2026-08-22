// Shared palette + pixel map for the /discord redirect plate's portal motif
// (PortalIcon and PortalProgressFill both tile this exact grid so the icon
// and the bar read as the same block, not two different effects).

export const OBSIDIAN = "#0a0a0a";
export const PORTAL_LIGHT = "var(--mc-epic)";
export const PORTAL_DARK = "#7a2a8a";

// 5x5 pixel-art nether portal: an obsidian frame around a checkerboard core.
// `flicker: true` marks the inner portal cells (not the frame) so only those
// step their opacity — the frame stays solid, same as vanilla.
export const PORTAL_GRID = [
  [OBSIDIAN, OBSIDIAN, OBSIDIAN, OBSIDIAN, OBSIDIAN],
  [OBSIDIAN, PORTAL_DARK, PORTAL_LIGHT, PORTAL_DARK, OBSIDIAN],
  [OBSIDIAN, PORTAL_LIGHT, PORTAL_DARK, PORTAL_LIGHT, OBSIDIAN],
  [OBSIDIAN, PORTAL_DARK, PORTAL_LIGHT, PORTAL_DARK, OBSIDIAN],
  [OBSIDIAN, OBSIDIAN, OBSIDIAN, OBSIDIAN, OBSIDIAN],
].map((row) => row.map((color) => ({ color, flicker: color !== OBSIDIAN })));

export const PORTAL_GRID_SIZE = PORTAL_GRID.length;

// Row count of just the checkerboard core, with the obsidian frame sliced
// off — for contexts (like the progress bar) that want a continuous portal
// texture with no black frame seams between repeats.
export const PORTAL_CORE_SIZE = PORTAL_GRID_SIZE - 2;

// Staggered so cells don't step in lockstep — reads as a shimmering texture
// swap rather than the whole portal blinking as one unit.
export const FLICKER_DELAYS = [0, 0.3, 0.15, 0.45, 0.6, 0.1, 0.5, 0.25, 0.4];

// Ember colors shared by every particle emitter on the plate (icon + bar).
export const PARTICLE_COLORS = [PORTAL_LIGHT, "#f0b0ff", PORTAL_DARK];
