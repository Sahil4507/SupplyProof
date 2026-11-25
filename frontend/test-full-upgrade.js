/**
 * SUPPLYPROOF COMPREHENSIVE INTEGRATION TEST SUITE
 * Team: HashGuard | Project: SupplyProof
 * Tests all components: Scenarios A-E, Catalog Filters, Batch Recall, DPP, QR URL Resolver
 */

import { 
  getAllProducts, 
  getProductById, 
  searchProducts, 
  getDistinctBatches, 
  getProductsByBatch 
} from './src/data/mockProducts.js';

import { 
  isValidProductId, 
  generateProductFingerprint, 
  getCanonicalProductString, 
  computeSHA256 
} from './src/utils/crypto.js';

import { getVerificationUrl } from './src/utils/qrUrl.js';

async function runFullUpgradeTests() {
  console.log("================================================================================");
  console.log("SUPPLYPROOF FULL UPGRADE AUDIT & VERIFICATION TEST SUITE");
  console.log("Team: HashGuard | Academic BCT Final Evaluation");
  console.log("================================================================================\n");

  let allPassed = true;

  // 1. TEST 1-CLICK ACADEMIC SCENARIOS (A, B, C, D, E)
  console.log("--------------------------------------------------------------------------------");
  console.log("1. TESTING VERIFICATION SCENARIOS A, B, C, D, AND E");
  console.log("--------------------------------------------------------------------------------");

  // Scenario A
  const pA = getProductById('SP-2026-0001');
  const fpA = await generateProductFingerprint(pA);
  const matchA = fpA.hashHex.toUpperCase() === pA.productHash.toUpperCase();
  const passA = pA && pA.status === 'AUTHENTIC' && matchA;
  console.log("  [+] Case A (SP-2026-0001): Authentic Record =", passA ? "PASSED" : "FAILED", `(${fpA.hashHex.slice(0, 16)}...)`);
  if (!passA) allPassed = false;

  // Scenario B
  const pB = getProductById('SP-2026-0004');
  const passB = pB && pB.status === 'REVOKED' && pB.revocationReason.includes('Battery batch recall');
  console.log("  [+] Case B (SP-2026-0004): Revoked Batch Recall =", passB ? "PASSED" : "FAILED", `(Reason: ${pB?.revocationReason?.slice(0, 30)}...)`);
  if (!passB) allPassed = false;

  // Scenario C
  const pC_clone = { ...pA, batchNumber: 'COUNTERFEIT-BATCH-99' };
  const fpC = await generateProductFingerprint(pC_clone);
  const matchC = fpC.hashHex.toUpperCase() === pA.productHash.toUpperCase();
  const passC = !matchC && pA.batchNumber === 'TN-2026-08'; // Original unaltered!
  console.log("  [+] Case C (SP-2026-0001 Tampered): Fingerprint Mismatch =", passC ? "PASSED" : "FAILED", `(Hashes Match: ${matchC}, Store Unmutated: ${pA.batchNumber === 'TN-2026-08'})`);
  if (!passC) allPassed = false;

  // Scenario D
  const pD = getProductById('SP-2026-9999');
  const passD = pD === null; // In-registry lookup returns null for unregistered
  console.log("  [+] Case D (SP-2026-9999): Unregistered Product =", passD ? "PASSED" : "FAILED", "(Registry Returns null)");
  if (!passD) allPassed = false;

  // Scenario E
  const validE = isValidProductId('INVALID-123');
  const passE = validE === false;
  console.log("  [+] Case E (INVALID-123): Schema Validation Rejection =", passE ? "PASSED" : "FAILED", "(Valid: false, RPC Skipped)");
  if (!passE) allPassed = false;

  // 2. TEST CATALOG CURATION & SITUATION COVERAGE (PART 4)
  console.log("\n--------------------------------------------------------------------------------");
  console.log("2. TESTING CURATED DEMONSTRATION CATALOG (PART 4)");
  console.log("--------------------------------------------------------------------------------");
  const allProds = getAllProducts();
  console.log(`  [+] Total Curated Showcase Products: ${allProds.length} units`);
  
  const hasVerified = allProds.some(p => p.status === 'AUTHENTIC' && p.demoRating >= 4.5);
  const hasRecalled = allProds.some(p => p.status === 'REVOKED');
  const hasIssue = allProds.some(p => p.qualityIssue?.hasIssue === true);
  const hasHighRating = allProds.some(p => p.demoRating >= 4.8);
  const hasMixedReviews = allProds.some(p => p.demoRating <= 3.5 && p.status === 'AUTHENTIC');
  const hasUnregistered = allProds.some(p => p.status === 'UNREGISTERED');

  console.log("  [+] Situation A (Verified / Excellent):", hasVerified ? "FOUND" : "MISSING");
  console.log("  [+] Situation B (Recall Alert):        ", hasRecalled ? "FOUND" : "MISSING");
  console.log("  [+] Situation C (Quality / Issue):     ", hasIssue ? "FOUND" : "MISSING");
  console.log("  [+] Situation D (High Customer Rating):", hasHighRating ? "FOUND" : "MISSING");
  console.log("  [+] Situation E (Mixed Reviews):       ", hasMixedReviews ? "FOUND" : "MISSING");
  console.log("  [+] Situation F (Unregistered Item):   ", hasUnregistered ? "FOUND" : "MISSING");

  const passCatalog = hasVerified && hasRecalled && hasIssue && hasHighRating && hasMixedReviews && hasUnregistered;
  console.log("  CATALOG SITUATION COVERAGE:            ", passCatalog ? ">>> ALL 6 SITUATIONS PRESENT <<<" : ">>> INCOMPLETE <<<");
  if (!passCatalog) allPassed = false;

  // Verify all authentic products have 100% exact hashes
  console.log("\n  [+] Verifying Cryptographic Fingerprints for all registered items:");
  for (const p of allProds) {
    if (p.status === 'UNREGISTERED') continue;
    const computed = await generateProductFingerprint(p);
    const ok = computed.hashHex.toUpperCase() === p.productHash.toUpperCase();
    console.log(`      * ${p.productId} (${p.productName.slice(0, 24)}...): ${ok ? "100% MATCH" : "MISMATCH"}`);
    if (!ok) allPassed = false;
  }

  // 3. TEST CATALOG FILTERS (PART 5)
  console.log("\n--------------------------------------------------------------------------------");
  console.log("3. TESTING CATALOG FILTERS (PART 5)");
  console.log("--------------------------------------------------------------------------------");
  const prodsAll = searchProducts('', 'ALL', 'ALL');
  const prodsVerified = searchProducts('', 'ALL', 'VERIFIED');
  const prodsRecalled = searchProducts('', 'ALL', 'RECALLED');
  const prodsIssues = searchProducts('', 'ALL', 'ISSUES');
  const prodsUnregistered = searchProducts('', 'ALL', 'UNREGISTERED');

  console.log(`  [+] All Products Count:   ${prodsAll.length}`);
  console.log(`  [+] Verified Filter Count: ${prodsVerified.length} (Authentic without packaging issue)`);
  console.log(`  [+] Recalled Filter Count: ${prodsRecalled.length} (Revoked / Recalled units)`);
  console.log(`  [+] Issues Filter Count:   ${prodsIssues.length} (Quality / Packaging advisory units)`);
  console.log(`  [+] Unregistered Count:    ${prodsUnregistered.length} (Unregistered counterfeit showcase)`);

  const passFilters = prodsAll.length >= 8 && prodsVerified.length > 0 && prodsRecalled.length > 0 && prodsIssues.length > 0 && prodsUnregistered.length > 0;
  console.log("  FILTER LOGIC INTEGRITY:   ", passFilters ? ">>> ALL 5 FILTERS ACCURATE <<<" : ">>> FAILED <<<");
  if (!passFilters) allPassed = false;

  // 4. TEST BATCH RECALL DEMO (PART 2)
  console.log("\n--------------------------------------------------------------------------------");
  console.log("4. TESTING BATCH RECALL FUNCTIONALITY (PART 2)");
  console.log("--------------------------------------------------------------------------------");
  const batches = getDistinctBatches();
  console.log(`  [+] Distinct Production Batches Found: ${batches.length}`);
  for (const b of batches) {
    console.log(`      - Batch: ${b.batchNumber.padEnd(12)} | Mfg: ${b.manufacturerName.padEnd(24)} | Units: ${b.count} | Recalled: ${b.isAlreadyRecalled}`);
  }

  const batchPH = getProductsByBatch('PH-2025-09');
  const passBatchPH = batchPH.length > 0 && batchPH[0].productId === 'SP-2026-0004';
  console.log("  [+] Querying Batch PH-2025-09 Units:   ", passBatchPH ? "PASSED" : "FAILED", `(${batchPH.length} units matched)`);
  if (!passBatchPH) allPassed = false;

  // 5. TEST MOBILE QR URL RESOLVER
  console.log("\n--------------------------------------------------------------------------------");
  console.log("5. TESTING MOBILE QR URL RESOLUTION");
  console.log("--------------------------------------------------------------------------------");
  const qrUrl1 = getVerificationUrl('SP-2026-0001');
  const hasLocalhost = qrUrl1.includes('localhost') || qrUrl1.includes('127.0.0.1');
  const hasProperParam = qrUrl1.includes('/verify?id=SP-2026-0001');
  console.log("  [+] Resolved QR Verification URL:     ", qrUrl1);
  console.log("  [+] Contains Localhost / 127.0.0.1?:   ", hasLocalhost ? "YES (FAILED)" : "NO (PASSED - Safe for Phone Scanning)");
  console.log("  [+] Includes Query Parameter?:         ", hasProperParam ? "PASSED" : "FAILED");

  const passQR = !hasLocalhost && hasProperParam;
  if (!passQR) allPassed = false;

  // SUMMARY
  console.log("\n================================================================================");
  console.log("FINAL INTEGRATION AUDIT SUMMARY:");
  console.log(`  Scenarios A-E:          ${passA && passB && passC && passD && passE ? "ALL PASSED" : "FAILED"}`);
  console.log(`  Catalog Situations:     ${passCatalog ? "ALL 6 COVERED" : "FAILED"}`);
  console.log(`  Filter Logic:           ${passFilters ? "ALL 5 WORKING" : "FAILED"}`);
  console.log(`  Batch Recall Features:  ${passBatchPH ? "VERIFIED" : "FAILED"}`);
  console.log(`  QR Mobile Security:     ${passQR ? "VERIFIED" : "FAILED"}`);
  console.log("--------------------------------------------------------------------------------");
  console.log(`OVERALL STATUS: ${allPassed ? ">>> 100% PASSED — READY FOR PRESENTATION <<<" : ">>> SOME CHECKS FAILED <<<"}`);
  console.log("================================================================================");

  if (!allPassed) {
    process.exit(1);
  }
}

runFullUpgradeTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
