# SupplyProof 🛡️📦

**Blockchain-Based Product Authenticity & Supply Chain Tracking**  
*An Academic Capstone Project for Blockchain Technology (BCT)*

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-Contracts%205.x-4E5EE4?logo=openzeppelin)](https://openzeppelin.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-3.x-FFF100?logo=ethereum)](https://hardhat.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 1. Project Title
**SupplyProof: Blockchain-Based Product Authenticity & Counterfeit Detection Platform**

---

## 2. Team Name
**Team HashGuard**  
*Department of Computer Science & Engineering / Information Technology*  
*Academic Capstone Project in Blockchain Technology (BCT)*

---

## 3. Introduction
**SupplyProof** is a decentralized product identity management and counterfeit detection platform developed by **Team HashGuard**.

In global commerce, fraudulent goods, uncertified spare parts, forged warranty certificates, and unauthorized grey-market replicas impose billions of dollars in losses and create dangerous consumer safety hazards. Traditional centralized verification portals and hologram stickers are routinely compromised, cloned, or fabricated.

SupplyProof replaces centralized trust with an immutable, cryptographically verifiable architecture:
- Every genuine manufactured unit is assigned a permanent, unique **Product ID** (e.g., `SP-2026-0001`).
- The manufacturer normalizes canonical product attributes and generates a deterministic **SHA-256 cryptographic fingerprint**.
- The fingerprint and unit metadata are permanently committed to an Ethereum EVM smart contract (`SupplyProof.sol`) via role-based access control.
- Consumers, customs officials, and retail inspectors can instantly scan a QR code or enter a Product ID to receive a mathematically proven verification verdict.

---

## 4. Problem Statement
The pre-retail and consumer markets suffer from acute information asymmetry and counterfeiting fraud:

1. **Rampant Global Counterfeiting**: The OECD estimates the international trade in counterfeit goods exceeds **$500 billion annually**.
2. **Fragility of Physical Anti-Counterfeit Labels**: Hologram stickers, QR labels, and paper certificates of authenticity can be easily duplicated or applied onto fake packaging.
3. **Siloed & Alterable Databases**: Centralized manufacturer databases are susceptible to internal tampering, database corruption, or unauthorized modification.
4. **Unenforceable Recalls**: When a manufacturer recalls a hazardous batch (e.g. exploding lithium batteries), secondary market buyers have no real-time way to know if a specific serial number has been revoked.
5. **No Independent Public Auditability**: Ordinary buyers have no way to independently verify factory origin without relying blindly on seller claims.

---

## 5. Objectives
- **Unique Digital Identity**: Assign a tamper-resistant, collision-free Product ID to every manufactured item.
- **Deterministic Fingerprinting**: Employ browser-native SHA-256 cryptographic hashing to freeze canonical product attributes.
- **Smart Contract Access Control**: Restrict item creation to verified manufacturer nodes (`MANUFACTURER_ROLE`) using OpenZeppelin `AccessControl`.
- **Public Zero-Account Verification**: Allow anyone to verify product authenticity, batch provenance, and revocation status using a web browser or QR code without requiring cryptocurrency or wallet software.
- **Active Revocation Mechanism**: Enable authorized manufacturers to flag compromised, defective, or cloned batches directly on-chain.
- **Clear Differentiation**: Focus on product identity and counterfeit detection rather than generic, complex logistics tracking.

---

## 6. Proposed Solution
SupplyProof establishes a decentralized chain of trust:

```text
MANUFACTURER (Authorized Node)
           ↓
   Input Product Attributes
           ↓
   Canonical Normalization & SHA-256 Fingerprinting
           ↓
   Commit to Solidity Smart Contract (SupplyProof.sol)
           ↓
   Immutable Ledger Anchored on Ethereum / Hardhat EVM
           ↓
   Generate Verification QR Code / Serial Card
           ↓
   CONSUMER / INSPECTOR SCANS QR
           ↓
   Client Recalculates SHA-256 from Product Data
           ↓
   Smart Contract Audit: Computed Hash === Registered Hash
           ↓
   VERDICT: AUTHENTIC / UNREGISTERED / MISMATCH / REVOKED
```

---

## 7. Core Features
1. **Manufacturer Registration Portal**: Clean form interface to register units with automated unique ID generation (`SP-2026-XXXX`).
2. **Real-Time SHA-256 Fingerprinting**: Generates and visualizes the cryptographic hash live as product fields are typed.
3. **Smart Contract Role-Based Security**: Built with OpenZeppelin `AccessControl` (`MANUFACTURER_ROLE`, `INSPECTOR_ROLE`).
4. **Public Verification Hub**: Search by Product ID or QR code URL with comprehensive status analysis.
5. **Clear 5-State Verification System**:
   - `AUTHENTIC`: Unit exists on-chain, status is active, and cryptographic fingerprint matches 100%.
   - `UNREGISTERED`: No matching Product ID found in the smart contract registry.
   - `RECORD MISMATCH`: Product data has been modified post-registration (digest does not match).
   - `REVOKED`: Product was officially revoked or recalled by the manufacturer.
   - `SUSPICIOUS`: Inconsistent lifecycle history or duplicate identity claims.
6. **Pure JavaScript Offline QR Code Generator**: Zero external CDN or network dependencies; renders vector SVGs directly in browser.
7. **Manufacturer Revocation Tool**: Authorized nodes can revoke defective or recalled items with on-chain reasons.
8. **Chronological Event Provenance**: Tracks factory registration, quality inspections, and custody handovers.
9. **Academic Honesty Architecture**: Prominently highlights the physical cloning limitation and defense-in-depth requirements.

---

## 8. Product Registration Workflow
1. An authorized manufacturer accesses `/register`.
2. The manufacturer enters Product Name, Category, Batch Number, Manufacturing Date, and Description.
3. The system generates a collision-resistant Product ID (`SP-2026-XXXX`).
4. Canonical product attributes are concatenated:
   `productId|productName|manufacturerId|batchNumber|manufacturingDate|category`
5. The browser computes the SHA-256 hash using the native Web Cryptography API (`window.crypto.subtle`).
6. The manufacturer submits the transaction via MetaMask or simulated local node signer.
7. The smart contract validates the caller's role, ensures `productId` is not already registered, stores the record, emits `ProductRegistered`, and records the initial lifecycle milestone.
8. The UI generates a printable QR code linking to `/verify?id=SP-2026-XXXX`.

---

## 9. Product Verification Workflow
1. A consumer or inspector scans the QR code or navigates to `/verify?id=...`.
2. The verification engine queries the product record from the blockchain.
3. **Existence Check**: If `exists == false`, the engine immediately displays **UNREGISTERED PRODUCT** (Red).
4. **Revocation Check**: If `status == Revoked`, the engine displays **PRODUCT REVOKED** (Orange) with the manufacturer recall notice.
5. **Fingerprint Audit**: The client recalculates the SHA-256 digest from the product's canonical attributes and compares it to `registeredHash`.
6. **Integrity Verdict**:
   - If hashes match: **AUTHENTIC PRODUCT RECORD** (Green).
   - If hashes differ: **RECORD MISMATCH DETECTED** (Red).
7. The complete lifecycle event history and blockchain transaction details are rendered.

---

## 10. System Architecture

```text
+----------------------------------------------------------------------------------+
|                                CONSUMER / INSPECTOR                              |
|                         (Browser / QR Scanner / Mobile)                          |
+----------------------------------------+-----------------------------------------+
                                         |
                                         | Public Query (Product ID)
                                         v
+----------------------------------------------------------------------------------+
|                            SUPPLYPROOF REACT FRONTEND                            |
|             (Vite, Tailwind CSS, Lucide Icons, Pure SVG QR Generator)            |
+-------------------+------------------------------------+---------------------+
                    |                                    |
                    | Local SHA-256 Fingerprint          | Web3 Provider / RPC
                    v                                    v
+----------------------------------------+   +-------------------------------------+
|        WEB CRYPTOGRAPHY ENGINE         |   |          ETHERS.JS V6               |
|      (window.crypto.subtle)            |   |   (Signer, Contract Interface)      |
+----------------------------------------+   +-------------------+-----------------+
                                                                 |
                                                                 v
                                             +-------------------------------------+
                                             |       HARDHAT EVM / SEPOLIA         |
                                             |     (SupplyProof.sol Contract)      |
                                             +-------------------+-----------------+
                                                                 |
                                 +-------------------------------+-------------------------------+
                                 |                                                               |
                                 v                                                               v
                  +------------------------------+                               +-------------------------------+
                  |       ON-CHAIN LEDGER        |                               |       OFF-CHAIN STORAGE       |
                  | - Product ID & Status        |                               | - High-Res Product Photos     |
                  | - 32-Byte SHA-256 Digest     | <=== Hash Verification ===>   | - Detailed User Manuals       |
                  | - Manufacturer Address       |                               | - MongoDB Metadata Index      |
                  | - Batch Number & Milestones  |                               | - Search & Analytics Cache    |
                  +------------------------------+                               +-------------------------------+
```

---

## 11. Smart Contract Architecture
The contract `SupplyProof.sol` is written in Solidity `0.8.20` and inherits OpenZeppelin's audited `AccessControl`:

- **`DEFAULT_ADMIN_ROLE`**: Can grant and revoke manufacturer and inspector roles.
- **`MANUFACTURER_ROLE`**: Can call `registerProduct()` and `revokeProduct()` for their own items.
- **`INSPECTOR_ROLE`**: Can record quality inspection events via `recordProductEvent()`.
- **Public (No Role Required)**: Anyone can call `getProduct()`, `verifyProduct()`, `getProductHistory()`, and `getAllProductIds()`.

---

## 12. SHA-256 Fingerprinting
To avoid hash volatility due to whitespace or display formatting, SupplyProof applies **canonical normalization**:

```javascript
// Canonical Normalization
const canonicalString = `${productId}|${productName}|${manufacturerId}|${batchNumber}|${manufacturingDate}|${category}`;

// Browser-Native SHA-256 Calculation
const encoder = new TextEncoder();
const data = encoder.encode(canonicalString);
const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
const hashHex = Array.from(new Uint8Array(hashBuffer))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('')
  .toUpperCase();
```

If a counterfeit packager alters even a single character in the batch number (e.g. from `TN-2026-08` to `TN-2026-09`), the cryptographic avalanche effect alters the entire 64-character hex hash, instantly triggering a **RECORD MISMATCH** verdict.

---

## 13. On-Chain vs Off-Chain Storage

| Data Point | Storage Layer | Technical & Economic Rationale |
| :--- | :---: | :--- |
| **Product ID (`string`)** | **On-Chain** | Immutable global index for public lookup. |
| **SHA-256 Fingerprint (`bytes32`)** | **On-Chain** | 32-byte fixed cryptographic proof; minimal gas overhead. |
| **Manufacturer Address (`address`)** | **On-Chain** | Cryptographic proof of origin and non-repudiation. |
| **Product Status (`enum`)** | **On-Chain** | Real-time revocation state (`Active`, `Revoked`, `Suspended`). |
| **Lifecycle Milestones (`struct[]`)** | **On-Chain** | Tamper-proof audit trail of factory handovers. |
| **Product Photography & CAD Assets** | **Off-Chain** | High-bandwidth binary files stored in IPFS or web cloud. |
| **Multi-Language User Manuals** | **Off-Chain** | Large text documents not required for on-chain consensus. |
| **Local Search Index** | **Off-Chain** | Fast fuzzy searching and category filters. |

---

## 14. Technology Stack
- **Smart Contract Language**: Solidity `^0.8.20`
- **Security Framework**: OpenZeppelin Contracts `v5.6.1` (`AccessControl`)
- **Ethereum Development Suite**: Hardhat `v3.17.0` (ESM module format)
- **Web3 Client Library**: Ethers.js `v6.16.0`
- **Frontend Framework**: React 19 + Vite 8
- **Routing**: React Router DOM `v7.18.4`
- **Styling**: Tailwind CSS `v3.4.17`
- **Icons**: Lucide React
- **Cryptography**: Browser-Native Web Cryptography API (`crypto.subtle`)
- **QR Generation**: Pure JavaScript standalone vector SVG generator
- **Deployment Target**: Vercel SPA (`Root Directory: frontend`, `Build: npm run build`, `Output: dist`)

---

## 15. Project Structure

```text
bikechain/                           # Project Root
├── blockchain/                      # Solidity Smart Contracts & Hardhat Suite
│   ├── contracts/
│   │   └── SupplyProof.sol          # Core smart contract with RBAC & verification
│   ├── scripts/
│   │   └── deploy.js                # Deployment script & demo state seeder
│   ├── test/
│   │   ├── test-contract.js         # Interface & ABI function test suite
│   │   └── test-execution.js        # Live EVM transaction execution test suite
│   ├── hardhat.config.js            # Hardhat configuration (Solidity 0.8.20 viaIR)
│   ├── package.json                 # Blockchain package scripts & dependencies
│   └── README.md                    # Blockchain documentation
│
├── frontend/                        # Web Application (React 19 + Vite + Tailwind)
│   ├── src/
│   │   ├── components/              # Navbar, Footer, StatusBadge, ProductCard, WalletModal
│   │   ├── contracts/               # SupplyProofContract.json (Exported ABI & Address)
│   │   ├── data/
│   │   │   └── mockProducts.js      # Curated demonstration product registry
│   │   ├── hooks/                   # ThemeContext & useTheme (Dark/Light mode)
│   │   ├── layouts/                 # RootLayout (Navbar + Outlet + Footer)
│   │   ├── pages/                   # Home, Register, Verify, Products, ProductDetails, About, 404
│   │   ├── services/                # blockchain.js (Ethers.js integration & RPC)
│   │   ├── utils/                   # crypto.js (SHA-256), qr.js (SVG QR), formatters.js
│   │   ├── App.jsx                  # React Router configuration
│   │   ├── main.jsx                 # React root DOM mount
│   │   └── index.css                # Tailwind directives
│   ├── index.html                   # HTML entry point with zero-FOUC theme script
│   ├── tailwind.config.js           # Design tokens (Tech Blue, Emerald, Slate)
│   ├── vercel.json                  # Vercel SPA rewrite rules
│   ├── vite.config.js               # Vite bundler configuration
│   └── package.json                 # Frontend dependencies
│
├── backend/                         # Backend API Architecture (Phase 2 Roadmap)
│   └── README.md
│
├── .gitignore                       # Node modules, build outputs, and secrets ignored
├── package.json                     # Root orchestrator scripts
├── LICENSE                          # MIT License
└── README.md                        # Project documentation (Team HashGuard)
```

---

## 16. Smart Contract Functions

| Function Name | Visibility | Access Control | Purpose |
| :--- | :---: | :---: | :--- |
| `registerProduct(...)` | `external` | `MANUFACTURER_ROLE` | Registers a new product ID, validates uniqueness, anchors SHA-256 fingerprint, emits `ProductRegistered`. |
| `getProduct(productId)` | `external view` | Public | Returns complete `Product` struct for global lookup. |
| `verifyProduct(productId, submittedHash)` | `external view` | Public | Compares submitted hash with on-chain digest; returns `(exists, isAuthentic, status, registeredHash)`. |
| `revokeProduct(productId, reason)` | `external` | Manufacturer or Admin | Updates status to `Revoked`, records reason in audit trail, emits `ProductRevoked`. |
| `transferCustody(productId, newHolder, notes)` | `external` | Current Holder or Admin | Transfers item custody to a new address, emits `CustodyTransferred`. |
| `recordProductEvent(productId, eventType, details)` | `external` | Manufacturer, Inspector, Admin | Logs verified milestone (e.g. quality test, retail intake), emits `ProductEventRecorded`. |
| `getProductHistory(productId)` | `external view` | Public | Returns chronological array of `ProductEvent` structs. |
| `getAllProductIds()` | `external view` | Public | Returns array of all registered product IDs for discovery. |
| `getProductCount()` | `external view` | Public | Returns total count of registered products. |

---

## 17. Installation Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **Git**

```bash
# Clone the repository
git clone https://github.com/Sahil4507/Bikechain.git
cd Bikechain

# Install frontend dependencies
cd frontend
npm install

# Install blockchain dependencies
cd ../blockchain
npm install
```

---

## 18. Running the Backend
The backend architecture is currently organized in `backend/README.md`. Because SupplyProof uses a client-side Web Cryptography engine and direct JSON-RPC smart contract communication, a separate backend server is not required to run the application.

---

## 19. Running Hardhat
To run a local Ethereum EVM node for testing and contract deployment:

```bash
cd blockchain
npx hardhat node
```
This starts a local JSON-RPC server on `http://127.0.0.1:8545` with 20 pre-funded test accounts.

---

## 20. Deploying the Smart Contract
In a separate terminal window:

```bash
cd blockchain
npm run deploy
```
This script:
1. Deploys `SupplyProof.sol` to the local network.
2. Grants `MANUFACTURER_ROLE` and `INSPECTOR_ROLE` to designated accounts.
3. Seeds initial demonstration products (`SP-2026-0001` through `SP-2026-0004`).
4. Automatically exports the contract address and ABI to `frontend/src/contracts/SupplyProofContract.json`.

---

## 21. Running the Frontend
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 22. Testing

### A. Smart Contract Interface & ABI Tests
```bash
cd blockchain
npm run test
```
*Expected Result:*
- All 18 ABI functions verified.
- All 7 contract events verified.
- Bytecode size verified.

### B. Live Contract Execution Tests (with running node)
```bash
cd blockchain
npm run test:live
```
*Expected Result:*
- Product registration test passed.
- Duplicate Product ID rejection test passed.
- Unauthorized registration rejection test passed.
- Genuine hash verification test passed (`isAuthentic == true`).
- Mismatch hash detection test passed (`isAuthentic == false`).
- Product revocation and post-revocation verification passed.

### C. Frontend Production Build Test
```bash
cd frontend
npm run build
```
*Expected Result:* Clean compilation via Vite in under 2 seconds with zero build errors.

---

## 23. Development Status

| Module / Feature | Status | Details |
| :--- | :---: | :--- |
| **Solidity Contract (`SupplyProof.sol`)** | ✅ **IMPLEMENTED** | OpenZeppelin AccessControl, events, duplicate rejection, and verification logic. |
| **Hardhat Test Suite** | ✅ **IMPLEMENTED** | Interface test and live execution test suites passing. |
| **SHA-256 Fingerprinting Engine** | ✅ **IMPLEMENTED** | Native browser Web Crypto API; real-time deterministic canonical hashing. |
| **Offline Vector QR Code Generator** | ✅ **IMPLEMENTED** | Pure JavaScript SVG QR code generator with zero network dependencies. |
| **Public Verification Hub (`/verify`)** | ✅ **IMPLEMENTED** | Live audit, 1-click viva test scenarios, mismatch simulation, and status alerts. |
| **Manufacturer Registration (`/register`)** | ✅ **IMPLEMENTED** | Form validation, real-time fingerprint preview, and on-chain submission. |
| **Product Details Passport (`/product/:id`)** | ✅ **IMPLEMENTED** | Detailed specifications, QR code, lifecycle timeline, and revocation trigger. |
| **Demonstration Registry (`mockProducts.js`)** | 🟢 **DEMO** | Curated fictional units (`SP-2026-0001` to `SP-2026-0004`) for college presentation. |
| **MetaMask Live Signing** | 🚧 **IN DEVELOPMENT** | Browser extension transaction signing via Ethers.js. |
| **Ethereum Sepolia Testnet** | 🚧 **IN DEVELOPMENT** | Target testnet deployment for public block explorer linking. |
| **Decentralized IPFS Storage** | 📋 **PLANNED** | Off-chain storage for product manuals and inspection PDFs. |
| **Serialized NFC Tag Hardware** | 📋 **PLANNED** | Integration with physical cryptographic NFC chips for anti-cloning defense. |

---

## 24. Limitations
In accordance with academic rigor, Team HashGuard emphasizes the following inherent limitations:

1. **The Physical Cloning Problem**: A blockchain record proves digital registration but *cannot verify physical matter*. A counterfeiter could copy a genuine QR code onto an imitation box. Defense-in-depth (tamper-evident tape or NFC) is necessary.
2. **Initial Data Trust**: If an authorized manufacturer accidentally registers flawed product specifications, the blockchain will faithfully record the erroneous data. Blockchain guarantees immutability, not external truth.
3. **Private Key Responsibility**: If a manufacturer's private signing key is compromised, an unauthorized party could register fraudulent products until the key is revoked.

---

## 25. Future Enhancements
- **W3C Decentralized Identifiers (DIDs)**: Verify manufacturer credentials through verifiable decentralized identity standards.
- **First-Scan Ownership Claims**: Allow the retail buyer to claim digital ownership upon first scan, alerting the system if duplicate scans occur elsewhere.
- **Zero-Knowledge Proofs (zk-SNARKs)**: Enable manufacturers to prove compliance with batch safety standards without revealing proprietary ingredient formulas.
- **Mobile Camera QR Scanner**: In-app live camera feed integration with automatic barcode detection.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).  
Developed by **Team HashGuard** for academic examination in Blockchain Technology.
