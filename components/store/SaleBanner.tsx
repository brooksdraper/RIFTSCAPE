import { SALE_CONFIG } from "@/lib/store/sale-config";

const MESSAGE = `• ${SALE_CONFIG.discount} — ${SALE_CONFIG.label} — Ends ${SALE_CONFIG.endDateDisplay}`;
const strip = Array.from({ length: 6 }, () => MESSAGE).join("   ");

/**
 * Sliding promo ribbon for the store hero. Self-guards on SALE_CONFIG.active,
 * so removing the promo is a one-line flip in lib/store/sale-config.ts — deleting
 * this file and its import in StoreHeader removes it entirely.
 */
export function SaleBanner() {
  if (!SALE_CONFIG.active) return null;

  return (
    <div className="mc-glow-danger">
      <div className="relative overflow-hidden border-y-2 border-black bg-[#b91c1c]">
        <span className="sr-only">{MESSAGE}</span>
        <div className="mc-marquee-track flex py-2" aria-hidden="true">
          <span className="mc-marquee-content font-mc-sub text-[11px] sm:text-xs uppercase tracking-widest text-white mc-text-shadow">
            {strip}
          </span>
          <span className="mc-marquee-content font-mc-sub text-[11px] sm:text-xs uppercase tracking-widest text-white mc-text-shadow">
            {strip}
          </span>
        </div>
      </div>
    </div>
  );
}
