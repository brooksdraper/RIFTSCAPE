import { PARTICLE_COLORS } from "@/components/discord/portal-theme";

// A cluster of embers trailing just behind the fill's leading edge, rather
// than scattered across the whole track — reads as the portal actively
// churning at the point it's currently charging up to. Rendered as a sibling
// of the (clipped) bar rather than inside it, so these are free to float
// well above the bar instead of being cut off at its edge.
const PARTICLE_COUNT = 14;
const MAX_TRAIL_OFFSET = 40;
const RISE_HEIGHTS = ["28px", "40px", "52px", "64px", "48px"];

interface PortalBarParticlesProps {
  progress: number;
}

export function PortalBarParticles({ progress }: PortalBarParticlesProps) {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const offset = (i / (PARTICLE_COUNT - 1)) * MAX_TRAIL_OFFSET;
    return {
      left: `${Math.max(progress - offset, 0)}%`,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      delay: `${(i * 0.15) % 1.6}s`,
      duration: `${1.4 + (i % 4) * 0.25}s`,
      rise: RISE_HEIGHTS[i % RISE_HEIGHTS.length],
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, i) => (
        <div
          key={i}
          className="portal-particle"
          aria-hidden="true"
          style={{
            left: particle.left,
            bottom: 0,
            backgroundColor: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            ["--portal-particle-rise" as string]: particle.rise,
          }}
        />
      ))}
    </div>
  );
}
