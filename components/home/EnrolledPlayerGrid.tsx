"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { EnrolledPlayer } from "@/lib/players";

export function EnrolledPlayerGrid({ players }: { players: EnrolledPlayer[] }) {
  return (
    <div className="flex flex-col">
      <span className="mc-panel-raised pixel-corners pixel-slot font-mc-sub text-accent text-[11px] tracking-widest uppercase px-4 py-2 mb-6 self-start mc-text-shadow">
        • {players.length} Survivors Enrolled
      </span>
      <h2 className="font-mc-header text-2xl md:text-3xl mb-8 mc-text-shadow leading-relaxed">
        Enrolled Players
      </h2>

      {players.length === 0 ? (
        <p className="font-mc-body text-sm text-foreground/50">
          No survivors have enrolled yet.
        </p>
      ) : (
        // Player roster reads as an inventory grid of head slots
        <div className="mc-scroll w-full grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1 content-start">
          {players.map((player, i) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="mc-chip pixel-corners-sm pixel-slot flex items-center gap-2 py-2 px-2 group"
            >
              <Image
                src={`https://mc-heads.net/avatar/${encodeURIComponent(player.minecraft_username)}/32`}
                alt={player.minecraft_username}
                width={32}
                height={32}
                className="w-6 h-6 shrink-0 pixelated grayscale group-hover:grayscale-0 transition-all duration-300"
              />
              <span className="font-mc-body text-[11px] text-foreground/80 group-hover:text-accent transition-colors duration-300 truncate">
                {player.minecraft_username}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
