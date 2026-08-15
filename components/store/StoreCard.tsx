"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { StoreItem, StoreTheme } from "@/lib/store/store-items";

interface StoreCardProps {
  item: StoreItem;
  index: number;
  isLoggedIn: boolean;
  lifeNumber: number | null;
  onPurchase: (item: StoreItem) => void;
}

/**
 * Store tiers borrow the wiki's rarity ramp: the item name takes the rarity
 * color, the panel border takes its muted counterpart, and only the popular
 * tier earns the enchantment glint — tinted to match its own tier.
 */
const themeStyles: Record<
  StoreTheme,
  {
    text: string;
    border: string;
    button: string;
    buttonGlow: string;
    glint: string;
  }
> = {
  yellow: {
    text: "var(--mc-rare)",
    border: "#8a8a2a",
    button: "mc-btn-accent",
    buttonGlow: "",
    glint: "enchant-glint-gold",
  },
  red: {
    text: "var(--mc-danger)",
    border: "#8a2a2a",
    button: "mc-btn-danger",
    buttonGlow: "",
    glint: "enchant-glint-red",
  },
  magenta: {
    text: "var(--mc-epic)",
    border: "#7a2a8a",
    button: "mc-btn-epic",
    buttonGlow: "mc-glow-epic",
    glint: "enchant-glint-gold",
  },
};

export function StoreCard({
  item,
  index,
  isLoggedIn,
  lifeNumber,
  onPurchase,
}: StoreCardProps) {
  const theme = themeStyles[item.theme];

  const livesLeft =
    item.maxLifeNumber !== undefined
      ? Math.max(item.maxLifeNumber - (lifeNumber ?? 1), 0)
      : null;

  let badgeText = "Most Popular";
  if (item.id === "sponsor") {
    // We calculate the relative value dynamically based on the extra-life bonus
    // Assuming the base value of Sponsor is its price, and Extra Life is an added bonus.
    const sponsorPrice = item.priceCents;
    const extraLifePrice = 1299; // 12.99 from extra-life item
    const totalValue = sponsorPrice + extraLifePrice;
    const valuePercent = Math.round((totalValue / sponsorPrice) * 100);
    badgeText = `${valuePercent}% VALUE`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      style={{ borderColor: theme.border }}
      className={`relative bg-neutral-950/90 border-2 pixel-corners p-6 pt-8 flex flex-col overflow-hidden ${
        item.popular ? `enchant-glint ${theme.glint}` : ""
      }`}
    >
      {item.popular && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 mc-chip pixel-corners-sm pixel-slot font-mc-sub text-[9px] uppercase px-3 py-1 tracking-widest"
          style={{ color: theme.text }}
        >
          {badgeText}
        </div>
      )}

      {/* Header — inventory slot icon + item name in its rarity color */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
          <Image
            src={item.image}
            alt={item.name}
            width={32}
            height={32}
            className="w-full h-full object-contain pixelated"
          />
        </div>
        <h2
          className="font-mc-header text-sm leading-tight mc-text-shadow"
          style={{ color: theme.text }}
        >
          {item.name}
        </h2>
      </div>

      <div
        className="font-mc-header text-2xl mb-5 mc-text-shadow"
        style={{ color: theme.text }}
      >
        {item.price}
      </div>

      {livesLeft !== null && isLoggedIn && (
        <div
          className={`flex items-center gap-1.5 font-mc-body text-[11px] -mt-3 mb-5 ${
            livesLeft > 0
              ? "text-foreground/60"
              : "text-[color:var(--mc-danger)]"
          }`}
        >
          <Image
            src="/img/hardcore-64x64.png"
            alt="Life"
            width={64}
            height={64}
            className="w-4 h-4 pixelated"
          />
          {livesLeft} {livesLeft === 1 ? "life" : "lives"} left this season
        </div>
      )}

      <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-6 flex-grow">
        {item.description}
      </p>

      {/* Features — mirrors the wiki's "Effects & Perks" block */}
      <div className="mb-6 space-y-1.5 bg-black/30 p-3 border-2 border-black pixel-corners-sm">
        <span className="block font-mc-sub text-[9px] text-slate-400 uppercase tracking-wider mb-1">
          Features
        </span>
        {item.features.map((feature, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 font-mc-body text-[11px] text-slate-200/80"
          >
            <span className="text-slate-200 mt-0.5">◆</span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        {item.bonus && (
          <div className="absolute -top-4 -right-2 z-10 flex items-center gap-1.5 mc-chip pixel-corners-sm pixel-slot font-mc-sub text-[11px] px-3 py-1.5 tracking-wide text-[color:var(--mc-legendary)]">
            +{item.bonus.amount}
            <Image
              src={item.bonus.icon}
              alt={item.bonus.alt}
              width={24}
              height={24}
              className="w-5 h-5 pixelated"
            />
          </div>
        )}
        {/* Glow lives on this wrapper — the button's clip-path would eat it */}
        <div className={isLoggedIn ? theme.buttonGlow : ""}>
          <button
            onClick={() => isLoggedIn && onPurchase(item)}
            disabled={!isLoggedIn}
            title={isLoggedIn ? undefined : "Sign in to purchase"}
            className={`mc-btn pixel-corners w-full py-4 font-mc-sub text-xs uppercase tracking-widest ${
              isLoggedIn ? theme.button : "text-foreground/40"
            }`}
          >
            {isLoggedIn ? "Purchase" : "Sign In to Purchase"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
