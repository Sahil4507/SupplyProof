# SupplyProof — Blockchain & Smart Contract Layer
**Team: HashGuard | Project: SupplyProof**

This directory contains the Solidity smart contracts, Hardhat test suites, and deployment scripts for **SupplyProof: Blockchain-Based Product Authenticity & Counterfeit Detection**.

## Contracts
- **`contracts/SupplyProof.sol`**:
  - Implements OpenZeppelin `AccessControl` (`DEFAULT_ADMIN_ROLE`, `MANUFACTURER_ROLE`, `INSPECTOR_ROLE`).
  - Stores canonical product identities (`productId`, `productHash`, `productName`, `batchNumber`, `manufacturerName`, `registrationTimestamp`, `status`, `exists`).
  - Implements functions:
    - `registerProduct()`: Restricts product registration to authorized manufacturers; prevents duplicate Product IDs.
    - `getProduct()`: Public view returning complete product record.
    - `verifyProduct()`: Cryptographic on-chain verification comparing registered hash with submitted hash.
    - `revokeProduct()`: Manufacturer/admin product revocation (recalls/defective batches).
    - `transferCustody()`: Supply chain custody tracking between current holders.
    - `recordProductEvent()`: Verified lifecycle milestone logging.
    - `getProductHistory()`: Full chronological event history.
    - `getAllProductIds()` & `getProductCount()`: Registry discovery endpoints.

## Testing & Compilation
```bash
# Compile contracts
npm run compile

# Run interface & ABI test suite
npm run test

# Run live execution test suite (requires local Hardhat node)
npm run test:live

# Deploy to local node and seed demonstration products
npm run deploy
```
