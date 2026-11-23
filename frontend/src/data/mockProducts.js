/**
 * SUPPLYPROOF DEMONSTRATION PRODUCT REGISTRY
 * Team: HashGuard | Project: SupplyProof
 * 
 * Fictional demonstration products designed for academic BCT examination.
 * Each product features:
 *  - Canonical attributes for deterministic SHA-256 fingerprinting
 *  - Genuine computed SHA-256 digests
 *  - Chronological lifecycle event history
 *  - Clearly labeled demonstration states (Authentic, Revoked, Mismatch testing)
 */

export const INITIAL_PRODUCTS = [
  {
    productId: "SP-2026-0001",
    productName: "SmartWatch X",
    category: "Electronics",
    manufacturerName: "TechNova Industries",
    manufacturerId: "MFG-TECHNOVA-01",
    batchNumber: "TN-2026-08",
    manufacturingDate: "2026-08-12",
    description: "Next-generation biometric smartwatch with aerospace-grade titanium bezel, dual-frequency GPS, and optical sapphire heart rate sensor.",
    status: "AUTHENTIC", // "AUTHENTIC", "REVOKED", "SUSPENDED"
    productHash: "4503EFAD289CD1132AE7D2C1B51A48BBF272C97B531C9B1D5B047B2766A0D781",
    registeredBy: "0x71C8364237FDb33321558913F2459bAb83eE82A1",
    currentHolder: "0x8892F1c4b72643aE4259b19e48712C204B6c891F",
    registrationTimestamp: 1786521600, // Aug 12, 2026
    txHash: "0x8f2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    blockNumber: 4892120,

    specifications: {
      enclosure: "Aerospace Grade 5 Titanium",
      display: "1.4-inch AMOLED Sapphire Glass (454 x 454 px)",
      waterResistance: "5 ATM / IP68 certified",
      connectivity: "Bluetooth 5.3, NFC, Dual-Band GNSS",
      batteryCapacity: "480 mAh Li-Po (Up to 14 days standby)",
      originFacility: "TechNova Plant #4, GigaTech District, Neo-City"
    },

    events: [
      {
        id: "ev-01-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Product Identity Minted & Anchored",
        date: "2026-08-12 09:30 UTC",
        actor: "TechNova Industries (Authorized Manufacturer)",
        actorAddress: "0x71C8364237FDb33321558913F2459bAb83eE82A1",
        details: "Factory registration confirmed on-chain. Canonical SHA-256 fingerprint permanently anchored in smart contract.",
        txHash: "0x8f2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a"
      },
      {
        id: "ev-01-2",
        eventType: "INSPECTION_PASSED",
        title: "Factory Quality & RF Compliance Inspection",
        date: "2026-08-14 14:15 UTC",
        actor: "Global Quality Node #08 (Inspector)",
        actorAddress: "0x3A21c8B83D4719280bFE9431A76c24E91d58B342",
        details: "Passed optical sensor calibration, 5 ATM hydrostatic seal test, and CE/FCC emission standards.",
        txHash: "0x12a3b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f"
      },
      {
        id: "ev-01-3",
        eventType: "CUSTODY_TRANSFERRED",
        title: "Custody Handover to Regional Logistics",
        date: "2026-08-16 11:00 UTC",
        actor: "Pacific Secure Freight LLC",
        actorAddress: "0x8892F1c4b72643aE4259b19e48712C204B6c891F",
        details: "Dispatched from TechNova Regional Vault to Authorized TechCentral Flagship Distribution Center.",
        txHash: "0x6789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345"
      }
    ]
  },

  {
    productId: "SP-2026-0002",
    productName: "AuraSound Pro Wireless Earbuds",
    category: "Audio",
    manufacturerName: "Aura Dynamics",
    manufacturerId: "MFG-AURADYN-02",
    batchNumber: "AD-2026-02",
    manufacturingDate: "2026-07-20",
    description: "Audiophile-grade true wireless earbuds featuring dual graphene dynamic drivers, active noise cancelation (ANC) up to 48dB, and lossless LDAC transmission.",
    status: "AUTHENTIC",
    productHash: "462128DFB49E08990B89897A8DE4ACF1669AF57F61358A48081C2CF1B14B5CD2",
    registeredBy: "0x948bCd7F624e52518f8B9867A531c9FE5A5868B5",
    currentHolder: "0x948bCd7F624e52518f8B9867A531c9FE5A5868B5",
    registrationTimestamp: 1784534400, // Jul 20, 2026
    txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    blockNumber: 4851010,

    specifications: {
      drivers: "11mm Dual Graphene Coaxial Dynamic Drivers",
      noiseCancelation: "Hybrid ANC (-48 dB deep noise rejection)",
      codecs: "LDAC, LHDC 5.0, AAC, SBC",
      batteryLife: "9 hours per charge (36 hours with Qi wireless case)",
      frequencyResponse: "15 Hz - 40,000 Hz Hi-Res Wireless Certified",
      originFacility: "Aura Acoustic Engineering Labs, Singapore"
    },

    events: [
      {
        id: "ev-02-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Product Identity Minted & Anchored",
        date: "2026-07-20 10:00 UTC",
        actor: "Aura Dynamics (Authorized Manufacturer)",
        actorAddress: "0x948bCd7F624e52518f8B9867A531c9FE5A5868B5",
        details: "Production batch identity anchored to ledger with acoustic calibration certificate.",
        txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e"
      }
    ]
  },

  {
    productId: "SP-2026-0003",
    productName: "AeroDrone 4K Enterprise",
    category: "Robotics",
    manufacturerName: "SkyVanguard Robotics",
    manufacturerId: "MFG-SKYVAN-03",
    batchNumber: "SV-2026-11",
    manufacturingDate: "2026-05-18",
    description: "Compact autonomous industrial aerial inspection platform equipped with thermal FLIR sensor, 4K 60fps mechanical gimbal, and omnidirectional obstacle avoidance.",
    status: "AUTHENTIC",
    productHash: "4B690626B8E828B3666A7FD51E4DF7A0B688E28E90C291F6F3EA7B98CFEC0E4F",
    registeredBy: "0x32E4c2317F9A95C14674C2361B78a8340d8536A2",
    currentHolder: "0x32E4c2317F9A95C14674C2361B78a8340d8536A2",
    registrationTimestamp: 1779091200, // May 18, 2026
    txHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    blockNumber: 4792341,

    specifications: {
      optics: "1-inch CMOS 20MP Sensor + 640x512 Radiometric Thermal",
      flightTime: "42 minutes max hovering time",
      maxRange: "15 km O3 Enterprise Transmission",
      obstacleSensing: "Omnidirectional Binocular Vision + Infrared ToF",
      operatingTemp: "-20°C to 50°C ruggedized rating",
      originFacility: "SkyVanguard Robotics Hangars, Austin TX"
    },

    events: [
      {
        id: "ev-03-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Enterprise Aircraft Identity Minted",
        date: "2026-05-18 08:45 UTC",
        actor: "SkyVanguard Robotics (Authorized Manufacturer)",
        actorAddress: "0x32E4c2317F9A95C14674C2361B78a8340d8536A2",
        details: "Serial frame number and flight computer cryptographic fingerprint registered with FAA RemoteID compliance proof.",
        txHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b"
      }
    ]
  },

  {
    productId: "SP-2026-0004",
    productName: "BioPulse Smart Ring",
    category: "Healthcare",
    manufacturerName: "PulseHealth Labs",
    manufacturerId: "MFG-PULSE-04",
    batchNumber: "PH-2025-09",
    manufacturingDate: "2025-11-04",
    description: "Medical-grade titanium health monitoring ring tracking heart rate variability, skin temperature deviations, and sleep staging.",
    status: "REVOKED",
    revocationReason: "Battery batch recall #8821: Potential lithium thermal runaway risk detected during rapid wireless charging cycles.",
    revokedAt: "2026-02-15 16:30 UTC",
    productHash: "254865D6376ACD03F6DDC3E844C2377DE5E556EDD8560618054F291CBD5118A8",
    registeredBy: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
    currentHolder: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
    registrationTimestamp: 1762243200, // Nov 4, 2025
    txHash: "0x99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff",
    blockNumber: 4621980,

    specifications: {
      material: "Non-allergenic Medical Grade Titanium with PVD coating",
      sensors: "Infrared PPG pulse sensor, NTC body temperature sensor, 3D accelerometer",
      batteryLife: "6 days typical usage",
      waterproof: "100m water resistance (suitable for diving)",
      weight: "4 to 6 grams depending on ring size",
      originFacility: "PulseHealth MedTech Campus, Zurich Switzerland"
    },

    events: [
      {
        id: "ev-04-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Product Identity Minted",
        date: "2025-11-04 11:20 UTC",
        actor: "PulseHealth Labs (Authorized Manufacturer)",
        actorAddress: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
        details: "Initial batch registration with CE medical device certification.",
        txHash: "0x99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff"
      },
      {
        id: "ev-04-2",
        eventType: "PRODUCT_REVOKED",
        title: "OFFICIAL MANUFACTURER RECALL ISSUED",
        date: "2026-02-15 16:30 UTC",
        actor: "PulseHealth Safety Authority",
        actorAddress: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
        details: "Batch #PH-2025-09 recalled worldwide. Battery cell quality variance causes safety hazard during charging. Digital passport marked REVOKED.",
        txHash: "0x4433221100aabbccddeeff99887766554433221100aabbccddeeff9988776655"
      }
    ]
  }
];

// In-memory / session product store
let productsStore = [...INITIAL_PRODUCTS];

export function getAllProducts() {
  return [...productsStore];
}

export function getProductById(id) {
  if (!id) return null;
  const clean = id.trim().toUpperCase();
  return productsStore.find(p => p.productId.toUpperCase() === clean) || null;
}

export function searchProducts(query = '', categoryFilter = 'ALL', statusFilter = 'ALL') {
  let list = [...productsStore];

  if (categoryFilter && categoryFilter !== 'ALL') {
    list = list.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (statusFilter && statusFilter !== 'ALL') {
    list = list.filter(p => p.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(p => 
      p.productId.toLowerCase().includes(q) ||
      p.productName.toLowerCase().includes(q) ||
      p.batchNumber.toLowerCase().includes(q) ||
      p.manufacturerName.toLowerCase().includes(q)
    );
  }

  return list;
}

export function registerNewProduct(productData) {
  const newProduct = {
    ...productData,
    status: "AUTHENTIC",
    registrationTimestamp: Math.floor(Date.now() / 1000),
    txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    blockNumber: 4900000 + Math.floor(Math.random() * 5000),
    events: [
      {
        id: "ev-" + Date.now(),
        eventType: "PRODUCT_REGISTERED",
        title: "Product Identity Minted & Anchored",
        date: new Date().toISOString().replace('T', ' ').substring(0, 16) + " UTC",
        actor: productData.manufacturerName + " (Authorized Manufacturer)",
        actorAddress: productData.registeredBy || "0x71C8364237FDb33321558913F2459bAb83eE82A1",
        details: "Factory registration confirmed on-chain. Canonical SHA-256 fingerprint permanently anchored in smart contract.",
        txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
      }
    ]
  };

  // Prepend to store
  productsStore = [newProduct, ...productsStore];
  return newProduct;
}

export function revokeProductRecord(productId, reason) {
  const prod = getProductById(productId);
  if (!prod) return false;

  prod.status = "REVOKED";
  prod.revocationReason = reason || "Revoked by authorized manufacturer";
  prod.revokedAt = new Date().toISOString().replace('T', ' ').substring(0, 16) + " UTC";

  prod.events = [
    {
      id: "ev-revoke-" + Date.now(),
      eventType: "PRODUCT_REVOKED",
      title: "PRODUCT REVOKED BY MANUFACTURER",
      date: prod.revokedAt,
      actor: prod.manufacturerName + " (Authorized Manufacturer)",
      actorAddress: prod.registeredBy,
      details: reason || "Product identity revoked due to manufacturer recall or defect claim.",
      txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    },
    ...prod.events
  ];

  return true;
}
