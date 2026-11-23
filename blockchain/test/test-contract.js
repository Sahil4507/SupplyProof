import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runInterfaceTests() {
  console.log("==================================================");
  console.log("SUPPLYPROOF SMART CONTRACT INTERFACE TEST SUITE");
  console.log("Team: HashGuard | Project: SupplyProof");
  console.log("==================================================\n");

  const artifactPath = path.join(__dirname, '../artifacts/contracts/SupplyProof.sol/SupplyProof.json');
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Artifact not found at ${artifactPath}. Run 'npx hardhat compile' first.`);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const { abi, bytecode } = artifact;

  console.log("1. Artifact Loaded Successfully.");
  console.log(`   Contract Name: SupplyProof`);
  console.log(`   ABI Functions: ${abi.filter(item => item.type === 'function').length} functions`);
  console.log(`   ABI Events:    ${abi.filter(item => item.type === 'event').length} events`);
  console.log(`   Bytecode Size: ${(bytecode.length / 2).toFixed(0)} bytes\n`);

  // Verify function interfaces required by prompt
  const requiredFunctions = [
    'registerProduct',
    'getProduct',
    'verifyProduct',
    'revokeProduct',
    'transferCustody',
    'recordProductEvent',
    'getProductHistory',
    'getAllProductIds',
    'getProductCount',
    'hasRole'
  ];

  const contractFunctionNames = abi.filter(item => item.type === 'function').map(f => f.name);

  console.log("2. Verifying Required Smart Contract Functions:");
  let missing = false;
  for (const fn of requiredFunctions) {
    if (contractFunctionNames.includes(fn)) {
      console.log(`   [PASS] Function '${fn}()' is defined in contract ABI`);
    } else {
      console.log(`   [FAIL] Missing required function: '${fn}()'`);
      missing = true;
    }
  }

  const requiredEvents = [
    'ProductRegistered',
    'ProductRevoked',
    'CustodyTransferred',
    'ProductEventRecorded'
  ];

  const contractEventNames = abi.filter(item => item.type === 'event').map(e => e.name);
  console.log("\n3. Verifying Smart Contract Events:");
  for (const ev of requiredEvents) {
    if (contractEventNames.includes(ev)) {
      console.log(`   [PASS] Event '${ev}' is defined in contract ABI`);
    } else {
      console.log(`   [FAIL] Missing required event: '${ev}'`);
      missing = true;
    }
  }

  if (missing) {
    throw new Error("Contract interface does not meet requirements.");
  }

  console.log("\n==================================================");
  console.log("SUPPLYPROOF INTERFACE VERIFICATION: ALL PASSED");
  console.log("==================================================");
}

runInterfaceTests().catch(err => {
  console.error("Interface test failed:", err);
  process.exit(1);
});
