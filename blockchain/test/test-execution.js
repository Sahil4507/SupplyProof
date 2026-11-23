import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runExecutionTests() {
  console.log("==================================================");
  console.log("SUPPLYPROOF IN-PROCESS EVM EXECUTION TEST SUITE");
  console.log("Team: HashGuard | Project: SupplyProof");
  console.log("==================================================\n");

  const rpcUrl = "http://127.0.0.1:8545";
  console.log(`Connecting to JSON-RPC Provider: ${rpcUrl}...`);
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Use provider signers backed by Hardhat's unlocked accounts
  const adminSigner = await provider.getSigner(0);
  const manufacturerSigner = await provider.getSigner(1);
  const unauthorizedSigner = await provider.getSigner(2);

  console.log(`Admin Signer:        ${await adminSigner.getAddress()}`);
  console.log(`Manufacturer Signer: ${await manufacturerSigner.getAddress()}`);
  console.log(`Unauthorized Signer: ${await unauthorizedSigner.getAddress()}\n`);

  // Load contract artifact
  const artifactPath = path.join(__dirname, '../artifacts/contracts/SupplyProof.sol/SupplyProof.json');
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npx hardhat compile' first.`);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // 1. Deploy Contract
  console.log("1. Deploying SupplyProof Smart Contract...");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, adminSigner);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();
  console.log(`   [PASS] SupplyProof deployed at: ${contractAddress}`);

  // 2. Grant Roles
  console.log("\n2. Configuring Role-Based Access Control (RBAC)...");
  const MANUFACTURER_ROLE = await contract.MANUFACTURER_ROLE();
  const grantTx = await contract.grantRole(MANUFACTURER_ROLE, await manufacturerSigner.getAddress());
  await grantTx.wait();
  const hasRole = await contract.hasRole(MANUFACTURER_ROLE, await manufacturerSigner.getAddress());
  console.log(`   [PASS] Manufacturer role granted: ${hasRole}`);

  // 3. Register Product with Authorized Manufacturer
  console.log("\n3. Testing Product Registration by Authorized Manufacturer...");
  const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("SP-2026-TEST-01|SmartWatch X|MFG-TECHNOVA-01|TN-2026-08|2026-08-12|Electronics"));
  const regTx = await contract.connect(manufacturerSigner).registerProduct(
    "SP-2026-TEST-01",
    sampleHash,
    "SmartWatch X",
    "Electronics",
    "TechNova Industries",
    "TN-2026-08"
  );
  const regReceipt = await regTx.wait();
  console.log(`   [PASS] Product registered in block #${regReceipt.blockNumber} (Tx: ${regReceipt.hash})`);

  // 4. Duplicate Product ID Rejection
  console.log("\n4. Testing Duplicate Product ID Rejection...");
  try {
    const dupTx = await contract.connect(manufacturerSigner).registerProduct(
      "SP-2026-TEST-01",
      sampleHash,
      "Duplicate SmartWatch",
      "Electronics",
      "TechNova Industries",
      "TN-2026-08"
    );
    await dupTx.wait();
    throw new Error("Duplicate Product ID was not rejected!");
  } catch (err) {
    const isReverted = err.message.includes("already registered") || err.message.includes("revert") || err.message.includes("execution reverted");
    if (!isReverted) throw err;
    console.log("   [PASS] Duplicate Product ID successfully rejected by contract require check.");
  }

  // 5. Unauthorized Registration Rejection
  console.log("\n5. Testing Unauthorized Registration Rejection...");
  try {
    const unauthTx = await contract.connect(unauthorizedSigner).registerProduct(
      "SP-2026-TEST-99",
      sampleHash,
      "Unauthorized Item",
      "Audio",
      "Fake Corp",
      "FK-001"
    );
    await unauthTx.wait();
    throw new Error("Unauthorized caller was not rejected!");
  } catch (err) {
    const isAccessDenied = err.message.includes("AccessControl") || err.message.includes("revert") || err.message.includes("execution reverted");
    if (!isAccessDenied) throw err;
    console.log("   [PASS] Unauthorized registration rejected by AccessControl.");
  }

  // 6. Verification with Genuine Matching Fingerprint
  console.log("\n6. Testing Verification: Genuine Matching Fingerprint (AUTHENTIC)...");
  const [exists, isAuthentic, status, registeredHash] = await contract.verifyProduct("SP-2026-TEST-01", sampleHash);
  console.log(`   [PASS] Verification query: exists=${exists}, isAuthentic=${isAuthentic}, status=${status}`);
  if (!exists || !isAuthentic || status !== 0n) {
    throw new Error("Expected product to be Authentic with status Active (0)!");
  }

  // 7. Verification with Tampered / Mismatched Fingerprint
  console.log("\n7. Testing Verification: Tampered / Mismatched Fingerprint (MISMATCH)...");
  const tamperedHash = ethers.keccak256(ethers.toUtf8Bytes("TAMPERED_CANONICAL_DATA"));
  const [mExists, mAuthentic, mStatus] = await contract.verifyProduct("SP-2026-TEST-01", tamperedHash);
  console.log(`   [PASS] Mismatch query: exists=${mExists}, isAuthentic=${mAuthentic}, status=${mStatus}`);
  if (!mExists || mAuthentic) {
    throw new Error("Tampered hash should NOT be verified as authentic!");
  }

  // 8. Verification of Non-Existent Product ID (UNREGISTERED)
  console.log("\n8. Testing Verification: Non-Existent Product (UNREGISTERED)...");
  const [uExists, uAuthentic] = await contract.verifyProduct("SP-UNKNOWN-ID", sampleHash);
  console.log(`   [PASS] Unknown product query: exists=${uExists}, isAuthentic=${uAuthentic}`);
  if (uExists || uAuthentic) {
    throw new Error("Unknown product should return exists=false!");
  }

  // 9. Unauthorized Revocation Rejection
  console.log("\n9. Testing Unauthorized Product Revocation Rejection...");
  try {
    const unRevokeTx = await contract.connect(unauthorizedSigner).revokeProduct(
      "SP-2026-TEST-01",
      "Unauthorized revocation attempt"
    );
    await unRevokeTx.wait();
    throw new Error("Unauthorized revocation was not rejected!");
  } catch (err) {
    const isDenied = err.message.includes("Unauthorized") || err.message.includes("revert") || err.message.includes("execution reverted") || err.message.includes("AccessControl");
    if (!isDenied) throw err;
    console.log("   [PASS] Unauthorized revocation rejected by contract.");
  }

  // 10. Authorized Product Revocation
  console.log("\n10. Testing Authorized Product Revocation by Manufacturer...");
  const revokeTx = await contract.connect(manufacturerSigner).revokeProduct(
    "SP-2026-TEST-01",
    "Recall #8821: Battery overheating hazard"
  );
  await revokeTx.wait();
  console.log("   [PASS] Product revocation confirmed on-chain.");

  // 11. Verification of Revoked Product (REVOKED)
  console.log("\n11. Testing Verification of Revoked Product...");
  const [rExists, rAuthentic, rStatus] = await contract.verifyProduct("SP-2026-TEST-01", sampleHash);
  console.log(`   [PASS] Post-revocation query: exists=${rExists}, isAuthentic=${rAuthentic}, status=${rStatus} (1=Revoked)`);
  if (!rExists || rAuthentic || rStatus !== 1n) {
    throw new Error("Expected revoked product to have status=1 and isAuthentic=false!");
  }

  // 12. Lifecycle History Audit Trail
  console.log("\n12. Testing Lifecycle History Audit Trail...");
  const history = await contract.getProductHistory("SP-2026-TEST-01");
  console.log(`   [PASS] Retrieved ${history.length} historical events:`);
  history.forEach((ev, idx) => {
    console.log(`     [Event ${idx + 1}] ${ev.eventType} - ${ev.details} (Actor: ${ev.actor})`);
  });
  if (history.length < 2) {
    throw new Error("Expected at least 2 events in product history (Registered + Revoked)!");
  }

  console.log("\n==================================================");
  console.log("ALL 12 LIVE EVM EXECUTION TESTS PASSED!");
  console.log("==================================================");
}

runExecutionTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
