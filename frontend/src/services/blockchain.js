/**
 * SupplyProof Blockchain Service
 * Team: HashGuard
 * Project: SupplyProof — Blockchain-Based Product Authenticity & Supply Chain Tracking
 * 
 * Provides Ethers.js integration with the SupplyProof Solidity Smart Contract.
 * Strict adherence to Academic Honesty:
 *  - Distinguishes real blockchain transactions from demonstration mode.
 *  - Never fabricates fake confirmations, block numbers, or gas fees.
 *  - Handles wallet rejection and unavailable node states gracefully with clear alerts.
 */

import { ethers } from 'ethers';

// Default Hardhat local RPC URL resolver
export function getRpcUrl() {
  if (typeof window !== 'undefined' && window.location) {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8545`;
    }
  }
  return "http://127.0.0.1:8545";
}
export const LOCAL_RPC_URL = "http://127.0.0.1:8545";

// Fallback contract address if artifact cannot be loaded dynamically
export const DEFAULT_CONTRACT_ADDRESS = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

let cachedContractInfo = null;

/**
 * Load the deployed contract JSON artifact.
 */
export async function getContractArtifact() {
  if (cachedContractInfo) return cachedContractInfo;
  try {
    const response = await import('../contracts/SupplyProofContract.json');
    cachedContractInfo = response.default || response;
    return cachedContractInfo;
  } catch (err) {
    console.warn("SupplyProofContract.json not found. Run 'node scripts/deploy.js' in blockchain folder to export.");
    return null;
  }
}

/**
 * Check if MetaMask or compatible Web3 provider is present in the browser.
 */
export function isWalletAvailable() {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
}

/**
 * Check if local Hardhat RPC node is reachable.
 */
export async function isLocalNodeReachable() {
  try {
    const provider = new ethers.JsonRpcProvider(getRpcUrl());
    await provider.getBlockNumber();
    return true;
  } catch {
    return false;
  }
}

/**
 * Helper to get a read-only contract instance.
 * Checks BrowserProvider first, then falls back to local RPC JsonRpcProvider.
 */
export async function getReadOnlyContract() {
  const artifact = await getContractArtifact();
  if (!artifact) {
    throw new Error("Contract artifact not found. Please compile and deploy the smart contract first.");
  }

  const contractAddress = artifact.address || DEFAULT_CONTRACT_ADDRESS;
  let provider;

  if (isWalletAvailable()) {
    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      // Quick test to see if provider is functional
      await provider.getBlockNumber();
    } catch {
      // Browser provider failed or unconnected, fallback to local RPC
      provider = new ethers.JsonRpcProvider(getRpcUrl());
    }
  } else {
    provider = new ethers.JsonRpcProvider(getRpcUrl());
  }

  return new ethers.Contract(contractAddress, artifact.abi, provider);
}

/**
 * Format blockchain error for user display.
 */
export function parseBlockchainError(err) {
  if (!err) return "Unknown blockchain error occurred.";
  const msg = err.message || String(err);

  if (msg.includes("user rejected") || msg.includes("ACTION_REJECTED") || msg.includes("4001")) {
    return "Transaction was rejected by user in MetaMask.";
  }
  if (msg.includes("Product already registered") || msg.includes("already registered")) {
    return "Product ID is already registered on the blockchain. Duplicate registrations are strictly rejected.";
  }
  if (msg.includes("AccessControl") || msg.includes("lacks role") || msg.includes("Unauthorized")) {
    return "Access Control: Connected wallet does not hold the required MANUFACTURER_ROLE or ADMIN role.";
  }
  if (msg.includes("Product does not exist") || msg.includes("Product does not exist on blockchain")) {
    return "Product ID was not found on the blockchain.";
  }
  if (msg.includes("Product is already revoked") || msg.includes("already revoked")) {
    return "This product has already been marked as revoked / recalled.";
  }
  if (msg.includes("could not detect network") || msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("ECONNREFUSED")) {
    return "Unable to connect to blockchain node (Hardhat RPC http://127.0.0.1:8545). Ensure the local node is running.";
  }
  if (msg.includes("insufficient funds")) {
    return "Insufficient ETH in wallet to pay for transaction gas fees.";
  }
  return msg.length > 150 ? msg.slice(0, 150) + "..." : msg;
}

/**
 * Request wallet connection via window.ethereum.
 */
export async function connectWallet() {
  if (!isWalletAvailable()) {
    throw new Error("No Web3 wallet detected. Please install MetaMask to interact with the live blockchain.");
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts authorized by user.");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    return {
      address: accounts[0],
      signer,
      networkName: network.name,
      chainId: Number(network.chainId)
    };
  } catch (err) {
    throw new Error(parseBlockchainError(err));
  }
}

/**
 * Query a product directly from the smart contract.
 */
export async function getProductOnChain(productId) {
  try {
    const contract = await getReadOnlyContract();
    const data = await contract.getProduct(productId);

    // data: [productId, fingerprintHash, productName, category, manufacturerName, batchNumber, registeredAt, registeredBy, status, revocationReason]
    return {
      success: true,
      product: {
        productId: data[0],
        fingerprintHash: data[1],
        productName: data[2],
        category: data[3],
        manufacturerName: data[4],
        batchNumber: data[5],
        registeredAt: Number(data[6]) * 1000, // convert unix sec to ms
        registeredBy: data[7],
        status: Number(data[8]), // 0: Active, 1: Revoked, 2: Suspended
        revocationReason: data[9]
      }
    };
  } catch (err) {
    return {
      success: false,
      error: parseBlockchainError(err)
    };
  }
}

/**
 * Query all registered Product IDs from the smart contract.
 */
export async function getAllProductIdsOnChain() {
  try {
    const contract = await getReadOnlyContract();
    const ids = await contract.getAllProductIds();
    return {
      success: true,
      ids: Array.from(ids)
    };
  } catch (err) {
    return {
      success: false,
      error: parseBlockchainError(err),
      ids: []
    };
  }
}

/**
 * Query complete lifecycle history audit trail of a product from the smart contract.
 */
export async function getProductHistoryOnChain(productId) {
  try {
    const contract = await getReadOnlyContract();
    const rawEvents = await contract.getProductHistory(productId);

    const history = rawEvents.map(e => ({
      eventType: e.eventType,
      timestamp: Number(e.timestamp) * 1000,
      actor: e.actor,
      details: e.details,
      dataHash: e.dataHash
    }));

    return {
      success: true,
      history
    };
  } catch (err) {
    return {
      success: false,
      error: parseBlockchainError(err),
      history: []
    };
  }
}

/**
 * Verify a product directly through the smart contract.
 */
export async function verifyProductOnChain(productId, submittedHashBytes32) {
  const artifact = await getContractArtifact();
  if (!artifact) {
    return {
      connected: false,
      reason: "Contract ABI artifact not loaded"
    };
  }

  try {
    const contract = await getReadOnlyContract();
    const [exists, isAuthentic, status, registeredHash] = await contract.verifyProduct(productId, submittedHashBytes32);

    return {
      connected: true,
      exists,
      isAuthentic,
      status: Number(status), // 0: Active, 1: Revoked, 2: Suspended
      registeredHash
    };
  } catch (err) {
    return {
      connected: false,
      reason: parseBlockchainError(err)
    };
  }
}

/**
 * Register a product directly on-chain via connected wallet signer.
 */
export async function registerProductOnChain(productData, hashBytes32) {
  if (!isWalletAvailable()) {
    throw new Error("MetaMask is required to sign blockchain transactions.");
  }

  const artifact = await getContractArtifact();
  if (!artifact) {
    throw new Error("SupplyProof contract artifact missing. Deploy smart contract first.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(artifact.address || DEFAULT_CONTRACT_ADDRESS, artifact.abi, signer);

    const tx = await contract.registerProduct(
      productData.productId,
      hashBytes32,
      productData.productName,
      productData.category,
      productData.manufacturerName,
      productData.batchNumber
    );

    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed ? receipt.gasUsed.toString() : null
    };
  } catch (err) {
    throw new Error(parseBlockchainError(err));
  }
}

/**
 * Revoke a product directly on-chain.
 */
export async function revokeProductOnChain(productId, reason) {
  if (!isWalletAvailable()) {
    throw new Error("MetaMask is required to sign revocation transaction.");
  }

  const artifact = await getContractArtifact();
  if (!artifact) {
    throw new Error("SupplyProof contract artifact missing.");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(artifact.address || DEFAULT_CONTRACT_ADDRESS, artifact.abi, signer);

    const tx = await contract.revokeProduct(productId, reason);
    const receipt = await tx.wait();
    return {
      success: true,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (err) {
    throw new Error(parseBlockchainError(err));
  }
}
