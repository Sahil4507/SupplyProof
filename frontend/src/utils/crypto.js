/**
 * Cryptographic Utility Module for SupplyProof
 * Team: HashGuard
 * 
 * Provides browser-native SHA-256 cryptographic hashing (window.crypto.subtle),
 * canonical deterministic product fingerprinting, and byte-level file digest calculation.
 * Zero external cryptographic dependencies.
 */

/**
 * Compute the canonical representation of product data.
 * Normalizes all stable product attributes into a standardized deterministic pipe-delimited string.
 * @param {Object} product
 * @returns {string} Normalized canonical string
 */
export function getCanonicalProductString(product) {
  if (!product) return '';
  const id = (product.productId || product.id || '').trim().toUpperCase();
  const name = (product.productName || product.name || '').trim();
  const mfgId = (product.manufacturerId || '').trim().toUpperCase();
  const batch = (product.batchNumber || product.batch || '').trim().toUpperCase();
  const mfgDate = (product.manufacturingDate || '').trim();
  const category = (product.category || '').trim();

  return `${id}|${name}|${mfgId}|${batch}|${mfgDate}|${category}`;
}

/**
 * Compute the 64-character uppercase hexadecimal SHA-256 hash of a string.
 * @param {string} text 
 * @returns {Promise<string>} 64-character uppercase hex string
 */
export async function computeSHA256(text) {
  if (!text) return '';
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  } catch (error) {
    console.error('SHA-256 calculation error:', error);
    return '';
  }
}

/**
 * Compute the deterministic SHA-256 product fingerprint for a product record.
 * @param {Object} product The product attributes to fingerprint
 * @returns {Promise<{ canonicalString: string, hashHex: string, bytes32Hash: string }>}
 */
export async function generateProductFingerprint(product) {
  const canonicalString = getCanonicalProductString(product);
  const hashHex = await computeSHA256(canonicalString);
  const bytes32Hash = hashHex ? `0x${hashHex.toLowerCase()}` : '';
  return {
    canonicalString,
    hashHex,
    bytes32Hash
  };
}

/**
 * Compute SHA-256 hash of raw binary bytes of a File or Blob.
 * Used for document integrity verification (invoices, certificates, inspection reports).
 * @param {File|Blob} file 
 * @returns {Promise<string>} 64-character uppercase hex string
 */
export async function computeFileSHA256(file) {
  if (!file) return '';
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  } catch (error) {
    console.error('File SHA-256 calculation error:', error);
    return '';
  }
}

/**
 * Generate a new unique Product ID in canonical format (e.g. SP-2026-XXXX).
 * @returns {string} Unique Product ID
 */
export function generateUniqueProductId() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SP-${year}-${randomSuffix}`;
}

/**
 * Validate Product ID format.
 * Canonical format is SP-YYYY-NNNN (e.g., SP-2026-0001) or standard alphanumeric serial.
 * @param {string} id 
 * @returns {boolean}
 */
export function isValidProductId(id) {
  if (!id || typeof id !== 'string') return false;
  const clean = id.trim().toUpperCase();
  // Validates SP-YYYY-XXXX (where YYYY is 4 digits and XXXX is 4-10 alphanumeric characters)
  return /^SP-\d{4}-[A-Z0-9_-]{3,12}$/i.test(clean);
}

/**
 * Extract canonical Product ID from a raw URL or text string.
 * Supports:
 * - Direct IDs: "SP-2026-0001"
 * - Full verification URLs: "https://.../verify?id=SP-2026-0001"
 * @param {string} text 
 * @returns {string|null} Canonical Product ID if detected, otherwise null
 */
export function extractProductId(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // Try parsing as URL
  try {
    const url = new URL(trimmed);
    const idParam = url.searchParams.get('id');
    if (idParam && isValidProductId(idParam)) {
      return idParam.trim().toUpperCase();
    }
  } catch {
    // Not a valid URL, continue to regex match
  }

  // Search for pattern SP-YYYY-XXXX
  const match = trimmed.match(/SP-\d{4}-[A-Z0-9_-]{3,12}/i);
  if (match) {
    return match[0].toUpperCase();
  }

  return null;
}

