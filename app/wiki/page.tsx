"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { WIKI_DATA } from "@/components/wiki/wiki-data";
import { WikiHeader } from "@/components/wiki/WikiHeader";
import { WikiSection } from "@/components/wiki/WikiSection";

export default function WikiPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered dataset based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return WIKI_DATA;
    const q = searchQuery.toLowerCase();
    return WIKI_DATA.filter((item) => {
      const matchName = item.name.toLowerCase().includes(q);
      const matchTagline = item.tagline.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchType = item.roleOrType.toLowerCase().includes(q);
      const matchRecipe = item.recipe.some((r) => r.toLowerCase().includes(q));

      return matchName || matchTagline || matchDesc || matchType || matchRecipe;
    });
  }, [searchQuery]);

  return (
    <main className="min-h-screen stone-bg text-foreground selection:bg-accent/30 overflow-x-hidden relative pb-28">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-10 sm:pt-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Link
            href="/"
            className="inline-flex items-center text-foreground/60 hover:text-accent font-mc-sub text-xs tracking-widest uppercase transition-colors mb-8"
          >
            <span className="mr-2">←</span> Back to HQ
          </Link>
        </motion.div>

        {/* Header with search */}
        <WikiHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          count={filteredItems.length}
        />

        {/* Filtered empty state */}
        <AnimatePresence mode="wait">
          {filteredItems.length === 0 && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center py-16 bg-neutral-950/80 border-2 border-black pixel-corners pixel-slot max-w-md mx-auto my-10"
            >
              <svg
                className="w-12 h-12 text-neutral-600 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-mc-header text-sm text-foreground mb-2 mc-text-shadow">
                No Consumables Found
              </h3>
              <p className="font-mc-body text-xs text-neutral-400 mb-4">
                No entries match your search query &quot;{searchQuery}&quot;.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border-2 border-black pixel-corners-sm font-mc-sub text-[10px] uppercase tracking-wider text-accent transition"
              >
                Reset Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consumables & Recipes Section */}
        {filteredItems.length > 0 && (
          <WikiSection
            id="consumables"
            title="Custom Additions & Crafting Recipes"
            subtitle="Ultility items, status effects, and required crafting ingredients."
            items={filteredItems}
          />
        )}
      </div>
    </main>
  );
}
