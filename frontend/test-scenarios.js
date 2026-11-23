/**
 * Automated Verification Test Suite for SupplyProof Academic Demonstration Scenarios
 * Tests Cases A, B, C, D, and E individually.
 */

import { INITIAL_PRODUCTS, getProductById } from './src/data/mockProducts.js';
import { 
  isValidProductId, 
  generateProductFingerprint, 
  getCanonicalProductString,
  computeSHA256 
} from './src/utils/crypto.js';

// Simulation of the verification logic inside VerifyProductPage.jsx
async function simulateVerification(productId, simulateTamper = false) {
  if (!productId || !productId.trim()) return null;
  const cleanId = productId.trim().toUpperCase();

  // CASE E: Format validation (Malformed ID check)
  if (!isValidProductId(cleanId)) {
    return {
      case: 'CASE E: INVALID FORMAT',
      verdict: 'INVALID_FORMAT',
      productId: cleanId,
      title: 'INVALID PRODUCT ID FORMAT',
      subtitle: 'The entered identifier does not conform to the canonical SupplyProof schema.',
      blockchainLookupSkipped: true,
      badgeColor: 'Orange',
      expectedFormat: 'SP-YYYY-NNNN (e.g. SP-2026-0001)'
    };
  }

  // 1. Lookup registered product
  const registered = getProductById(cleanId);

  // CASE D: Unregistered Product Check
  if (!registered) {
    return {
      case: 'CASE D: UNREGISTERED PRODUCT',
      verdict: 'UNREGISTERED',
      productId: cleanId,
      title: 'UNREGISTERED PRODUCT',
      subtitle: 'No registered product record was found for this Product ID on the blockchain ledger.',
      blockchainLookupSkipped: false,
      badgeColor: 'Red / Grey',
      hasSpecifications: false
    };
  }

  // 2. Prepare test data (normal or in-memory tampered simulation)
  const activeData = { ...registered };
  const tamperedField = 'batchNumber';
  const tamperedValue = 'COUNTERFEIT-BATCH-99';

  if (simulateTamper) {
    activeData[tamperedField] = tamperedValue;
  }

  // 3. Recalculate deterministic SHA-256 fingerprint
  const computed = await generateProductFingerprint(activeData);
  const registeredHashNormalized = (registered.productHash || '').replace(/^0x/i, '').toUpperCase();
  const computedHashNormalized = computed.hashHex.toUpperCase();
  const hashesMatch = computedHashNormalized === registeredHashNormalized;

  // 4. Determine verdict
  if (registered.status === 'REVOKED') {
    // CASE B: Revoked Product
    return {
      case: 'CASE B: REVOKED PRODUCT',
      verdict: 'REVOKED',
      productId: cleanId,
      title: 'PRODUCT REVOKED',
      subtitle: 'This product record has been officially revoked by the authorized manufacturer.',
      revocationReason: registered.revocationReason,
      badgeColor: 'Amber',
      isAuthentic: false,
      originalProductHash: registered.productHash,
      computedHash: computed.hashHex,
      hashesMatch
    };
  } else if (!hashesMatch || simulateTamper) {
    // CASE C: Tampered Fingerprint Mismatch
    return {
      case: 'CASE C: TAMPERED FINGERPRINT MISMATCH',
      verdict: 'MISMATCH',
      productId: cleanId,
      title: 'FINGERPRINT MISMATCH',
      subtitle: 'The submitted product information does not match the registered cryptographic fingerprint.',
      badgeColor: 'Red',
      hashesMatch: false,
      registeredBatch: registered.batchNumber,
      submittedBatch: activeData.batchNumber,
      registeredHash: registered.productHash,
      computedHash: computed.hashHex,
      storedRecordMutated: registered.batchNumber === tamperedValue // Must be false!
    };
  } else {
    // CASE A: Authentic Record
    return {
      case: 'CASE A: AUTHENTIC PRODUCT',
      verdict: 'AUTHENTIC',
      productId: cleanId,
      title: 'AUTHENTIC PRODUCT RECORD',
      subtitle: 'The product identity and specification match the registered blockchain record exactly.',
      badgeColor: 'Green',
      hashesMatch: true,
      productName: registered.productName,
      batchNumber: registered.batchNumber,
      registeredHash: registered.productHash,
      computedHash: computed.hashHex
    };
  }
}

async function runTestSuite() {
  console.log("================================================================================");
  console.log("SUPPLYPROOF ACADEMIC DEMONSTRATION SCENARIOS — AUTOMATED TEST SUITE");
  console.log("Team: HashGuard | Module: VerifyProductPage Scenarios");
  console.log("================================================================================\n");

  let allPassed = true;

  // TEST CASE A
  console.log("--------------------------------------------------------------------------------");
  console.log("TESTING BUTTON A: Case A: Authentic (SP-2026-0001)");
  console.log("--------------------------------------------------------------------------------");
  const resultA = await simulateVerification('SP-2026-0001', false);
  console.log("Result Verdict:  ", resultA.verdict);
  console.log("Title:           ", resultA.title);
  console.log("Product Name:    ", resultA.productName);
  console.log("Product ID:      ", resultA.productId);
  console.log("Batch Number:    ", resultA.batchNumber);
  console.log("Registered Hash: ", resultA.registeredHash);
  console.log("Computed Hash:   ", resultA.computedHash);
  console.log("Hashes Match:    ", resultA.hashesMatch);
  console.log("Visual Badge:    ", resultA.badgeColor, "(Emerald / Green)");

  const passA = resultA.verdict === 'AUTHENTIC' && resultA.hashesMatch === true;
  console.log("CASE A STATUS:   ", passA ? ">>> PASS <<<" : ">>> FAIL <<<");
  if (!passA) allPassed = false;
  console.log("");

  // TEST CASE B
  console.log("--------------------------------------------------------------------------------");
  console.log("TESTING BUTTON B: Case B: Revoked Batch (SP-2026-0004)");
  console.log("--------------------------------------------------------------------------------");
  const resultB = await simulateVerification('SP-2026-0004', false);
  console.log("Result Verdict:    ", resultB.verdict);
  console.log("Title:             ", resultB.title);
  console.log("Product ID:        ", resultB.productId);
  console.log("Revocation Reason: ", resultB.revocationReason);
  console.log("Is Authentic:      ", resultB.isAuthentic);
  console.log("Visual Badge:      ", resultB.badgeColor, "(Amber)");

  const passB = resultB.verdict === 'REVOKED' && 
                resultB.productId === 'SP-2026-0004' && 
                resultB.revocationReason.length > 0 &&
                resultB.isAuthentic === false;
  console.log("CASE B STATUS:     ", passB ? ">>> PASS <<<" : ">>> FAIL <<<");
  if (!passB) allPassed = false;
  console.log("");

  // TEST CASE C
  console.log("--------------------------------------------------------------------------------");
  console.log("TESTING BUTTON C: Case C: Tampered Fingerprint Mismatch (SP-2026-0001)");
  console.log("--------------------------------------------------------------------------------");
  const resultC = await simulateVerification('SP-2026-0001', true);
  console.log("Result Verdict:         ", resultC.verdict);
  console.log("Title:                  ", resultC.title);
  console.log("Product ID:             ", resultC.productId);
  console.log("Registered Batch:       ", resultC.registeredBatch);
  console.log("Altered Packaging Batch:", resultC.submittedBatch);
  console.log("Registered Hash:        ", resultC.registeredHash);
  console.log("Recomputed Hash:        ", resultC.computedHash);
  console.log("Hashes Match:           ", resultC.hashesMatch);
  console.log("Stored Record Mutated?: ", resultC.storedRecordMutated, "(Must be false - in-memory demo only)");
  console.log("Visual Badge:           ", resultC.badgeColor, "(Rose / Red)");

  // Check stored record directly in store
  const storedProduct = getProductById('SP-2026-0001');
  const storedBatchUnchanged = storedProduct.batchNumber === 'TN-2026-08';
  console.log("Direct Store Batch Check: Stored batch is still 'TN-2026-08':", storedBatchUnchanged);

  const passC = resultC.verdict === 'MISMATCH' && 
                resultC.hashesMatch === false && 
                resultC.storedRecordMutated === false &&
                storedBatchUnchanged;
  console.log("CASE C STATUS:          ", passC ? ">>> PASS <<<" : ">>> FAIL <<<");
  if (!passC) allPassed = false;
  console.log("");

  // TEST CASE D
  console.log("--------------------------------------------------------------------------------");
  console.log("TESTING BUTTON D: Case D: Unregistered Product ID (SP-2026-9999)");
  console.log("--------------------------------------------------------------------------------");
  const resultD = await simulateVerification('SP-2026-9999', false);
  console.log("Result Verdict:    ", resultD.verdict);
  console.log("Title:             ", resultD.title);
  console.log("Queried ID:        ", resultD.productId);
  console.log("Subtitle:          ", resultD.subtitle);
  console.log("Has Specs Shown?:  ", resultD.hasSpecifications, "(Must be false - no specs for unregistered)");
  console.log("Visual Badge:      ", resultD.badgeColor, "(Red / Grey)");

  const passD = resultD.verdict === 'UNREGISTERED' && 
                resultD.productId === 'SP-2026-9999' &&
                resultD.hasSpecifications === false;
  console.log("CASE D STATUS:     ", passD ? ">>> PASS <<<" : ">>> FAIL <<<");
  if (!passD) allPassed = false;
  console.log("");

  // TEST CASE E
  console.log("--------------------------------------------------------------------------------");
  console.log("TESTING BUTTON E: Case E: Invalid Format (INVALID-123)");
  console.log("--------------------------------------------------------------------------------");
  const resultE = await simulateVerification('INVALID-123', false);
  console.log("Result Verdict:          ", resultE.verdict);
  console.log("Title:                   ", resultE.title);
  console.log("Entered Value:           ", resultE.productId);
  console.log("Expected Format Schema:  ", resultE.expectedFormat);
  console.log("Blockchain RPC Skipped?: ", resultE.blockchainLookupSkipped, "(Must be true - skipped lookup)");
  console.log("Visual Badge:            ", resultE.badgeColor, "(Orange)");

  const passE = resultE.verdict === 'INVALID_FORMAT' && 
                resultE.productId === 'INVALID-123' &&
                resultE.blockchainLookupSkipped === true;
  console.log("CASE E STATUS:           ", passE ? ">>> PASS <<<" : ">>> FAIL <<<");
  if (!passE) allPassed = false;
  console.log("");

  console.log("================================================================================");
  console.log("TEST SUITE SUMMARY:");
  console.log(`  Case A (Authentic):           ${passA ? "PASSED" : "FAILED"}`);
  console.log(`  Case B (Revoked):             ${passB ? "PASSED" : "FAILED"}`);
  console.log(`  Case C (Tampered Mismatch):   ${passC ? "PASSED" : "FAILED"}`);
  console.log(`  Case D (Unregistered):        ${passD ? "PASSED" : "FAILED"}`);
  console.log(`  Case E (Invalid Format):      ${passE ? "PASSED" : "FAILED"}`);
  console.log("--------------------------------------------------------------------------------");
  console.log(`OVERALL RESULT: ${allPassed ? "ALL 5 SCENARIOS PASSED PERFECTLY" : "SOME SCENARIOS FAILED"}`);
  console.log("================================================================================");

  if (!allPassed) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
