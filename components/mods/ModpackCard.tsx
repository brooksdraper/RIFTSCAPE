"use client";

import { motion } from "motion/react";
import type { Modpack } from "./mods-data";

const THEME_STYLE: Record<
  Modpack["theme"],
  { text: string; border: string; button: string; glint: string }
> = {
  common: {
    text: "var(--mc-common)",
    border: "#3f3f3f",
    button: "",
    glint: "",
  },
  gold: {
    text: "var(--mc-rare)",
    border: "#8a8a2a",
    button: "mc-btn-accent",
    glint: "enchant-glint-gold",
  },
};

interface ModpackCardProps {
  pack: Modpack;
  index: number;
}

export function ModpackCard({ pack, index }: ModpackCardProps) {
  const theme = THEME_STYLE[pack.theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -3, transition: { duration: 0.1, ease: "easeOut" } }}
      style={{ borderColor: theme.border }}
      className={`relative bg-neutral-950/90 border-2 pixel-corners p-6 pt-8 flex flex-col overflow-hidden ${
        pack.popular ? `enchant-glint ${theme.glint}` : ""
      }`}
    >
      {pack.popular && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 mc-chip pixel-corners-sm pixel-slot font-mc-sub text-[9px] uppercase px-3 py-1 tracking-widest"
          style={{ color: theme.text }}
        >
          Recommended
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
          <svg
            className="w-6 h-6"
            style={{ color: theme.text }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <h2
            className="font-mc-header text-sm leading-tight mc-text-shadow"
            style={{ color: theme.text }}
          >
            {pack.name}
          </h2>
          <p className="font-mc-body italic text-[11px] text-neutral-500 mt-1">
            {pack.tagline}
          </p>
        </div>
      </div>

      <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-6">
        {pack.description}
      </p>

      <div className="mb-4 bg-black/30 p-3 border-2 border-black pixel-corners-sm">
        <span className="block font-mc-sub text-[9px] text-neutral-400 uppercase tracking-wider mb-2">
          {pack.extras ? "Includes Everything In Basic" : "Included Mods"}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {pack.mods.map((mod) => (
            <span
              key={mod}
              className="inline-flex items-center px-2 py-1 bg-neutral-900 border-2 border-black pixel-corners-sm pixel-slot font-mc-body text-[11px] text-neutral-200"
            >
              {mod}
            </span>
          ))}
        </div>
      </div>

      {pack.extras && (
        <div className="mb-4 space-y-1.5 bg-black/20 p-3 border-2 border-black pixel-corners-sm">
          <span className="block font-mc-sub text-[9px] text-neutral-400 uppercase tracking-wider mb-1">
            Plus Shaders, Performance &amp; QoL
          </span>
          {pack.extras.map((extra) => (
            <div
              key={extra}
              className="flex items-start gap-2 font-mc-body text-[11px] text-sky-300/90"
            >
              <span className="text-sky-400 mt-0.5">◆</span>
              <span>{extra}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex-grow" />

      <div className="flex items-center justify-between gap-3 mb-4 mt-2">
        <span className="font-mc-body text-[11px] text-foreground/50">
          Download size
        </span>
        <span className="font-mc-body text-[11px] text-neutral-300">
          {pack.fileSize}
        </span>
      </div>

      <a
        href={pack.downloadUrl}
        className={`mc-btn pixel-corners w-full py-4 font-mc-sub text-xs uppercase tracking-widest text-center ${theme.button}`}
      >
        {pack.downloadLabel}
      </a>
    </motion.div>
  );
}
