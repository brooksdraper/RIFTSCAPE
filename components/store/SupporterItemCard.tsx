"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Check, Lock } from "lucide-react";
import { TIER_META, type SupporterItem } from "@/lib/supporter-items";

interface SupporterItemCardProps {
  item: SupporterItem;
  unlocked: boolean;
}

/**
 * A vault entry. Structurally a `WikiCard`: rarity-colored name, muted rarity
 * border, effects block. The tier badge doubles as the lock state, so a locked
 * card never needs a second treatment beyond dimming its contents.
 */
export function SupporterItemCard({ item, unlocked }: SupporterItemCardProps) {
  const meta = TIER_META[item.tier];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      style={{ borderColor: meta.border }}
      className={`group relative bg-neutral-950/90 border-2 pixel-corners p-5 flex flex-col justify-between overflow-hidden ${
        item.featured ? "enchant-glint enchant-glint-gold" : ""
      }`}
    >
      <div className={unlocked ? "" : "opacity-55"}>
        {/* Header row — icon slot, name in its tier color, tier badge */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center overflow-hidden p-1.5">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain pixelated"
                />
              ) : item.swatch ? (
                <span
                  aria-hidden
                  className="block w-full h-full border-2 border-black"
                  style={{ background: item.swatch }}
                />
              ) : (
                <span
                  className="font-mc-header text-base leading-none mc-text-shadow"
                  style={{ color: meta.text }}
                >
                  {item.glyph}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h3
                className="font-mc-header text-sm leading-tight mc-text-shadow truncate"
                style={{ color: meta.text }}
              >
                {item.name}
              </h3>
              <p className="font-mc-body italic text-[11px] text-neutral-500 mt-1">
                {item.kind}
              </p>
            </div>
          </div>

          <span
            className="shrink-0 inline-flex items-center gap-1 font-mc-sub text-[9px] uppercase tracking-wider px-2 py-0.5 border-2 pixel-corners-sm bg-black/60"
            style={{ color: meta.text, borderColor: meta.border }}
          >
            {!unlocked && <Lock size={9} />}
            {meta.badge}
          </span>
        </div>

        <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-4">
          {item.description}
        </p>

        {item.command && (
          <div className="mb-4 bg-black/30 p-3 border-2 border-black pixel-corners-sm">
            <span className="block font-mc-sub text-[9px] text-neutral-400 uppercase tracking-wider mb-2">
              Command
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot font-mc-body text-[11px] text-accent">
              {item.command}
            </span>
          </div>
        )}
      </div>

      {/* Gate readout — the card's whole call to action */}
      <div className="pt-3 border-t-2 border-black">
        {unlocked ? (
          <span className="flex items-center gap-2 font-mc-sub text-[10px] uppercase tracking-wider text-[color:var(--mc-success)]">
            <Check size={12} />
            Unlocked
          </span>
        ) : (
          <span className="flex items-center gap-2 font-mc-sub text-[10px] uppercase tracking-wider text-neutral-500">
            <Lock size={12} />
            Requires {meta.gate}
          </span>
        )}
      </div>
    </motion.div>
  );
}
