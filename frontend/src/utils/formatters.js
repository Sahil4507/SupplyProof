/**
 * Formatting and Validation Utilities for SupplyProof
 * Team: HashGuard
 */

export function truncateAddress(address, start = 6, end = 4) {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

export function truncateHash(hash, start = 8, end = 6) {
  if (!hash) return '';
  if (hash.length <= start + end) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Validates canonical SupplyProof Product ID format.
 * Format: SP-YYYY-NNNN (e.g. SP-2026-0001)
 */
export function isValidProductId(id) {
  if (!id) return false;
  const regex = /^SP-\d{4}-\d{4}$/i;
  return regex.test(id.trim());
}
