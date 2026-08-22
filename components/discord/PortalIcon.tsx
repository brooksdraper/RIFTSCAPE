import {
  FLICKER_DELAYS,
  PARTICLE_COLORS,
  PORTAL_GRID,
} from "@/components/discord/portal-theme";

// Motes rising out of the portal at varied position/speed/color so they read
// as scattered embers rather than one repeating sprite.
const PARTICLES = [
  { left: "30%", delay: "0s", duration: "1.5s", color: PARTICLE_COLORS[0] },
  { left: "65%", delay: "0.5s", duration: "1.8s", color: PARTICLE_COLORS[1] },
  { left: "45%", delay: "1s", duration: "1.4s", color: PARTICLE_COLORS[0] },
  { left: "80%", delay: "0.2s", duration: "1.9s", color: PARTICLE_COLORS[2] },
  { left: "20%", delay: "0.8s", duration: "1.6s", color: PARTICLE_COLORS[2] },
  { left: "55%", delay: "1.3s", duration: "1.7s", color: PARTICLE_COLORS[0] },
  { left: "75%", delay: "0.6s", duration: "1.3s", color: PARTICLE_COLORS[1] },
  { left: "40%", delay: "1.1s", duration: "2s", color: PARTICLE_COLORS[2] },
];

export function PortalIcon() {
  let flickerIndex = 0;

  return (
    <div className="relative w-full h-full">
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
        }}
        aria-hidden="true"
      >
        {PORTAL_GRID.flat().map(({ color, flicker }, i) => (
          <div
            key={i}
            className={flicker ? "portal-cell" : undefined}
            style={{
              backgroundColor: color,
              animationDelay: flicker
                ? `${FLICKER_DELAYS[flickerIndex++ % FLICKER_DELAYS.length]}s`
                : undefined,
            }}
          />
        ))}
      </div>

      {PARTICLES.map((particle, i) => (
        <div
          key={i}
          className="portal-particle"
          aria-hidden="true"
          style={{
            left: particle.left,
            backgroundColor: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
