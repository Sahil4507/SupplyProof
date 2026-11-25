import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log("==================================================");
  console.log("TESTING SUPPLYPROOF PRODUCT UNREVOKE / REACTIVATION");
  console.log("==================================================\n");

  const rpcUrl = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const admin = await provider.getSigner(0);
  const manufacturer = await provider.getSigner(1);
  const unauthorizedUser = await provider.getSigner(3);

  const artifactPath = path.join(__dirname, "../frontend/src/contracts/SupplyProofContract.json");
  const contractInfo = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const contract = new ethers.Contract(contractInfo.address, contractInfo.abi, provider);

  const testProdId = "SP-TEST-" + Date.now();
  const testHash = ethers.keccak256(ethers.toUtf8Bytes(testProdId + "|TestUnit|MFG|BATCH|2026|Tech"));

  console.log("STEP 1: Register Product on-chain");
  const txReg = await contract.connect(manufacturer).registerProduct(
    testProdId,
    testHash,
    "Test Unit",
    "Electronics",
    "Test Manufacturer",
    "BATCH-99"
  );
  await txReg.wait();
  console.log("  [PASS] Product registered:", testProdId);

  // Check initial state
  const v1 = await contract.verifyProduct(testProdId, testHash);
  console.log("  Initial Verify -> exists:", v1.exists, "isAuthentic:", v1.isAuthentic, "status:", Number(v1.status));
  if (!v1.isAuthentic || Number(v1.status) !== 0) throw new Error("Initial state is not Active/Authentic");

  console.log("\nSTEP 2: Revoke Product on-chain");
  const txRev = await contract.connect(manufacturer).revokeProduct(testProdId, "Suspected defect in test batch");
  await txRev.wait();
  console.log("  [PASS] Product revoked:", testProdId);

  const v2 = await contract.verifyProduct(testProdId, testHash);
  console.log("  Revoked Verify -> exists:", v2.exists, "isAuthentic:", v2.isAuthentic, "status:", Number(v2.status));
  if (v2.isAuthentic || Number(v2.status) !== 1) throw new Error("Revoked state is not Revoked");

  console.log("\nSTEP 3: Test Access Control - Unauthorized Reactivation Attempt");
  try {
    await contract.connect(unauthorizedUser).reactivateProduct(testProdId, "Malicious attempt");
    throw new Error("Should have reverted for unauthorized caller");
  } catch (err) {
    if (err.message.includes("Unauthorized to reactivate product")) {
      console.log("  [PASS] Unauthorized reactivation correctly reverted with Access Control guard.");
    } else {
      throw err;
    }
  }

  console.log("\nSTEP 4: Reactivate / Unrevoke Product on-chain by Authorized Manufacturer");
  const txReact = await contract.connect(manufacturer).reactivateProduct(
    testProdId,
    "Full inspection cleared. Defect claim resolved and unit restored to active service."
  );
  const rcptReact = await txReact.wait();
  console.log("  [PASS] Product reactivated on-chain, txHash:", rcptReact.hash);

  const v3 = await contract.verifyProduct(testProdId, testHash);
  console.log("  Reactivated Verify -> exists:", v3.exists, "isAuthentic:", v3.isAuthentic, "status:", Number(v3.status));
  if (!v3.isAuthentic || Number(v3.status) !== 0) throw new Error("Reactivated state is not Active/Authentic");

  console.log("\nSTEP 5: Guard against reactivating an already active product");
  try {
    await contract.connect(manufacturer).reactivateProduct(testProdId, "Should fail");
    throw new Error("Should have reverted because product is already active");
  } catch (err) {
    if (err.message.includes("Product is not revoked")) {
      console.log("  [PASS] Guard correctly prevented reactivating an already active product.");
    } else {
      throw err;
    }
  }

  console.log("\nSTEP 6: Audit Trail & Event History Verification");
  const history = await contract.getProductHistory(testProdId);
  console.log(`  Event count: ${history.length}`);
  const eventTypes = history.map(h => h.eventType);
  console.log("  Event timeline:", eventTypes.join(" -> "));
  if (!eventTypes.includes("PRODUCT_REVOKED") || !eventTypes.includes("PRODUCT_REACTIVATED")) {
    throw new Error("Missing revocation or reactivation in on-chain history");
  }
  console.log("  [PASS] Full audit trail is preserved on the immutable ledger (Minted -> Revoked -> Reactivated).");

  console.log("\n==================================================");
  console.log("ALL UNREVOKE / REACTIVATION TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runTests().catch(err => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
