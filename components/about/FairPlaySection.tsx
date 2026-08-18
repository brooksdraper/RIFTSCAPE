"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, ScrollText, Store as StoreIcon } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { DISCORD_URL } from "@/lib/links";

const links = [
  { label: "Wiki", href: "/wiki", icon: BookOpen, external: false },
  { label: "Rules", href: "/rules", icon: ScrollText, external: false },
  { label: "Store", href: "/store", icon: StoreIcon, external: false },
  { label: "Discord", href: DISCORD_URL, icon: DiscordIcon, external: true },
];

const principles = [
  "Permadeath is real, but the server still needs to be fair, consistent, and enforceable.",
  "Exploits, hacks, and convenience griefing are not tolerated and are treated as a direct threat to the run.",
  "Staff are active and visible, so the pressure remains competitive without becoming chaotic or broken.",
  "The goal is not to remove challenge — it is to remove cheating, abuse, and broken play from the experience.",
];

export function FairPlaySection() {
  return (
    <div className="relative z-10 deepslate-bg border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 py-24 max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] tracking-widest uppercase px-4 py-2 mb-6 inline-block mc-text-shadow">
            Community Guidelines
          </span>
          <h2 className="font-mc-header text-2xl md:text-3xl mb-5 mc-text-shadow leading-relaxed">
            Fair Play, Real Stakes
          </h2>
          <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-3xl mx-auto mb-10 leading-relaxed">
            A hardcore world only works when the rules are consistent and the
            pressure is honest. Riftscape emphasizes active moderation, clear
            expectations, and strict anti-exploit enforcement so the challenge
            is fun without being broken.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-10 text-left"
        >
          {principles.map((principle) => (
            <div
              key={principle}
              className="mc-panel pixel-corners p-4 sm:p-5 flex gap-3"
            >
              <span className="mt-1 text-accent text-sm">◆</span>
              <p className="font-mc-body text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                {principle}
              </p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          {links.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn pixel-corners px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex flex-col items-center justify-center gap-2"
              >
                <link.icon className="w-5 h-5" strokeWidth={2} />
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="mc-btn pixel-corners px-4 py-4 font-mc-sub text-xs text-foreground uppercase tracking-widest flex flex-col items-center justify-center gap-2"
              >
                <link.icon className="w-5 h-5" strokeWidth={2} />
                {link.label}
              </Link>
            ),
          )}
        </motion.div>
      </div>
    </div>
  );
}
