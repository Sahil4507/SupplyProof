// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SupplyProof
 * @notice Blockchain-Based Product Authenticity & Counterfeit Detection Ledger.
 * @dev Developed by Team HashGuard for BCT Academic Capstone Project.
 *      Maintains cryptographic product identity, canonical SHA-256 fingerprints,
 *      lifecycle event provenance, and revocation records.
 */
contract SupplyProof is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");

    enum ProductStatus {
        Active,     // 0: Authenticated & valid
        Revoked,    // 1: Revoked by manufacturer / admin (e.g. recall, counterfeit detection)
        Suspended   // 2: Temporarily flagged for investigation
    }

    struct Product {
        string productId;               // Unique canonical ID (e.g., "SP-2026-0001")
        bytes32 productHash;            // SHA-256 fingerprint of canonical product data
        string productName;            // Product model / name
        string category;               // Product category
        string manufacturerName;       // Manufacturer company name
        string batchNumber;            // Production batch code
        uint256 registrationTimestamp; // Block timestamp of registration
        address registeredBy;          // Wallet address that registered the item
        address currentHolder;         // Current custody holder
        ProductStatus status;          // Active, Revoked, Suspended
        bool exists;                   // Existence flag
    }

    struct ProductEvent {
        string eventType;              // e.g. "PRODUCT_REGISTERED", "CUSTODY_TRANSFERRED", "REVOKED"
        address actor;                 // Party initiating or recording the event
        uint256 timestamp;             // Block timestamp
        string details;                // Descriptive details / location / custody note
    }

    // Mapping: productId => Product
    mapping(string => Product) private products;

    // Mapping: productId => ProductEvent[]
    mapping(string => ProductEvent[]) private productHistory;

    // Array of all registered product IDs for discoverability
    string[] private allProductIds;

    // Events
    event ProductRegistered(
        string indexed productId,
        bytes32 indexed productHash,
        address indexed registeredBy,
        string productName,
        string manufacturerName,
        string batchNumber,
        uint256 timestamp
    );

    event ProductRevoked(
        string indexed productId,
        address indexed revokedBy,
        string reason,
        uint256 timestamp
    );

    event CustodyTransferred(
        string indexed productId,
        address indexed from,
        address indexed to,
        string notes,
        uint256 timestamp
    );

    event ProductEventRecorded(
        string indexed productId,
        string eventType,
        address indexed actor,
        string details,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANUFACTURER_ROLE, msg.sender);
        _grantRole(INSPECTOR_ROLE, msg.sender);
    }

    /**
     * @notice Register a newly manufactured product and anchor its cryptographic fingerprint.
     * @dev Restricted to MANUFACTURER_ROLE. Prevents duplicate Product IDs.
     */
    function registerProduct(
        string calldata productId,
        bytes32 productHash,
        string calldata productName,
        string calldata category,
        string calldata manufacturerName,
        string calldata batchNumber
    ) external onlyRole(MANUFACTURER_ROLE) {
        require(bytes(productId).length > 0, "SupplyProof: Product ID cannot be empty");
        require(!products[productId].exists, "SupplyProof: Product ID already registered");
        require(productHash != bytes32(0), "SupplyProof: Product hash cannot be zero");
        require(bytes(productName).length > 0, "SupplyProof: Product name cannot be empty");
        require(bytes(batchNumber).length > 0, "SupplyProof: Batch number cannot be empty");

        Product storage prod = products[productId];
        prod.productId = productId;
        prod.productHash = productHash;
        prod.productName = productName;
        prod.category = category;
        prod.manufacturerName = manufacturerName;
        prod.batchNumber = batchNumber;
        prod.registrationTimestamp = block.timestamp;
        prod.registeredBy = msg.sender;
        prod.currentHolder = msg.sender;
        prod.status = ProductStatus.Active;
        prod.exists = true;

        allProductIds.push(productId);

        productHistory[productId].push(ProductEvent({
            eventType: "PRODUCT_REGISTERED",
            actor: msg.sender,
            timestamp: block.timestamp,
            details: "Factory registration & cryptographic fingerprint anchored"
        }));

        emit ProductRegistered(
            productId,
            productHash,
            msg.sender,
            productName,
            manufacturerName,
            batchNumber,
            block.timestamp
        );
    }

    /**
     * @notice Retrieve the full product record for a given Product ID.
     * @dev Public read function.
     */
    function getProduct(string calldata productId) external view returns (Product memory) {
        require(products[productId].exists, "SupplyProof: Product not found");
        return products[productId];
    }

    /**
     * @notice Public verification endpoint for customers, retailers, and inspectors.
     * @param productId The unique identifier of the product.
     * @param submittedHash The SHA-256 fingerprint computed from the supplied product information.
     * @return exists True if registered on-chain.
     * @return isAuthentic True if registered, active, and matching the submitted hash.
     * @return status The current ProductStatus (0=Active, 1=Revoked, 2=Suspended).
     * @return registeredHash The genuine hash stored in the ledger.
     */
    function verifyProduct(string calldata productId, bytes32 submittedHash) 
        external 
        view 
        returns (
            bool exists,
            bool isAuthentic,
            ProductStatus status,
            bytes32 registeredHash
        ) 
    {
        Product storage prod = products[productId];
        if (!prod.exists) {
            return (false, false, ProductStatus.Active, bytes32(0));
        }

        bool matchResult = (prod.productHash == submittedHash);
        bool authentic = matchResult && (prod.status == ProductStatus.Active);

        return (true, authentic, prod.status, prod.productHash);
    }

    /**
     * @notice Revoke a registered product in cases of recall, defective batch, or detected counterfeit cloning.
     * @dev Only the registering manufacturer or admin can revoke.
     */
    function revokeProduct(string calldata productId, string calldata reason) external {
        require(products[productId].exists, "SupplyProof: Product not found");
        Product storage prod = products[productId];
        
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender) || (prod.registeredBy == msg.sender && hasRole(MANUFACTURER_ROLE, msg.sender)),
            "SupplyProof: Unauthorized to revoke product"
        );
        require(prod.status != ProductStatus.Revoked, "SupplyProof: Product is already revoked");

        prod.status = ProductStatus.Revoked;

        productHistory[productId].push(ProductEvent({
            eventType: "PRODUCT_REVOKED",
            actor: msg.sender,
            timestamp: block.timestamp,
            details: bytes(reason).length > 0 ? reason : "Revoked by authorized manufacturer"
        }));

        emit ProductRevoked(productId, msg.sender, reason, block.timestamp);
    }

    /**
     * @notice Transfer custody of a product along the supply chain.
     * @dev Only current holder or admin can transfer custody.
     */
    function transferCustody(
        string calldata productId,
        address newHolder,
        string calldata notes
    ) external {
        require(products[productId].exists, "SupplyProof: Product not found");
        require(newHolder != address(0), "SupplyProof: Invalid recipient address");
        Product storage prod = products[productId];
        
        require(
            msg.sender == prod.currentHolder || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "SupplyProof: Only current holder can transfer custody"
        );
        require(prod.status == ProductStatus.Active, "SupplyProof: Cannot transfer non-active product");

        address previousHolder = prod.currentHolder;
        prod.currentHolder = newHolder;

        productHistory[productId].push(ProductEvent({
            eventType: "CUSTODY_TRANSFERRED",
            actor: msg.sender,
            timestamp: block.timestamp,
            details: bytes(notes).length > 0 ? notes : "Custody transferred along supply chain"
        }));

        emit CustodyTransferred(productId, previousHolder, newHolder, notes, block.timestamp);
    }

    /**
     * @notice Record a verified milestone or inspection event for a product.
     * @dev Restricted to MANUFACTURER_ROLE, INSPECTOR_ROLE, or ADMIN.
     */
    function recordProductEvent(
        string calldata productId,
        string calldata eventType,
        string calldata details
    ) external {
        require(products[productId].exists, "SupplyProof: Product not found");
        require(
            hasRole(MANUFACTURER_ROLE, msg.sender) || 
            hasRole(INSPECTOR_ROLE, msg.sender) || 
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "SupplyProof: Caller not authorized to record product event"
        );

        productHistory[productId].push(ProductEvent({
            eventType: eventType,
            actor: msg.sender,
            timestamp: block.timestamp,
            details: details
        }));

        emit ProductEventRecorded(productId, eventType, msg.sender, details, block.timestamp);
    }

    /**
     * @notice Retrieve the full chronological event history for a product.
     * @dev Public read function.
     */
    function getProductHistory(string calldata productId) external view returns (ProductEvent[] memory) {
        require(products[productId].exists, "SupplyProof: Product not found");
        return productHistory[productId];
    }

    /**
     * @notice Get all registered product IDs.
     * @dev Public read function.
     */
    function getAllProductIds() external view returns (string[] memory) {
        return allProductIds;
    }

    /**
     * @notice Get total count of registered products.
     */
    function getProductCount() external view returns (uint256) {
        return allProductIds.length;
    }
}
