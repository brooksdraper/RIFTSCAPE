"use client";

import Image from "next/image";

interface BackgroundOverlayProps {
  opacityClass?: string;
}

export function BackgroundOverlay({ opacityClass = "opacity-30" }: BackgroundOverlayProps) {
  return (
    <div className="fixed inset-0 z-0 stone-bg">
      <Image
        src="/img/Sulfuria.png"
        alt="Sulfuria Map"
        fill
        className={`object-cover ${opacityClass} scale-105`}
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
