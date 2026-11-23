/**
 * SupplyProof Blockchain Service
 * Team: HashGuard
 * 
 * Provides Ethers.js integration with the SupplyProof Solidity Smart Contract.
 * Strict adherence to Academic Honesty:
 *  - Distinguishes real blockchain transactions from demonstration mode.
 *  - Never fabricates fake confirmations, block numbers, or gas fees.
 *  - Handles wallet rejection and unavailable node states gracefully.
 */

import { ethers } from 'ethers';

// Default Hardhat local RPC URL
const LOCAL_RPC_URL = "http://127.0.0.1:8545";

// Default contract address (from deployment script, or environment)
export const DEFAULT_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

let cachedContractInfo = null;

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
    const provider = new ethers.JsonRpcProvider(LOCAL_RPC_URL);
    await provider.getBlockNumber();
    return true;
  } catch {
    return false;
  }
}

/**
 * Request wallet connection via window.ethereum.
 */
export async function connectWallet() {
  if (!isWalletAvailable()) {
    throw new Error("No Web3 wallet detected. Please install MetaMask to interact with the live blockchain.");
  }

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
    let provider;
    if (isWalletAvailable()) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      provider = new ethers.JsonRpcProvider(LOCAL_RPC_URL);
    }

    const contract = new ethers.Contract(artifact.address || DEFAULT_CONTRACT_ADDRESS, artifact.abi, provider);
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
      reason: err.message || "Failed to reach smart contract"
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
    blockNumber: receipt.blockNumber
  };
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
}
