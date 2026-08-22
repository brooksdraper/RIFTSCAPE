"use client";

import { useState, type CSSProperties } from "react";
import { StoreCard } from "./StoreCard";
import { CheckoutModal } from "./CheckoutModal";
import { storeItems, type StoreItem } from "@/lib/store/store-items";
import type { EnrolledPlayer } from "@/lib/players";

interface StoreGridProps {
  isLoggedIn: boolean;
  minecraftUsername: string | null;
  lifeNumber: number | null;
  currentTier: EnrolledPlayer["tier"] | null;
}

export function StoreGrid({
  isLoggedIn,
  minecraftUsername,
  lifeNumber,
  currentTier,
}: StoreGridProps) {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const renderItems = (inert?: boolean) =>
    storeItems.map((item, index) => (
      <div key={item.id} className="w-[300px] sm:w-[340px] shrink-0">
        <StoreCard
          item={item}
          index={index}
          isLoggedIn={isLoggedIn}
          lifeNumber={lifeNumber}
          currentTier={currentTier}
          onPurchase={inert ? () => {} : setSelectedItem}
        />
      </div>
    ));

  return (
    <div
      className="mc-marquee-viewport relative overflow-hidden mc-scroll"
      style={{ "--marquee-duration": "70s" } as CSSProperties}
    >
      <div className="mc-marquee-track flex">
        <div className="mc-marquee-content flex gap-6 pr-6">
          {renderItems()}
        </div>
        {/* Seamless-loop duplicate — inert so its Purchase buttons aren't
            reachable by keyboard or announced by screen readers. */}
        <div
          className="mc-marquee-content flex gap-6 pr-6"
          aria-hidden="true"
          inert
        >
          {renderItems(true)}
        </div>
      </div>

      {/* Edge fades — diffuse cards into the page background instead of a
          hard clip at the viewport edge. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-24 md:w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-24 md:w-32 bg-gradient-to-l from-background to-transparent" />

      {isLoggedIn && (
        <CheckoutModal
          item={selectedItem}
          defaultRecipient={minecraftUsername ?? ""}
          currentTier={currentTier}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
