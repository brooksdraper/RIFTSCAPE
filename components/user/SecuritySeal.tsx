"use client";

import Image from "next/image";

interface SecuritySealProps {
  verified: boolean;
  className?: string;
}

export function SecuritySeal({ verified, className = "" }: SecuritySealProps) {
  return (
    <div
      title={
        verified
          ? "Confirmed via an in-game verification token"
          : "Minecraft account not yet verified"
      }
      className={`mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-0.5 ${className}`}
    >
      <Image
        src={verified ? "/img/heart_card.png" : "/img/spade_card.png"}
        alt={verified ? "Verified registry seal" : "Unverified registry seal"}
        width={16}
        height={16}
        className="w-full h-full object-contain pixelated"
      />
    </div>
  );
}
