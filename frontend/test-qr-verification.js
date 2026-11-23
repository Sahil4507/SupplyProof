import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { generateQRCodeSVG } from './src/utils/qr.js';
import { getVerificationUrl, DEFAULT_LAN_IP } from './src/utils/qrUrl.js';
import { generateProductFingerprint, isValidProductId } from './src/utils/crypto.js';
import { INITIAL_PRODUCTS, getProductById } from './src/data/mockProducts.js';

async function runComprehensiveQrTest() {
  console.log("==================================================");
  console.log("SUPPLYPROOF QR CODE & MOBILE VERIFICATION TEST");
  console.log("==================================================\n");

  // 1. LAN IP Check
  console.log("1. Checking Current LAN IP Configuration:");
  console.log("   Detected LAN IP:   ", DEFAULT_LAN_IP);
  if (!DEFAULT_LAN_IP || DEFAULT_LAN_IP === '127.0.0.1' || DEFAULT_LAN_IP === 'localhost') {
    throw new Error("FAIL: LAN IP is resolving to loopback address!");
  }
  console.log("   [PASS] LAN IP is a valid routable network address.\n");

  // 2. Verification URL Generation
  console.log("2. Generating Verification URL for SP-2026-0001:");
  const generatedUrl = getVerificationUrl('SP-2026-0001');
  console.log("   Generated QR URL:  ", generatedUrl);

  if (generatedUrl.includes('localhost') || generatedUrl.includes('127.0.0.1')) {
    throw new Error("FAIL: Generated URL contains localhost or 127.0.0.1!");
  }
  if (!generatedUrl.includes('/verify?id=SP-2026-0001')) {
    throw new Error("FAIL: Generated URL is missing correct path or Product ID!");
  }
  console.log("   [PASS] URL correctly targets LAN IP and includes Product ID.\n");

  // 3. QR SVG Generation
  console.log("3. Generating SVG QR Code via standard QRCode engine:");
  const svgMarkup = generateQRCodeSVG(generatedUrl, { size: 200 });
  console.log("   SVG Size in Bytes: ", svgMarkup.length);
  if (!svgMarkup.startsWith('<svg') || !svgMarkup.endsWith('</svg>')) {
    throw new Error("FAIL: SVG markup is malformed!");
  }
  console.log("   [PASS] Valid SVG markup produced.\n");

  // 4. Programmatic QR Decoding via jsQR (Simulates mobile phone camera sensor)
  console.log("4. Programmatically Decoding QR Code (Simulating Mobile Phone Camera):");
  const qr = QRCode.create(generatedUrl, { errorCorrectionLevel: 'M' });
  const moduleCount = qr.modules.size;
  const margin = 4;
  const scale = 6;
  const totalPx = (moduleCount + margin * 2) * scale;
  const rgba = new Uint8ClampedArray(totalPx * totalPx * 4);
  rgba.fill(255); // White background

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (qr.modules.get(r, c)) {
        const sy = (r + margin) * scale;
        const sx = (c + margin) * scale;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const idx = ((sy + dy) * totalPx + (sx + dx)) * 4;
            rgba[idx] = 0;
            rgba[idx + 1] = 0;
            rgba[idx + 2] = 0;
            rgba[idx + 3] = 255;
          }
        }
      }
    }
  }

  const decoded = jsQR(rgba, totalPx, totalPx);
  if (!decoded || !decoded.data) {
    throw new Error("FAIL: Programmatic QR decoder (jsQR) failed to read QR code!");
  }
  console.log("   Camera Scanned URL:", decoded.data);
  if (decoded.data !== generatedUrl) {
    throw new Error(`FAIL: Decoded URL [${decoded.data}] does not match generated URL [${generatedUrl}]!`);
  }
  console.log("   [PASS] 100% exact match between encoded URL and decoded URL!\n");

  // 5. Verification Route Logic Check (Case A: Authentic)
  console.log("5. Testing Verification Page Logic with Decoded URL (Case A: Authentic):");
  const parsedUrl = new URL(decoded.data);
  const scannedId = parsedUrl.searchParams.get('id');
  console.log("   Extracted Product ID: ", scannedId);

  // Validate format
  const formatValid = isValidProductId(scannedId);
  console.log("   Format Schema Valid:  ", formatValid);
  if (!formatValid) throw new Error("Product ID failed format validation!");

  // Lookup product
  const product = getProductById(scannedId);
  if (!product) throw new Error(`Product ${scannedId} not found in registry!`);
  console.log("   Product Name:         ", product.productName);
  console.log("   Product Status:       ", product.status);

  // Recompute cryptographic fingerprint
  const fingerprint = await generateProductFingerprint(product);
  const hashesMatch = fingerprint.hashHex.toUpperCase() === product.productHash.toUpperCase();
  console.log("   On-Chain Fingerprint: ", product.productHash);
  console.log("   Recomputed SHA-256:   ", fingerprint.hashHex);
  console.log("   Hashes Match (100%):  ", hashesMatch);

  let verdict = 'UNKNOWN';
  if (product.status === 'REVOKED') {
    verdict = 'REVOKED';
  } else if (!hashesMatch) {
    verdict = 'MISMATCH';
  } else {
    verdict = 'AUTHENTIC';
  }
  console.log("   Final Verdict:        ", verdict);

  if (verdict !== 'AUTHENTIC') {
    throw new Error(`Expected AUTHENTIC verdict for SP-2026-0001, got ${verdict}`);
  }
  console.log("   [PASS] Case A correctly evaluated as AUTHENTIC RECORD.\n");

  // 6. Test Case B: Revoked Batch (SP-2026-0004)
  console.log("6. Testing Case B: Revoked Batch (SP-2026-0004):");
  const rProd = getProductById('SP-2026-0004');
  console.log("   Product Name:   ", rProd.productName);
  console.log("   Product Status: ", rProd.status);
  console.log("   Recall Reason:  ", rProd.revocationReason);
  if (rProd.status !== 'REVOKED') throw new Error("Expected SP-2026-0004 to be REVOKED!");
  console.log("   [PASS] Case B correctly evaluated as REVOKED.\n");

  // 7. Test Case C: Tampered Record Mismatch
  console.log("7. Testing Case C: Tampered Attributes Mismatch:");
  const tamperedProd = { ...product, batchNumber: "COUNTERFEIT-BATCH-99" };
  const tamperedFp = await generateProductFingerprint(tamperedProd);
  const tHashesMatch = tamperedFp.hashHex.toUpperCase() === product.productHash.toUpperCase();
  console.log("   Original Hash: ", product.productHash);
  console.log("   Tampered Hash: ", tamperedFp.hashHex);
  console.log("   Hashes Match:  ", tHashesMatch);
  if (tHashesMatch) throw new Error("Tampered data should NOT match original hash!");
  console.log("   [PASS] Case C correctly detected as MISMATCH.\n");

  // 8. Test Case D: Unregistered Product ID
  console.log("8. Testing Case D: Unregistered ID (SP-2026-9999):");
  const unregProd = getProductById('SP-2026-9999');
  console.log("   Lookup result: ", unregProd);
  if (unregProd !== null) throw new Error("Unregistered ID should return null!");
  console.log("   [PASS] Case D correctly identified as UNREGISTERED.\n");

  console.log("==================================================");
  console.log("ALL QR GENERATION & MOBILE VERIFICATION TESTS PASSED!");
  console.log("==================================================");
}

runComprehensiveQrTest().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
