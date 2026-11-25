import { getProductById, revokeProductRecord, reactivateProductRecord } from "./frontend/src/data/mockProducts.js";

console.log("==================================================");
console.log("TESTING FRONTEND MOCK STORE UNREVOKE FLOW");
console.log("==================================================\n");

// Test with SP-2026-0001
const prodId = "SP-2026-0001";
const initial = getProductById(prodId);
console.log("Initial status of", prodId, ":", initial.status);

// Revoke
console.log("\nRevoking", prodId, "...");
revokeProductRecord(prodId, "Test Revocation for inspection");
const revoked = getProductById(prodId);
console.log("After revocation status:", revoked.status);
console.log("Revocation reason:", revoked.revocationReason);
console.log("Latest event:", revoked.events[0].eventType, "-", revoked.events[0].title);

if (revoked.status !== "REVOKED") throw new Error("Revocation failed");

// Unrevoke
console.log("\nUnrevoking", prodId, "...");
reactivateProductRecord(prodId, "Batch inspection cleared. Unit restored to Active status.");
const unrevoked = getProductById(prodId);
console.log("After unrevocation status:", unrevoked.status);
console.log("Revocation reason cleared:", unrevoked.revocationReason === null);
console.log("Recall info cleared:", unrevoked.recallInfo === null);
console.log("Latest event:", unrevoked.events[0].eventType, "-", unrevoked.events[0].title);
console.log("Previous event in history preserved:", unrevoked.events[1].eventType);

if (unrevoked.status !== "AUTHENTIC") throw new Error("Unrevocation failed to restore status to AUTHENTIC");
if (unrevoked.events[0].eventType !== "PRODUCT_REACTIVATED") throw new Error("Missing PRODUCT_REACTIVATED event");
if (unrevoked.events[1].eventType !== "PRODUCT_REVOKED") throw new Error("Lost PRODUCT_REVOKED event in history");

console.log("\n[PASS] Frontend mock store unrevoke & history preservation test passed!\n");
