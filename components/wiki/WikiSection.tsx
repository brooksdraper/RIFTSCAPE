"use client";

import { WikiItem } from "./wiki-data";
import { WikiCard } from "./WikiCard";

interface WikiSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  items: WikiItem[];
}

export function WikiSection({
  id = "consumables",
  title,
  subtitle,
  items,
}: WikiSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 mb-16">
      {/* Section Header — creative-inventory tab style */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
        <div className="text-left">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-mc-header text-lg sm:text-xl text-foreground tracking-tight mc-text-shadow">
              {title}
            </h2>
            <span className="bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot text-accent font-mc-body text-[10px] px-2 py-0.5">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <p className="font-mc-body text-xs text-neutral-400 mt-2">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <WikiCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
