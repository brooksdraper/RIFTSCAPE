"use client";

interface WikiHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  count: number;
}

export function WikiHeader({
  searchQuery,
  setSearchQuery,
  count,
}: WikiHeaderProps) {
  return (
    <div className="text-center max-w-4xl mx-auto mb-10">
      {/* Sign / plank banner */}
      <div className="relative inline-block mb-6 pixel-corners bg-neutral-900 pixel-slot px-6 py-2 border-2 border-black">
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          RIFTSCAPE WIKI
        </span>
      </div>

      {/* Main Title */}
      <h1 className="font-mc-header text-3xl sm:text-4xl text-foreground tracking-tight mb-4 mc-text-shadow leading-relaxed">
        Consumables &amp; <span className="text-accent">Recipes</span>
      </h1>

      <p className="font-mc-body text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
        Explore tactical consumables and essential crafting recipes in the
        RIFTSCAPE realm.
      </p>

      {/* Search Input — Minecraft textfield style */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search consumables, ingredients, or effects..."
          className="w-full pl-11 pr-16 py-3.5 bg-black/70 border-2 border-black pixel-slot focus:outline-none focus:ring-2 focus:ring-accent/60 text-foreground placeholder-neutral-600 transition font-mc-body text-xs sm:text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-accent text-[10px] uppercase tracking-wider font-mc-sub transition"
          >
            Clear
          </button>
        )}
      </div>

      {/* Count badge — XP style */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot">
        <span className="w-2 h-2 bg-accent" />
        <span className="font-mc-body text-[11px] text-neutral-300 tracking-wide">
          {count} {count === 1 ? "entry" : "entries"} indexed
        </span>
      </div>
    </div>
  );
}
