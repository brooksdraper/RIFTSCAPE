"use client";

import { motion } from "motion/react";

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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative inline-block mb-6 pixel-corners bg-neutral-900 pixel-slot px-6 py-2 border-2 border-black"
      >
        <span className="font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase mc-text-shadow">
          RIFTSCAPE WIKI
        </span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="font-mc-header text-3xl sm:text-4xl text-foreground tracking-tight mb-4 mc-text-shadow leading-relaxed"
      >
        Consumables &amp; <span className="text-accent">Recipes</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="font-mc-body text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed"
      >
        Explore the custom items and essential crafting recipes in the RIFTSCAPE
        realm.
      </motion.p>

      <motion.span
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="font-mc-body text-[11px] text-neutral-500 max-w-2xl"
      >
        * Note: All entries are subject to change as the season progresses.
      </motion.span>

      {/* Search Input — Minecraft textfield style */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="relative max-w-xl mx-auto"
      >
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
      </motion.div>

      {/* Count badge — XP style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot"
      >
        <span className="w-2 h-2 bg-accent" />
        <motion.span
          key={count}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="font-mc-body text-[11px] text-neutral-300 tracking-wide"
        >
          {count} {count === 1 ? "entry" : "entries"} indexed
        </motion.span>
      </motion.div>
    </div>
  );
}
