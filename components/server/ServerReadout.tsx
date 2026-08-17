"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, Loader2, Lock } from "lucide-react";
import {
  isUnlocked,
  supporterCategories,
  TIER_META,
  type SupporterCategory,
  type SupporterItem,
  type SupporterViewer,
} from "@/lib/store/supporter-items";

interface ModuleDef {
  categoryId: string;
  label: string;
}

const MODULES: ModuleDef[] = [
  { categoryId: "chat-icons", label: "Profile Icon" },
  { categoryId: "chat-colors", label: "Profile Color" },
  { categoryId: "emotes", label: "Emotes" },
  { categoryId: "rank-perks", label: "Sponsor Perks" },
];

function ModuleTile({
  category,
  label,
  unlockedCount,
  onOpen,
}: {
  category: SupporterCategory;
  label: string;
  unlockedCount: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mc-chip mc-chip-btn pixel-corners-sm pixel-slot px-3 py-3.5 text-center"
    >
      <div className="h-5 sm:h-6 flex items-center justify-center">
        <span className="font-mc-header text-sm sm:text-base text-accent mc-text-shadow leading-relaxed truncate">
          {unlockedCount}/{category.items.length}
        </span>
      </div>
      <div className="font-mc-sub text-[9px] text-neutral-400 uppercase tracking-widest mt-1.5">
        {label}
      </div>
    </button>
  );
}

/**
 * Fires the press + spinner animation on tap. Nothing sends the command
 * in-game yet — that bridge lands later — so this just plays the feedback a
 * real dispatch will use once it's wired up.
 */
function ItemRow({ item, unlocked }: { item: SupporterItem; unlocked: boolean }) {
  const meta = TIER_META[item.tier];
  const [sending, setSending] = useState(false);
  const canSet = unlocked && !!item.command;

  function handleClick() {
    if (!canSet || sending) return;
    setSending(true);
    setTimeout(() => setSending(false), 800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canSet}
      style={{ borderColor: meta.border }}
      className={`w-full flex items-center gap-3 p-3 border-2 pixel-corners-sm pixel-slot text-left ${
        canSet ? "hover:bg-neutral-900/60" : "opacity-55"
      }`}
    >
      <div className="w-10 h-10 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center overflow-hidden p-1.5">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            width={28}
            height={28}
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
            className="font-mc-header text-sm leading-none mc-text-shadow"
            style={{ color: meta.text }}
          >
            {item.glyph}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="font-mc-header text-xs leading-tight mc-text-shadow truncate"
          style={{ color: meta.text }}
        >
          {item.name}
        </div>
        <p className="font-mc-body text-[10px] text-neutral-500 mt-1 truncate">
          {item.description}
        </p>
      </div>

      <div className="shrink-0">
        {sending ? (
          <Loader2 className="w-4 h-4 text-accent animate-spin" />
        ) : !unlocked ? (
          <Lock size={14} className="text-neutral-500" />
        ) : item.command ? (
          <span className="font-mc-sub text-[9px] uppercase tracking-wider text-accent">
            Set
          </span>
        ) : (
          <Check size={14} className="text-[color:var(--mc-success)]" />
        )}
      </div>
    </button>
  );
}

export function ServerReadout({ viewer }: { viewer: SupporterViewer }) {
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const modules = MODULES.map((mod) => {
    const category = supporterCategories.find((c) => c.id === mod.categoryId);
    if (!category) return null;
    const unlockedCount = category.items.filter((item) =>
      isUnlocked(item, viewer),
    ).length;
    return { ...mod, category, unlockedCount };
  }).filter((mod): mod is NonNullable<typeof mod> => mod !== null);

  const openModule =
    modules.find((mod) => mod.categoryId === openCategoryId) ?? null;

  return (
    <motion.div
      layout
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="relative pixel-slot pixel-corners border-2 border-black bg-black/60 p-5 flex flex-col overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4 h-4">
        <AnimatePresence mode="wait" initial={false}>
          {openModule ? (
            <motion.button
              key="back"
              type="button"
              onClick={() => setOpenCategoryId(null)}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="flex items-center gap-1.5 font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest hover:text-accent transition-colors"
            >
              <ArrowLeft size={11} />
              {openModule.label}
            </motion.button>
          ) : (
            <motion.span
              key="title"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest"
            >
              Commands
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="popLayout" initial={false}>
        {openModule ? (
          <motion.div
            key={openModule.categoryId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-2 overflow-y-auto mc-scroll max-h-72 pr-1"
          >
            {openModule.category.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                unlocked={isUnlocked(item, viewer)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="grid grid-cols-2 gap-3 flex-1 content-start"
          >
            {modules.map((mod) => (
              <ModuleTile
                key={mod.categoryId}
                category={mod.category}
                label={mod.label}
                unlockedCount={mod.unlockedCount}
                onOpen={() => setOpenCategoryId(mod.categoryId)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
