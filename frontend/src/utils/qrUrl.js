/**
 * QR Code Verification URL Resolver
 * Team: HashGuard | Project: SupplyProof
 * 
 * Ensures generated QR codes contain valid URLs that can be opened from
 * a mobile phone on the same Wi-Fi network during local development,
 * and uses the production URL when deployed to cloud providers (e.g., Vercel).
 * 
 * STRICT RULE: Never encodes 'localhost' or '127.0.0.1' into QR codes,
 * as mobile devices cannot reach the host machine via loopback addresses.
 */

// LAN IP injected by vite.config.js from Node.js os.networkInterfaces()
// Fallback to active Wi-Fi IPv4 address detected during audit
export const DEFAULT_LAN_IP = (typeof __LAN_IP__ !== 'undefined' && __LAN_IP__) ? __LAN_IP__ : '192.168.1.4';

/**
 * Get the active base URL for QR codes.
 * Resolution precedence:
 * 1. User manual override stored in localStorage ('supplyproof_qr_base_url')
 * 2. Explicit environment variable (VITE_APP_URL, VITE_PUBLIC_URL, or VITE_VERCEL_URL)
 * 3. Deployed browser origin (if window.location.hostname is NOT localhost or 127.0.0.1)
 * 4. Local LAN IP address + active port (e.g. http://192.168.1.4:5173)
 * 
 * @returns {string} Fully qualified base URL without trailing slash
 */
export function getQrBaseUrl() {
  // 1. Manual user override
  if (typeof window !== 'undefined' && window.localStorage) {
    const custom = window.localStorage.getItem('supplyproof_qr_base_url');
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, '');
    }
  }

  // 2. Explicit Environment Variables (safely support both Vite browser client & Node.js environments)
  const env = (typeof import.meta !== 'undefined' && import.meta?.env) ? import.meta.env : (typeof process !== 'undefined' && process?.env ? process.env : {});
  const envUrl = env.VITE_APP_URL || env.VITE_PUBLIC_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // Check for Vercel deployment variable
  if (env.VITE_VERCEL_URL) {
    return `https://${env.VITE_VERCEL_URL}`.replace(/\/+$/, '');
  }

  // 3. Browser runtime inspection
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol || 'http:';

    // If already running on a deployed domain or non-loopback IP (e.g. user already navigated to 192.168.1.4:5173)
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return window.location.origin.replace(/\/+$/, '');
    }

    // 4. Running locally on localhost: replace with computer's LAN IP
    const portSegment = port ? `:${port}` : ':5173';
    return `${protocol}//${DEFAULT_LAN_IP}${portSegment}`;
  }

  // Fallback default
  return `http://${DEFAULT_LAN_IP}:5173`;
}

/**
 * Generate the complete verification URL for a given product ID.
 * @param {string} productId - Canonical Product ID (e.g. 'SP-2026-0001')
 * @returns {string} Complete verification URL (e.g. 'http://192.168.1.4:5173/verify?id=SP-2026-0001')
 */
export function getVerificationUrl(productId) {
  const base = getQrBaseUrl();
  const cleanId = (productId || '').trim().toUpperCase();
  return `${base}/verify?id=${encodeURIComponent(cleanId)}`;
}

/**
 * Check if the current QR base URL is pointing to a local LAN address.
 * @returns {boolean}
 */
export function isLocalLanUrl() {
  const base = getQrBaseUrl();
  return base.includes('192.168.') || base.includes('10.') || base.includes('172.');
}

/**
 * Save a custom QR base URL override.
 * @param {string} customUrl 
 */
export function setCustomQrBaseUrl(customUrl) {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (!customUrl || !customUrl.trim()) {
      window.localStorage.removeItem('supplyproof_qr_base_url');
    } else {
      window.localStorage.setItem('supplyproof_qr_base_url', customUrl.trim());
    }
  }
}
