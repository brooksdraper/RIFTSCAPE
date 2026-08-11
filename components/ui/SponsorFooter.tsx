import { getServerStatus } from "@/lib/server-status";
import { User } from "lucide-react";

export async function SponsorFooter() {
  const status = await getServerStatus("bananasandwich.us");

  return (
    <footer className="relative z-10 dirt-bg border-t-2 border-black py-6">
      <div className="container mx-auto px-6 flex flex-col items-center gap-2 text-center font-mc-sub text-[10px] text-foreground/40 uppercase tracking-widest">
        <span className="flex flex-wrap items-center justify-center gap-2">
          Sponsored by{" "}
          <a
            href="https://bananasandwich.us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 transition-colors mc-text-shadow"
          >
            BananaSandwich.us
          </a>
          <span className="inline-flex items-center gap-1.5 mc-chip pixel-corners-sm pixel-slot px-2 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-red-500" />
            </span>
            <span className="text-red-500 tracking-widest">LIVE</span>
            {status?.online && (
              <span className="inline-flex items-center gap-1 font-mc-body text-red-400/80 normal-case tracking-normal">
                ·
                <User size={12} className="shrink-0" />
                {status.players.toLocaleString()}
              </span>
            )}
          </span>
        </span>
        <span className="font-mc-body text-foreground/25 normal-case tracking-normal text-[11px]">
          &copy; {new Date().getFullYear()} RIFTSCAPE
        </span>
        <details className="mc-disclosure group max-w-2xl text-left">
          <summary className="cursor-pointer list-none text-center text-[9px] text-foreground/25 hover:text-foreground/50 transition-colors">
            <span className="align-super">
              Legal &amp; attribution
              <span className="ml-1 inline-block group-open:hidden">[+]</span>
              <span className="ml-1 hidden group-open:inline-block">[-]</span>
            </span>
          </summary>
          <p className="mt-3 font-mc-body text-foreground/20 normal-case tracking-normal text-[9px] leading-relaxed">
            NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED
            WITH MOJANG OR MICROSOFT. Minecraft is a trademark of Mojang
            Synergies AB. RIFTSCAPE is an independent, fan-operated server and
            is not affiliated with, endorsed, sponsored, or specifically
            approved by Mojang Synergies AB, Microsoft Corporation, or any of
            their affiliates. All trademarks, service marks, and trade names
            referenced herein are the property of their respective owners and
            are used for identification purposes only. Purchases support server
            operating costs, are voluntary, and are not a sale of Minecraft or
            any Mojang or Microsoft product. | Inspired by Forge Labs*
          </p>
        </details>
      </div>
    </footer>
  );
}
