"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareText, Palette, Sparkles } from "lucide-react";

const perks = [
  {
    icon: MessageSquareText,
    title: "Custom Chat Icons",
    description: "Stand out in chat with an exclusive icon next to your name.",
  },
  {
    icon: Palette,
    title: "Custom Chat Colors",
    description: "Recolor your chat messages to match your style.",
  },
  {
    icon: Sparkles,
    title: "Emote Access",
    description: "Unlock a set of emotes to use anywhere on the server.",
    commands: ["/sit", "/lay", "/spin", "/hat"],
  },
];

export function SupporterStoreSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative mt-16 overflow-hidden mc-panel pixel-corners-lg mb-16"
    >
      <div className="absolute inset-0">
        <Image
          src="/img/Sulfuria_Meadow.png"
          alt="Sulfuria Meadow"
          fill
          className="object-cover opacity-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <span className="inline-block mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] sm:text-xs tracking-widest uppercase px-6 py-2 mb-6 mc-text-shadow">
            Rank Perks
          </span>
          <h2 className="font-mc-header text-2xl md:text-3xl text-white mb-4 mc-text-shadow leading-relaxed">
            Cosmetic <span className="text-accent">Vault</span>
          </h2>
          <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mx-auto leading-relaxed">
            Cosmetic extras included with every rank tag.
          </p>
          <Link
            href="/store/supporter"
            className="mc-btn pixel-corners inline-block mt-6 px-6 py-3 font-mc-sub text-[10px] sm:text-xs text-accent uppercase tracking-widest"
          >
            Browse the Cosmetic Vault →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="mc-panel pixel-corners p-6 flex flex-col"
            >
              <div className="w-11 h-11 mb-5 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center text-accent">
                <perk.icon size={22} />
              </div>
              <h3 className="font-mc-header text-xs sm:text-sm mb-3 mc-text-shadow leading-relaxed">
                {perk.title}
              </h3>
              <p className="font-mc-body text-xs text-neutral-300/90 leading-relaxed mb-4 flex-grow">
                {perk.description}
              </p>
              {perk.commands && (
                <div className="flex flex-wrap gap-1.5">
                  {perk.commands.map((command) => (
                    <span
                      key={command}
                      className="mc-chip pixel-corners-sm pixel-slot font-mc-body text-[11px] px-2 py-1 text-accent"
                    >
                      {command}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
