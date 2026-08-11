"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { WikiItem } from "./wiki-data";

interface WikiCardProps {
  item: WikiItem;
}

function renderIcon(icon: WikiItem["icon"]) {
  switch (icon) {
    case "flower":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a3 3 0 00-3 3c0 1.657 1.343 3 3 3s3-1.343 3-3a3 3 0 00-3-3zM7 8a3 3 0 00-3 3c0 1.657 1.343 3 3 3s3-1.343 3-3a3 3 0 00-3-3zM17 8a3 3 0 00-3 3c0 1.657 1.343 3 3 3s3-1.343 3-3a3 3 0 00-3-3zM12 14a3 3 0 00-3 3c0 1.657 1.343 3 3 3s3-1.343 3-3a3 3 0 00-3-3zM12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      );
    case "leaf":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case "skull":
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "potion":
    case "flask":
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
  }
}

const RARITY_STYLE: Record<
  NonNullable<WikiItem["rarity"]>,
  { text: string; border: string; glint?: boolean }
> = {
  Common: { text: "#B0B0B0", border: "#3f3f3f" },
  Rare: { text: "#FFFF55", border: "#8a8a2a" },
  Epic: { text: "#E070FF", border: "#7a2a8a" },
  Legendary: { text: "#FFAA00", border: "#8a5a00", glint: true },
};

function rarityStyle(rarity?: WikiItem["rarity"]) {
  return RARITY_STYLE[rarity ?? "Common"];
}

export function WikiCard({ item }: WikiCardProps) {
  const statEntries = Object.entries(item.stats);
  const { text: rarityText, border: rarityBorder, glint } = rarityStyle(
    item.rarity,
  );

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      style={{ borderColor: rarityBorder }}
      className={`group relative bg-neutral-950/90 border-2 pixel-corners p-5 flex flex-col justify-between overflow-hidden ${
        glint ? "enchant-glint" : ""
      }`}
    >
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            {/* Inventory slot icon */}
            <div className="w-11 h-11 shrink-0 bg-neutral-800 border-2 border-black pixel-corners-sm pixel-slot flex items-center justify-center text-accent overflow-hidden p-1.5">
              {item.iconUrl ? (
                <Image
                  src={item.iconUrl}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain [image-rendering:pixelated]"
                />
              ) : (
                renderIcon(item.icon)
              )}
            </div>
            <div>
              <h3
                className="font-mc-header text-sm leading-tight mc-text-shadow"
                style={{ color: rarityText }}
              >
                {item.name}
              </h3>
              <p className="font-mc-body italic text-[11px] text-neutral-500 mt-1">
                {item.roleOrType}
              </p>
            </div>
          </div>

          {item.rarity && (
            <span
              className="shrink-0 font-mc-sub text-[9px] uppercase tracking-wider px-2 py-0.5 border-2 pixel-corners-sm bg-black/60"
              style={{ color: rarityText, borderColor: rarityBorder }}
            >
              {item.rarity}
            </span>
          )}
        </div>

        {/* Description / Lore */}
        <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Crafting Recipe */}
        {item.recipe && item.recipe.length > 0 && (
          <div className="mb-4 bg-black/30 p-3 border-2 border-black pixel-corners-sm">
            <span className="flex items-center gap-1.5 font-mc-sub text-[9px] text-accent uppercase tracking-wider mb-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Crafting Recipe
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.recipe.map((ingredient, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot font-mc-body text-[11px] text-neutral-200"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Abilities & Effects */}
        {item.abilitiesOrEffects && item.abilitiesOrEffects.length > 0 && (
          <div className="mb-4 space-y-1.5 bg-black/20 p-3 border-2 border-black pixel-corners-sm">
            <span className="block font-mc-sub text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
              Effects &amp; Perks
            </span>
            {item.abilitiesOrEffects.map((ability, idx) => (
              <div key={idx} className="flex items-start gap-2 font-mc-body text-[11px] text-sky-300/90">
                <span className="text-sky-400 mt-0.5">◆</span>
                <span>{ability}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary Grid */}
      <div className="pt-3 border-t-2 border-black">
        <div className="grid grid-cols-3 gap-2 text-center">
          {statEntries.map(([key, value]) => (
            <div
              key={key}
              className="bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot py-1.5 px-1"
            >
              <span className="block font-mc-body text-[9px] text-neutral-500 uppercase tracking-wider truncate">
                {key}
              </span>
              <span className="block font-mc-header text-[11px] text-accent truncate mt-0.5">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
