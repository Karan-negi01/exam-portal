export const PRICE_PER_SEAT = 200;
export const SEAT_VALIDITY_YEARS = 1;

export function oneYearFromNow(fromDate = new Date()) {
  const d = new Date(fromDate);
  d.setFullYear(d.getFullYear() + SEAT_VALIDITY_YEARS);
  return d.toISOString();
}

export function isQuotaExpired(quota) {
  if (!quota?.expiresAt) return true;
  return new Date(quota.expiresAt).getTime() < Date.now();
}

export function seatsRemaining(quota, usedSeats) {
  if (!quota) return 0;
  if (isQuotaExpired(quota)) return 0;
  return Math.max(0, quota.seats - usedSeats);
}

export function daysUntilExpiry(quota) {
  if (!quota?.expiresAt) return null;
  return Math.ceil((new Date(quota.expiresAt).getTime() - Date.now()) / 86400000);
}

export function formatRupees(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}
