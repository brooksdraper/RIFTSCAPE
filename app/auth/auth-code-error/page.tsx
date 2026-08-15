import type { Metadata } from "next";
import Link from "next/link";
import { BackgroundOverlay } from "@/components/layout/BackgroundOverlay";

export const metadata: Metadata = {
  title: "Sign-In Failed | RIFTSCAPE",
  description: "The Discord sign-in could not be completed.",
};

export default function AuthCodeError() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/30 overflow-hidden relative pb-24">
      <BackgroundOverlay opacityClass="opacity-20" />

      <div className="relative z-10 container mx-auto px-6 pt-12">
        <div className="w-full max-w-lg mx-auto text-center mc-panel pixel-corners px-6 py-12">
          <div className="mx-auto mb-7 w-16 h-16 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center">
            <span className="font-mc-sub text-[9px] tracking-widest uppercase text-[color:var(--mc-danger)]">
              Error
            </span>
          </div>

          <h1 className="font-mc-header text-xl sm:text-2xl mb-3 mc-text-shadow leading-relaxed">
            Sign-In Failed
          </h1>
          <p className="font-mc-body text-sm text-foreground/60 mb-8 leading-relaxed">
            Discord did not hand back a valid authorization code. This usually
            means the link expired or the sign-in was cancelled partway through.
          </p>

          <Link
            href="/"
            className="mc-btn pixel-corners inline-block px-8 py-4 font-mc-sub text-xs uppercase tracking-widest text-accent"
          >
            Back to Base
          </Link>
        </div>
      </div>
    </main>
  );
}
