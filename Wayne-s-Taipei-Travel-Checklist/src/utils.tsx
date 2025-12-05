/**
 * Normalize a score to a number between 0 and 10.
 * Accepts number, string, or undefined.
 * Invalid or NaN values default to 0.
 */
export function normalizeScore(value?: number | string): number {
  // Convert string to number if needed
  const num = typeof value === "string" ? Number(value) : value;

  // Return 0 if invalid
  if (typeof num !== "number" || Number.isNaN(num)) return 0;

  // Clamp between 0 and 10
  return Math.max(0, Math.min(10, num));
}
