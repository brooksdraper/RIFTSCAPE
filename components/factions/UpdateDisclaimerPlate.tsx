export function UpdateDisclaimerPlate() {
  return (
    <div className="mc-panel pixel-corners border-2 border-black p-6 max-w-3xl mx-auto mb-8">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-[color:var(--mc-info)] p-2">
          <svg
            className="w-full h-full"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l2.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-mc-header text-base sm:text-lg text-foreground mc-text-shadow leading-relaxed">
            Update Disclaimer
          </h2>
          <p className="font-mc-body text-neutral-400 text-xs sm:text-sm leading-relaxed mt-1">
            Faction standings recalculate once daily at 12:00 AM PST. The score
            is a large aggregate computation, so it only refreshes on this
            schedule to keep the API from being overloaded and the data
            consistent.
          </p>
        </div>
      </div>

      <div className="mt-5 bg-black/30 border-2 border-black pixel-corners-sm p-3">
        <span className="block font-mc-sub text-[9px] text-accent uppercase tracking-wider mb-2">
          Scoring Formula
        </span>
        <code className="block font-mc-body text-[11px] text-sky-300/90 leading-relaxed break-words">
          (Playtime_Hours × 5) + (PvP_Kills × 50) − (PvP_Deaths × 20) +
          (Mob_Kills × 0.5) + (Activity_Index × 200)
        </code>
      </div>
    </div>
  );
}
