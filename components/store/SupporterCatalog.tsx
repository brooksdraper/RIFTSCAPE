"use client";

import { useState } from "react";
import { SupporterItemCard } from "./SupporterItemCard";
import {
  isUnlocked,
  supporterCategories,
  type SupporterViewer,
} from "@/lib/store/supporter-items";

interface SupporterCatalogProps {
  viewer: SupporterViewer;
}

type Filter = "all" | "unlocked" | "locked";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unlocked", label: "Unlocked" },
  { id: "locked", label: "Locked" },
];

export function SupporterCatalog({ viewer }: SupporterCatalogProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const categories = supporterCategories
    .map((category) => ({
      ...category,
      entries: category.items
        .map((item) => ({ item, unlocked: isUnlocked(item, viewer) }))
        .filter(({ unlocked }) =>
          filter === "all" ? true : filter === "unlocked" ? unlocked : !unlocked,
        ),
    }))
    .filter((category) => category.entries.length > 0);

  return (
    <div>
      {/* Creative-inventory tab row */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mr-2">
          Show
        </span>
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={`mc-btn pixel-corners-sm px-4 py-2 font-mc-sub text-[10px] uppercase tracking-widest ${
              filter === id ? "text-accent" : "text-foreground/60"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="mc-panel pixel-corners pixel-slot p-8 text-center font-mc-body text-xs text-neutral-400">
          Nothing matches that filter.
        </div>
      )}

      {categories.map((category) => (
        <section
          key={category.id}
          id={category.id}
          className="scroll-mt-24 mb-16"
        >
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
            <div className="text-left">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-mc-header text-lg sm:text-xl text-foreground mc-text-shadow leading-relaxed">
                  {category.title}
                </h2>
                <span className="bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot text-accent font-mc-body text-[10px] px-2 py-0.5">
                  {category.entries.length}{" "}
                  {category.entries.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              <p className="font-mc-body text-xs text-neutral-400 mt-2">
                {category.subtitle}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.entries.map(({ item, unlocked }) => (
              <SupporterItemCard
                key={item.id}
                item={item}
                unlocked={unlocked}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
