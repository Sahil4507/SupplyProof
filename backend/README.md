# SupplyProof — Backend Architecture (Phase 2 Roadmap)
**Team: HashGuard | Project: SupplyProof**

This directory outlines the planned RESTful API caching layer for SupplyProof:
- **Node.js & Express API Server**: Fast indexed queries for product registries, search filters, and batch audits.
- **MongoDB Database**: Document storage for off-chain specifications, high-resolution product imagery, and factory schematics.
- **SHA-256 Batch Hashing Microservice**: Validates manufacturing CSV/JSON imports and computes canonical fingerprints before blockchain submission.
- **Web3 Event Listener**: Subscribes to `ProductRegistered`, `ProductRevoked`, and `CustodyTransferred` smart contract events to keep MongoDB cache synchronized with the Ethereum distributed ledger.
