"use client";

import { useState } from "react";
import { StoreCard } from "./StoreCard";
import { CheckoutModal } from "./CheckoutModal";
import { storeItems, type StoreItem } from "@/lib/store/store-items";

interface StoreGridProps {
  isLoggedIn: boolean;
  minecraftUsername: string | null;
  lifeNumber: number | null;
}

export function StoreGrid({
  isLoggedIn,
  minecraftUsername,
  lifeNumber,
}: StoreGridProps) {
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {storeItems.map((item, index) => (
        <StoreCard
          key={item.id}
          item={item}
          index={index}
          isLoggedIn={isLoggedIn}
          lifeNumber={lifeNumber}
          onPurchase={setSelectedItem}
        />
      ))}
      {isLoggedIn && (
        <CheckoutModal
          item={selectedItem}
          defaultRecipient={minecraftUsername ?? ""}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
