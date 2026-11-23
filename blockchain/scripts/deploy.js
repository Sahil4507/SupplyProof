import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ethers } from "ethers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("==================================================");
  console.log("DEPLOYING SUPPLYPROOF SMART CONTRACT TO LOCAL EVM");
  console.log("Team: HashGuard | Project: SupplyProof");
  console.log("==================================================\n");

  const rpcUrl = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const deployer = await provider.getSigner(0);
  const manufacturer = await provider.getSigner(1);
  const inspector = await provider.getSigner(2);

  const deployerAddress = await deployer.getAddress();
  const manufacturerAddress = await manufacturer.getAddress();
  const inspectorAddress = await inspector.getAddress();

  console.log("Deployer Account:    ", deployerAddress);
  console.log("Manufacturer Account:", manufacturerAddress);
  console.log("Inspector Account:   ", inspectorAddress);

  // Load compiled artifact
  const artifactPath = path.join(__dirname, "../artifacts/contracts/SupplyProof.sol/SupplyProof.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npx hardhat compile' first.`);
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const supplyProof = await factory.deploy();
  await supplyProof.waitForDeployment();

  const contractAddress = await supplyProof.getAddress();
  console.log("\n[PASS] SupplyProof Contract Deployed to:", contractAddress);

  // Setup roles
  const MANUFACTURER_ROLE = await supplyProof.MANUFACTURER_ROLE();
  const INSPECTOR_ROLE = await supplyProof.INSPECTOR_ROLE();

  await (await supplyProof.grantRole(MANUFACTURER_ROLE, manufacturerAddress)).wait();
  console.log(`[PASS] Granted MANUFACTURER_ROLE to: ${manufacturerAddress}`);

  await (await supplyProof.grantRole(INSPECTOR_ROLE, inspectorAddress)).wait();
  console.log(`[PASS] Granted INSPECTOR_ROLE to: ${inspectorAddress}`);

  // Seed initial demo products
  console.log("\nSeeding demonstration products...");

  // 1. SP-2026-0001
  const hash1 = ethers.keccak256(ethers.toUtf8Bytes("SP-2026-0001|SmartWatch X|MFG-TECHNOVA-01|TN-2026-08|2026-08-12|Electronics"));
  await (await supplyProof.connect(manufacturer).registerProduct(
    "SP-2026-0001",
    hash1,
    "SmartWatch X",
    "Electronics",
    "TechNova Industries",
    "TN-2026-08"
  )).wait();
  console.log("  [+] Registered: SP-2026-0001 (SmartWatch X)");

  // 2. SP-2026-0002
  const hash2 = ethers.keccak256(ethers.toUtf8Bytes("SP-2026-0002|AuraSound Pro Wireless Earbuds|MFG-AURADYN-02|AD-2026-02|2026-07-20|Audio"));
  await (await supplyProof.connect(manufacturer).registerProduct(
    "SP-2026-0002",
    hash2,
    "AuraSound Pro Wireless Earbuds",
    "Audio",
    "Aura Dynamics",
    "AD-2026-02"
  )).wait();
  console.log("  [+] Registered: SP-2026-0002 (AuraSound Pro Wireless Earbuds)");

  // 3. SP-2026-0003
  const hash3 = ethers.keccak256(ethers.toUtf8Bytes("SP-2026-0003|AeroDrone 4K Enterprise|MFG-SKYVAN-03|SV-2026-11|2026-05-18|Robotics"));
  await (await supplyProof.connect(manufacturer).registerProduct(
    "SP-2026-0003",
    hash3,
    "AeroDrone 4K Enterprise",
    "Robotics",
    "SkyVanguard Robotics",
    "SV-2026-11"
  )).wait();
  console.log("  [+] Registered: SP-2026-0003 (AeroDrone 4K Enterprise)");

  // 4. SP-2026-0004 (Revoked demo)
  const hash4 = ethers.keccak256(ethers.toUtf8Bytes("SP-2026-0004|BioPulse Smart Ring|MFG-PULSE-04|PH-2025-09|2025-11-04|Healthcare"));
  await (await supplyProof.connect(manufacturer).registerProduct(
    "SP-2026-0004",
    hash4,
    "BioPulse Smart Ring",
    "Healthcare",
    "PulseHealth Labs",
    "PH-2025-09"
  )).wait();
  await (await supplyProof.connect(manufacturer).revokeProduct(
    "SP-2026-0004",
    "Battery batch recall #8821: Potential overheating risk detected."
  )).wait();
  console.log("  [+] Registered & Revoked: SP-2026-0004 (BioPulse Smart Ring - Recall Demo)");

  // Export deployment artifact for frontend
  const frontendContractsDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(frontendContractsDir)) {
    fs.mkdirSync(frontendContractsDir, { recursive: true });
  }

  const exportData = {
    address: contractAddress,
    network: "localhost",
    chainId: 31337,
    deployedAt: new Date().toISOString(),
    deployer: deployerAddress,
    manufacturerRoleHolder: manufacturerAddress,
    inspectorRoleHolder: inspectorAddress,
    abi: artifact.abi
  };

  fs.writeFileSync(
    path.join(frontendContractsDir, "SupplyProofContract.json"),
    JSON.stringify(exportData, null, 2)
  );
  console.log(`\n[PASS] Exported deployment info to: frontend/src/contracts/SupplyProofContract.json`);
  console.log("Deployment and initial state seeding complete.\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
