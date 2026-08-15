import { getEnrolledPlayers } from "@/lib/players";

const SURVIVORS_REQUIRED = 100;

export async function SurvivorsProgress() {
  const players = await getEnrolledPlayers();
  const enrolled = players.length;
  const percent = Math.min(
    100,
    Math.round((enrolled / SURVIVORS_REQUIRED) * 100),
  );
  const remaining = Math.max(0, SURVIVORS_REQUIRED - enrolled);
  const thresholdMet = enrolled >= SURVIVORS_REQUIRED;

  return (
    <div className="relative z-10 stone-bg border-t-2 border-black">
      <div className="container mx-auto px-6 py-20">
        <div className="mc-panel-raised pixel-corners-lg p-8 md:p-10 max-w-2xl mx-auto flex flex-col items-center text-center">
          <span
            className={`mc-panel-raised pixel-corners pixel-slot font-mc-sub text-[11px] tracking-widest uppercase px-6 py-2 mb-6 mc-text-shadow ${
              thresholdMet ? "text-[color:var(--mc-success)]" : "text-accent"
            }`}
          >
            {thresholdMet
              ? "100+ Survivors Enrolled"
              : "Minimum Survivors Not Met"}
          </span>

          <h2 className="font-mc-header text-2xl md:text-3xl mb-4 mc-text-shadow leading-relaxed">
            {thresholdMet
              ? "Sulfuria Launches on Day 0"
              : "100 Survivors To Launch"}
          </h2>

          <p className="font-mc-body text-sm text-foreground/70 max-w-xl mb-8 leading-relaxed">
            {thresholdMet
              ? "100 survivors have enrolled. The countdown for Day 0 begins soon."
              : `Sulfuria begins the live countdown for release once ${SURVIVORS_REQUIRED} survivors have enrolled. ${remaining} more to go.`}
          </p>

          <div className="w-full">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase">
                Survivors Enrolled
              </span>
              <span className="font-mc-header text-lg text-accent mc-text-shadow">
                {enrolled} / {SURVIVORS_REQUIRED}
              </span>
            </div>
            <div className="h-6 bg-black/70 border-2 border-black pixel-corners-sm pixel-slot overflow-hidden">
              <div
                className="h-full bg-accent transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurvivorsProgress;
