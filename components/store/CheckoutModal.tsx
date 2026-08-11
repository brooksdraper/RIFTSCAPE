"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import type { StoreItem } from "@/lib/store-items";
import {
  DISCORD_USERNAME_PATTERN,
  normalizeDiscordUsername,
} from "@/lib/validation";
import { Gift, Info } from "lucide-react";

interface CheckoutModalProps {
  item: StoreItem | null;
  defaultRecipient: string;
  defaultRecipientDiscord?: string;
  onClose: () => void;
}

export function CheckoutModal({
  item,
  defaultRecipient,
  defaultRecipientDiscord = "",
  onClose,
}: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <CheckoutModalContent
          key={item.id}
          item={item}
          defaultRecipient={defaultRecipient}
          defaultRecipientDiscord={defaultRecipientDiscord}
          onClose={onClose}
        />
      )}
    </AnimatePresence>
  );
}

interface CheckoutModalContentProps {
  item: StoreItem;
  defaultRecipient: string;
  defaultRecipientDiscord?: string;
  onClose: () => void;
}

function CheckoutModalContent({
  item,
  defaultRecipient,
  defaultRecipientDiscord = "",
  onClose,
}: CheckoutModalContentProps) {
  const canGift = item.giftable !== false;
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [recipientDiscord, setRecipientDiscord] = useState(
    defaultRecipientDiscord,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const recipient =
    canGift && isGift ? giftRecipient : defaultRecipient;

  const normalizedRecipientDiscord = normalizeDiscordUsername(recipientDiscord);
  const canCheckout =
    recipient.trim().length > 0 &&
    DISCORD_USERNAME_PATTERN.test(normalizedRecipientDiscord);

  const handleCheckout = async () => {
    if (!canCheckout) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          minecraftUsername: recipient,
          discordUsername: normalizedRecipientDiscord,
          isGift: canGift && isGift,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-md mc-panel-raised pixel-corners p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-mc-sub text-foreground/50 hover:text-accent transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-3">
          You&apos;re Buying
        </div>
        <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-black">
          <div className="w-12 h-12 shrink-0 mc-chip pixel-corners-sm pixel-slot flex items-center justify-center p-1.5">
            <Image
              src={item.image}
              alt={item.name}
              width={32}
              height={32}
              className="w-full h-full object-contain pixelated"
            />
          </div>
          <div>
            <h2 className="font-mc-header text-sm mc-text-shadow leading-tight">
              {item.name}
            </h2>
            <p className="font-mc-body text-[11px] text-neutral-400 mt-1">
              {item.description}
            </p>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="mb-6">
          <label className="block font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase mb-2">
            Recipient Account
          </label>
          <div className="mc-input pixel-corners-sm">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Image
                src={`https://mc-heads.net/avatar/${encodeURIComponent(recipient || "steve")}/64`}
                alt={recipient}
                width={64}
                height={64}
                className="w-8 h-8 pixelated border-2 border-black shrink-0"
              />
              <div className="flex-1 min-w-0">
                {isGift ? (
                  <input
                    type="text"
                    required
                    placeholder="Minecraft Username"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    className="w-full bg-transparent outline-none font-mc-body text-sm text-foreground placeholder:text-neutral-600"
                  />
                ) : (
                  <span className="block font-mc-body text-sm text-foreground truncate">
                    {recipient || "Not specified"}
                  </span>
                )}
              </div>
            </div>
            <input
              type="text"
              required
              placeholder="Discord Username"
              value={recipientDiscord}
              onChange={(e) => setRecipientDiscord(e.target.value)}
              className="w-full bg-transparent border-t-2 border-black outline-none px-3 py-2.5 font-mc-body text-sm placeholder:text-neutral-600"
            />
          </div>

          {canGift && (
            <div className="flex items-center justify-end gap-2 mt-2">
              <span className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase">
                Gift to another player
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isGift}
                aria-label="Gift to another player"
                onClick={() => {
                  setIsGift((prev) => !prev);
                  setGiftRecipient("");
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center border-2 border-black pixel-corners-sm pixel-slot transition-colors duration-150 ${
                  isGift ? "bg-accent/25" : "bg-black/60"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center transition-transform duration-150 ${
                    isGift
                      ? "translate-x-6 bg-accent text-background"
                      : "translate-x-1 bg-neutral-700 text-foreground/60"
                  }`}
                >
                  <Gift size={12} />
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Total & Disclaimer Section */}
        <div className="space-y-4 mb-6 pb-6 border-b-2 border-black">
          <div className="flex items-center justify-between">
            <span className="font-mc-sub text-[9px] text-foreground/40 tracking-widest uppercase">
              Total Due
            </span>
            <span className="font-mc-header text-lg text-accent mc-text-shadow">
              {item.price}
            </span>
          </div>

          <div className="p-3 bg-black/30 border-2 border-black pixel-corners-sm font-mc-body text-[11px] text-neutral-300/90 flex items-start gap-2.5">
            <Info size={18} className="text-accent shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Please return to this page after purchase to complete your
              transaction.
            </span>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="font-mc-body text-xs text-[color:var(--mc-danger)] mb-4"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleCheckout}
          disabled={!canCheckout || status === "loading"}
          className="mc-btn mc-btn-accent pixel-corners w-full py-4 font-mc-sub text-xs uppercase tracking-widest"
        >
          {status === "loading"
            ? "Redirecting..."
            : `Pay ${item.price} + Tax Securely →`}
        </button>
      </motion.div>
    </motion.div>
  );
}
