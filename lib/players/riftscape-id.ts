/**
 * Display helpers for the RIFTSCAPE player registry card.
 *
 * Every value here is derived deterministically from the profile UUID
 * (public.profiles.id) so a survivor's card always renders identically.
 * These are cosmetic encodings, not real Code128 / ICAO checksums.
 */

/** Strip a UUID down to its raw hex digits. */
function hexOf(id: string): string {
  return id.replace(/[^a-fA-F0-9]/g, "").toUpperCase();
}

/** "a3f2c1d8-4b5e-..." -> "A3F2 C1D8 4B5E 6F70" */
export function formatIdSerial(id: string): string {
  const hex = hexOf(id).slice(0, 16).padEnd(16, "0");
  return (hex.match(/.{1,4}/g) ?? []).join(" ");
}

/** Compact serial used in the machine-readable zone, e.g. "A3F2C1D84B5E6F70". */
export function compactSerial(id: string): string {
  return hexOf(id).slice(0, 16).padEnd(16, "0");
}

/**
 * A short registry number stamped on the card face, e.g. "RS-04821".
 * Folds the whole UUID so cards that share a prefix still differ.
 */
export function registryNumber(id: string): string {
  const hex = hexOf(id);
  let sum = 0;
  for (let i = 0; i < hex.length; i++) {
    sum = (sum * 31 + parseInt(hex[i], 16)) % 100000;
  }
  return `RS-${String(sum).padStart(5, "0")}`;
}

/** Single check digit appended to the MRZ. */
export function checkDigit(id: string): string {
  const hex = hexOf(id);
  let sum = 0;
  const weights = [7, 3, 1];
  for (let i = 0; i < hex.length; i++) {
    sum += parseInt(hex[i], 16) * weights[i % 3];
  }
  return String(sum % 10);
}

/** Passport-style machine-readable zone: two fixed-width lines. */
export function machineReadableZone(
  id: string,
  minecraftUsername: string,
  tier: string,
  lifeNumber: number
): [string, string] {
  const LINE = 44;
  const pad = (s: string) => s.slice(0, LINE).padEnd(LINE, "<");

  const name = minecraftUsername.toUpperCase().replace(/[^A-Z0-9]/g, "<");
  const line1 = pad(`ID<RFTSCP<<${name}`);
  const line2 = pad(
    `${compactSerial(id)}<${tier.toUpperCase().slice(0, 3)}<L${String(
      lifeNumber
    ).padStart(2, "0")}<${checkDigit(id)}`
  );

  return [line1, line2];
}

export type BarcodeBar = { width: number; filled: boolean };

/**
 * Variable-width bar pattern in the visual style of Code128, driven by the
 * UUID nibbles. Guard bars bookend the symbol like a real scanline target.
 */
export function barcodeBars(id: string): BarcodeBar[] {
  const hex = hexOf(id);
  const bars: BarcodeBar[] = [
    { width: 2, filled: true },
    { width: 1, filled: false },
    { width: 1, filled: true },
    { width: 1, filled: false },
  ];

  for (let i = 0; i < hex.length; i++) {
    const nibble = parseInt(hex[i], 16);
    // Low two bits pick a 1-4 module width; the pattern alternates ink/space.
    bars.push({ width: (nibble & 0b11) + 1, filled: true });
    bars.push({ width: ((nibble >> 2) & 0b11) + 1, filled: false });
  }

  bars.push(
    { width: 1, filled: true },
    { width: 1, filled: false },
    { width: 2, filled: true }
  );

  return bars;
}

/** "2026-08-09T12:00:00Z" -> "09 AUG 2026" (falls back to a dash). */
export function formatIssueDate(iso: string | undefined): string {
  if (!iso) return "—";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ][date.getUTCMonth()];

  return `${day} ${month} ${date.getUTCFullYear()}`;
}

/** "2026-08-09T12:34:56Z" -> "09 AUG 2026 12:34" (falls back to a dash). */
export function formatIssueTimestamp(iso: string | undefined): string {
  if (!iso) return "—";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${formatIssueDate(iso)} ${hours}:${minutes}`;
}
