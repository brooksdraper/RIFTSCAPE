"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, ScrollText, Store as StoreIcon } from "lucide-react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";
import { DISCORD_URL } from "@/lib/links";

const links = [
  { label: "Wiki", href: "/wiki", icon: BookOpen, external: false },
  { label: "Rules", href: DISCORD_URL, icon: ScrollText, external: true },
  { label: "Store", href: "/store", icon: StoreIcon, external: false },
  { label: "Discord", href: DISCORD_URL, icon: DiscordIcon, external: true },
];

export function FairPlaySection() {
  return (
    <div className="relative z-10 deepslate-bg border-t-2 border-black">
      <div className="container mx-auto px-4 sm:px-6 py-24 max-w-4xl text-center">
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
          <p className="font-mc-body text-sm sm:text-base text-neutral-300/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Permadeath only works if everyone&apos;s playing by the same rules.
            Riftscape runs active staff coverage, server-side anti-cheat, and
            zero tolerance for exploits — because losing your one life to a
            hacker isn&apos;t hardcore, it&apos;s just broken. Bring your best
            strategy. We&apos;ll make sure it&apos;s a fair fight.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
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
