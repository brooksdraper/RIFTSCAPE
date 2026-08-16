"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CommandDef {
  label: string;
  command: string;
}

const COMMANDS: CommandDef[] = [
  { label: "Home", command: "/home" },
  { label: "Teleport To", command: "/tpa" },
  { label: "Teleport Here", command: "/tpahere" },
  { label: "Chat Color", command: "/chatcolor" },
  { label: "Chat Icon", command: "/icon" },
];

/**
 * Fires the press + spinner animation on tap. Nothing sends the command
 * in-game yet — that bridge lands later — so this just plays the feedback a
 * real dispatch will use once it's wired up.
 */
function CommandTile({ label, command }: CommandDef) {
  const [sending, setSending] = useState(false);

  function handleClick() {
    if (sending) return;
    setSending(true);
    setTimeout(() => setSending(false), 800);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={sending}
      className="mc-chip mc-chip-btn pixel-corners-sm pixel-slot px-3 py-3.5 text-center"
    >
      <div className="h-5 sm:h-6 flex items-center justify-center">
        {sending ? (
          <Loader2 className="w-4 h-4 text-accent animate-spin" />
        ) : (
          <span className="font-mc-header text-sm sm:text-base text-accent mc-text-shadow leading-relaxed truncate">
            {command}
          </span>
        )}
      </div>
      <div className="font-mc-sub text-[9px] text-neutral-400 uppercase tracking-widest mt-1.5">
        {label}
      </div>
    </button>
  );
}

export function ServerReadout() {
  return (
    <div className="pixel-slot pixel-corners border-2 border-black bg-black/60 p-5 flex flex-col">
      <span className="font-mc-sub text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
        Commands
      </span>

      <div className="grid grid-cols-2 gap-3 flex-1 content-start">
        {COMMANDS.map((cmd) => (
          <CommandTile key={cmd.label} {...cmd} />
        ))}
      </div>
    </div>
  );
}
