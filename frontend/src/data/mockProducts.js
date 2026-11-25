/**
 * SUPPLYPROOF DEMONSTRATION PRODUCT REGISTRY
 * Team: HashGuard | Project: SupplyProof
 * 
 * Fictional demonstration products designed for academic BCT examination.
 * Each product features:
 *  - Canonical attributes for deterministic SHA-256 fingerprinting
 *  - Genuine computed SHA-256 digests
 *  - Chronological lifecycle event history
 *  - Distinct demonstration situations (Authentic, Recalled, Quality Issue, Mixed Reviews, Unregistered)
 *  - Simulated customer reviews clearly segregated from blockchain ledger authenticity
 */

export const INITIAL_PRODUCTS = [
  // 1. SITUATION A: VERIFIED / EXCELLENT CONDITION
  {
    productId: "SP-2026-0001",
    productName: "SmartWatch X",
    category: "Electronics",
    manufacturerName: "TechNova Industries",
    manufacturerId: "MFG-TECHNOVA-01",
    batchNumber: "TN-2026-08",
    manufacturingDate: "2026-08-12",
    description: "Next-generation biometric smartwatch with aerospace-grade titanium bezel, dual-frequency GPS, and optical sapphire heart rate sensor.",
    status: "AUTHENTIC",
    productHash: "4503EFAD289CD1132AE7D2C1B51A48BBF272C97B531C9B1D5B047B2766A0D781",
    registeredBy: "0x71C8364237FDb33321558913F2459bAb83eE82A1",
    currentHolder: "0x8892F1c4b72643aE4259b19e48712C204B6c891F",
    registrationTimestamp: 1786521600,
    txHash: "0x8f2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    blockNumber: 4892120,
    demoRating: 4.9,
    demoReviewCount: 56,
    situation: "VERIFIED_EXCELLENT",
    demoReviews: [
      {
        id: "rev-01",
        author: "Alex Morgan (Verified Buyer)",
        rating: 5,
        date: "2026-08-25",
        comment: "Aerospace titanium feels remarkably solid. Battery life easily exceeds 12 days on standby."
      },
      {
        id: "rev-02",
        author: "Devon Reed (Tech Enthusiast)",
        rating: 5,
        date: "2026-09-02",
        comment: "Scanned the packaging QR at customs and the cryptographic fingerprint matched immediately."
      }
    ],
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

  // 2. SITUATION D: HIGH CUSTOMER RATING
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
    registrationTimestamp: 1784534400,
    txHash: "0x3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    blockNumber: 4851010,
    demoRating: 4.8,
    demoReviewCount: 42,
    situation: "HIGH_RATING",
    demoReviews: [
      {
        id: "rev-03",
        author: "Sarah Lin (Acoustic Engineer)",
        rating: 5,
        date: "2026-08-01",
        comment: "Dual graphene drivers deliver unmatched acoustic separation. Hi-Res LDAC mode is superb."
      },
      {
        id: "rev-04",
        author: "Marcus Vance",
        rating: 4,
        date: "2026-08-10",
        comment: "Great ergonomics and comfortable for 6+ hour long-haul flights. Fast wireless charging case."
      }
    ],
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

  // 3. SITUATION C: PRODUCT ISSUE / INSPECTION ADVISORY
  {
    productId: "SP-2026-0003",
    productName: "AeroDrone 4K Enterprise",
    category: "Robotics",
    manufacturerName: "SkyVanguard Robotics",
    manufacturerId: "MFG-SKYVAN-03",
    batchNumber: "SV-2026-11",
    manufacturingDate: "2026-05-18",
    description: "Compact autonomous industrial aerial inspection platform equipped with radiometric thermal FLIR sensor, 4K 60fps mechanical gimbal, and omnidirectional obstacle avoidance.",
    status: "AUTHENTIC",
    productHash: "4B690626B8E828B3666A7FD51E4DF7A0B688E28E90C291F6F3EA7B98CFEC0E4F",
    registeredBy: "0x32E4c2317F9A95C14674C2361B78a8340d8536A2",
    currentHolder: "0x32E4c2317F9A95C14674C2361B78a8340d8536A2",
    registrationTimestamp: 1779091200,
    txHash: "0x5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    blockNumber: 4792341,
    demoRating: 3.9,
    demoReviewCount: 18,
    situation: "PRODUCT_ISSUE",
    qualityIssue: {
      hasIssue: true,
      type: "PACKAGING_CONCERN",
      title: "Logistics Inspection Advisory #IS-4491",
      details: "Quality checkpoint flagged slight exterior tamper-seal crease during pallet transit. Internal flight computer and thermal sensor tested 100% operational with valid blockchain cryptographic anchor."
    },
    demoReviews: [
      {
        id: "rev-05",
        author: "Julian Thorne (Surveying Lead)",
        rating: 4,
        date: "2026-06-12",
        comment: "Thermal FLIR sensor performs flawlessly for roof inspections. Exterior cardboard box had minor corner wear."
      },
      {
        id: "rev-06",
        author: "Elena Rostova",
        rating: 3,
        date: "2026-06-28",
        comment: "Excellent flight stability, but required an immediate firmware patch out of the box."
      }
    ],
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
      },
      {
        id: "ev-03-2",
        eventType: "INSPECTION_ADVISORY",
        title: "Logistics Inspection Advisory Noted",
        date: "2026-05-24 16:10 UTC",
        actor: "Logistics Hub Gateway #04",
        actorAddress: "0x3A21c8B83D4719280bFE9431A76c24E91d58B342",
        details: "Advisory logged: Minor outer carton seal compression during automated pallet sorting. Core unit intact.",
        txHash: "0x44556677889900aabbccddeeff11223344556677889900aabbccddeeff112233"
      }
    ]
  },

  // 4. SITUATION B: RECALL ALERT (HEALTHCARE)
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
    productHash: "254865D6376ACD03F6DDC3E844C2377DE5E556EDD8560618054F291CBD5118A8",
    revocationReason: "Battery batch recall #8821: Potential lithium thermal runaway risk detected during rapid wireless charging cycles.",
    revokedAt: "2026-02-15 16:30 UTC",
    registeredBy: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
    currentHolder: "0x55B810F7c07b9a52862d64E22A0449C16450A922",
    registrationTimestamp: 1762243200,
    txHash: "0x99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff",
    blockNumber: 4621980,
    demoRating: 2.4,
    demoReviewCount: 31,
    situation: "RECALL_ALERT",
    recallInfo: {
      isRecalled: true,
      recallCode: "RECALL-PH-8821",
      reason: "Battery batch recall #8821: Potential lithium thermal runaway risk detected during rapid wireless charging cycles.",
      recallDate: "2026-02-15 16:30 UTC"
    },
    demoReviews: [
      {
        id: "rev-07",
        author: "Michael Chang",
        rating: 2,
        date: "2026-02-18",
        comment: "Worked great until the urgent battery thermal recall was announced. Appreciated the transparent blockchain alert."
      },
      {
        id: "rev-08",
        author: "Liam O'Connor",
        rating: 3,
        date: "2026-02-22",
        comment: "Great sensor accuracy initially, but had to return the ring under the batch recall program."
      }
    ],
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
  },

  // 5. SITUATION E: MIXED REVIEWS (PERSONAL CARE)
  {
    productId: "SP-2026-0005",
    productName: "LuminaGlow Sonic Facial Cleanser",
    category: "Personal Care",
    manufacturerName: "PureSkin Labs",
    manufacturerId: "MFG-PURESKIN-05",
    batchNumber: "PS-2026-04",
    manufacturingDate: "2026-04-10",
    description: "Sonic dermatological facial cleansing device with anti-microbial medical silicone touchpoints, thermal pore prep mode, and smart timer.",
    status: "AUTHENTIC",
    productHash: "BF92C1A638F756464769D4902CB355AB68B96B7ACFCC9A82FF07168401D99960",
    registeredBy: "0x82C4A110F876De332149b561B824B7010C5628E1",
    currentHolder: "0x82C4A110F876De332149b561B824B7010C5628E1",
    registrationTimestamp: 1775865600,
    txHash: "0x11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff",
    blockNumber: 4768920,
    demoRating: 3.2,
    demoReviewCount: 64,
    situation: "MIXED_REVIEWS",
    demoReviews: [
      {
        id: "rev-09",
        author: "Chloe Dubois",
        rating: 4,
        date: "2026-05-02",
        comment: "Gentle on sensitive skin and the thermal prep mode opens pores well."
      },
      {
        id: "rev-10",
        author: "Hannah Bailey",
        rating: 3,
        date: "2026-05-14",
        comment: "Authentic product verified on ledger, but magnetic wireless charging base feels flimsy."
      },
      {
        id: "rev-11",
        author: "Rachel Kim",
        rating: 2,
        date: "2026-05-29",
        comment: "Battery only lasts 4 days with daily thermal mode, lower than the advertised 7 days."
      }
    ],
    specifications: {
      vibrationFrequency: "8,000 sonic pulsations per minute",
      touchpoints: "Ultra-hygienic surgical silicone (BPA free)",
      modes: "3 intensities + 42°C soothing heat infusion",
      batteryLife: "Rechargeable via magnetic dock (Up to 14 uses)",
      originFacility: "PureSkin Bio-Cosmetics Research Park, Lyon France"
    },
    events: [
      {
        id: "ev-05-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Dermatological Device Identity Anchored",
        date: "2026-04-10 12:00 UTC",
        actor: "PureSkin Labs (Authorized Manufacturer)",
        actorAddress: "0x82C4A110F876De332149b561B824B7010C5628E1",
        details: "Clean-room production batch registered with dermatologist safety test certificate.",
        txHash: "0x11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff"
      }
    ]
  },

  // 6. SITUATION A2: VERIFIED / HOME PRODUCTS
  {
    productId: "SP-2026-0006",
    productName: "HydroPure Smart UV Flask",
    category: "Home Products",
    manufacturerName: "AquaTech Innovations",
    manufacturerId: "MFG-AQUATECH-06",
    batchNumber: "AQ-2026-03",
    manufacturingDate: "2026-06-01",
    description: "Self-cleaning insulated vacuum flask equipped with integrated UV-C sterilizing cap and real-time OLED water quality & temperature sensor.",
    status: "AUTHENTIC",
    productHash: "E13B285927EFD8E80A94E9E1897DF750205BF25BDD83B8E388706EFDC18D462A",
    registeredBy: "0x44B12A81C70A4e5218d62B41369Fa832C98145D2",
    currentHolder: "0x44B12A81C70A4e5218d62B41369Fa832C98145D2",
    registrationTimestamp: 1780272000,
    txHash: "0x778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566",
    blockNumber: 4801450,
    demoRating: 4.7,
    demoReviewCount: 38,
    situation: "VERIFIED_EXCELLENT",
    demoReviews: [
      {
        id: "rev-12",
        author: "Daniel K.",
        rating: 5,
        date: "2026-06-18",
        comment: "UV-C sterilization gives total peace of mind while hiking. Temperature readout is exact."
      },
      {
        id: "rev-13",
        author: "Samantha Ward",
        rating: 4,
        date: "2026-07-04",
        comment: "Water stays freezing cold for over 24 hours. Very sleek minimalist navy finish."
      }
    ],
    specifications: {
      volume: "650 mL (22 fl oz)",
      sterilization: "275nm UV-C LED (Eliminates 99.99% of bio-contaminants)",
      insulation: "Double-walled 18/8 food-grade pro stainless steel",
      batteryLife: "USB-C magnetic charging (Lasts up to 30 days)",
      originFacility: "AquaTech Precision Fabrication, Munich Germany"
    },
    events: [
      {
        id: "ev-06-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Clean Technology Batch Minted",
        date: "2026-06-01 08:15 UTC",
        actor: "AquaTech Innovations (Authorized Manufacturer)",
        actorAddress: "0x44B12A81C70A4e5218d62B41369Fa832C98145D2",
        details: "Food-contact NSF-55 certification and cryptographic batch passport anchored to EVM.",
        txHash: "0x778899aabbccddeeff00112233445566778899aabbccddeeff00112233445566"
      }
    ]
  },

  // 7. SITUATION D2: HIGH CUSTOMER RATING / ACCESSORIES
  {
    productId: "SP-2026-0007",
    productName: "Titanium Minimalist Chrono",
    category: "Accessories",
    manufacturerName: "ChronoCraft Studio",
    manufacturerId: "MFG-CHRONO-07",
    batchNumber: "CC-2026-01",
    manufacturingDate: "2026-03-15",
    description: "Swiss-movement minimalist analog chronograph encased in grade 5 brushed titanium with scratchproof anti-reflective sapphire crystal.",
    status: "AUTHENTIC",
    productHash: "1B9109FD2FA0A9F975B8E94649F20C167C354E55608FF3AC44F795AAC5A780EF",
    registeredBy: "0x12F85A21D74E32519B8624C719A0458C9134B5A3",
    currentHolder: "0x12F85A21D74E32519B8624C719A0458C9134B5A3",
    registrationTimestamp: 1773532800,
    txHash: "0x556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344",
    blockNumber: 4741200,
    demoRating: 4.9,
    demoReviewCount: 27,
    situation: "HIGH_RATING",
    demoReviews: [
      {
        id: "rev-14",
        author: "Julian Ross (Horology Collector)",
        rating: 5,
        date: "2026-04-02",
        comment: "Flawless hand-brushed titanium bevels and comfortable Italian leather strap. True craftsmanship."
      },
      {
        id: "rev-15",
        author: "Oliver Brooks",
        rating: 5,
        date: "2026-04-19",
        comment: "Verified the serial authenticity card instantly using SupplyProof on mobile."
      }
    ],
    specifications: {
      movement: "Swiss Ronda Caliber 5030.D Quartz Chronograph",
      caseDiameter: "40 mm (8.2 mm thickness)",
      crystal: "Anti-reflective triple-coated synthetic sapphire",
      strap: "Full-grain vegetable-tanned Tuscan calfskin",
      originFacility: "ChronoCraft Atelier, Geneva Switzerland"
    },
    events: [
      {
        id: "ev-07-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Artisan Horology Passport Minted",
        date: "2026-03-15 14:30 UTC",
        actor: "ChronoCraft Studio (Authorized Manufacturer)",
        actorAddress: "0x12F85A21D74E32519B8624C719A0458C9134B5A3",
        details: "Chronometer chronometric certification proof anchored to blockchain ledger.",
        txHash: "0x556677889900aabbccddeeff11223344556677889900aabbccddeeff11223344"
      }
    ]
  },

  // 8. SITUATION B2: RECALL ALERT (ELECTRONICS BATCH RECALL)
  {
    productId: "SP-2026-0008",
    productName: "UltraVolt GaN Fast Charger 120W",
    category: "Electronics",
    manufacturerName: "VoltMatrix Power",
    manufacturerId: "MFG-VOLT-08",
    batchNumber: "UV-2026-01",
    manufacturingDate: "2026-01-20",
    description: "Compact 120W Gallium Nitride (GaN) multi-port wall charger supporting Power Delivery 3.1 and dual 100W simultaneous laptop fast charging.",
    status: "REVOKED",
    productHash: "FE8B5455588287E05BA3A1B13C2D1C3108520D331CE5D76A753A3D98CE5322F5",
    revocationReason: "Power regulation recall #PR-104: Voltage spike variance under 240V industrial outlets may damage connected USB-C devices.",
    revokedAt: "2026-03-02 10:00 UTC",
    registeredBy: "0x66B72910F74C32185D9421A8321B59C9847120D5",
    currentHolder: "0x66B72910F74C32185D9421A8321B59C9847120D5",
    registrationTimestamp: 1768867200,
    txHash: "0x3344556677889900aabbccddeeff11223344556677889900aabbccddeeff1122",
    blockNumber: 4691050,
    demoRating: 2.1,
    demoReviewCount: 49,
    situation: "RECALL_ALERT",
    recallInfo: {
      isRecalled: true,
      recallCode: "RECALL-UV-104",
      reason: "Power regulation recall #PR-104: Voltage spike variance under 240V industrial outlets may damage connected USB-C devices.",
      recallDate: "2026-03-02 10:00 UTC"
    },
    demoReviews: [
      {
        id: "rev-16",
        author: "Brandon Miller",
        rating: 1,
        date: "2026-03-05",
        comment: "Charger was recalled worldwide due to voltage surge risks. Checked the serial on SupplyProof to confirm."
      },
      {
        id: "rev-17",
        author: "Tyler Adams",
        rating: 2,
        date: "2026-03-10",
        comment: "Charged my MacBook quickly before the recall notice, but stopped using it immediately upon checking the passport."
      }
    ],
    specifications: {
      powerOutput: "120W Max (GaNFast Generation 3 technology)",
      ports: "3x USB-C (PD 3.1) + 1x USB-A (QC 4.0+)",
      safetyProtections: "Overvoltage, overcurrent, and thermal auto-cutoff",
      originFacility: "VoltMatrix Shenzhen Engineering Facility"
    },
    events: [
      {
        id: "ev-08-1",
        eventType: "PRODUCT_REGISTERED",
        title: "Product Identity Anchored",
        date: "2026-01-20 09:00 UTC",
        actor: "VoltMatrix Power (Authorized Manufacturer)",
        actorAddress: "0x66B72910F74C32185D9421A8321B59C9847120D5",
        details: "Factory registration with UL-94 flame retardant certificate.",
        txHash: "0x3344556677889900aabbccddeeff11223344556677889900aabbccddeeff1122"
      },
      {
        id: "ev-08-2",
        eventType: "PRODUCT_REVOKED",
        title: "SAFETY RECALL ISSUED BY VOLTMATRIX",
        date: "2026-03-02 10:00 UTC",
        actor: "VoltMatrix Compliance Office",
        actorAddress: "0x66B72910F74C32185D9421A8321B59C9847120D5",
        details: "Batch #UV-2026-01 recalled due to potential voltage instability on high-voltage AC inputs.",
        txHash: "0x99887766554433221100aabbccddeeff11223344556677889900aabbccddeeff"
      }
    ]
  },

  // 9. SITUATION F: UNREGISTERED PRODUCT (DEMONSTRATION SHOWCASE)
  {
    productId: "SP-2026-9999",
    productName: "Unverified Replica SmartWatch",
    category: "Electronics",
    manufacturerName: "Uncertified Manufacturer (Counterfeit Suspect)",
    manufacturerId: "UNKNOWN-VENDOR",
    batchNumber: "UNKNOWN-BATCH",
    manufacturingDate: "2026-09-01",
    description: "Demonstration example of an unauthorized imitation product that lacks genuine blockchain registration, certified manufacturer signature, or valid cryptographic fingerprint.",
    status: "UNREGISTERED",
    productHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    registeredBy: "0x0000000000000000000000000000000000000000",
    currentHolder: "0x0000000000000000000000000000000000000000",
    registrationTimestamp: 0,
    txHash: "NONE - NO TRANSACTION ON RECORD",
    blockNumber: 0,
    demoRating: 1.2,
    demoReviewCount: 9,
    situation: "UNREGISTERED_COUNTERFEIT",
    demoReviews: [
      {
        id: "rev-18",
        author: "Concerned Consumer",
        rating: 1,
        date: "2026-09-10",
        comment: "Warning: Scanned the QR and found zero records on the blockchain ledger. Product is a counterfeit replica."
      }
    ],
    specifications: {
      enclosure: "Unknown Plastic Alloy",
      display: "Uncertified Low-Resolution Panel",
      originFacility: "Unverified / Non-Compliant Source"
    },
    events: []
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
  const prod = productsStore.find(p => p.productId.toUpperCase() === clean);
  // Unregistered demo showcase items are treated as non-existent in the official ledger registry
  if (prod && prod.status === 'UNREGISTERED') {
    return null;
  }
  return prod || null;
}

export function searchProducts(query = '', categoryFilter = 'ALL', statusFilter = 'ALL') {
  let list = [...productsStore];

  if (categoryFilter && categoryFilter !== 'ALL') {
    list = list.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (statusFilter && statusFilter !== 'ALL') {
    const s = statusFilter.toUpperCase();
    if (s === 'VERIFIED' || s === 'AUTHENTIC') {
      list = list.filter(p => p.status === 'AUTHENTIC' && !p.qualityIssue);
    } else if (s === 'RECALLED' || s === 'REVOKED') {
      list = list.filter(p => p.status === 'REVOKED' || p.recallInfo?.isRecalled);
    } else if (s === 'ISSUES') {
      list = list.filter(p => p.qualityIssue?.hasIssue === true);
    } else if (s === 'UNREGISTERED') {
      list = list.filter(p => p.status === 'UNREGISTERED');
    } else {
      list = list.filter(p => p.status.toUpperCase() === s);
    }
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
    demoRating: 5.0,
    demoReviewCount: 1,
    demoReviews: [
      {
        id: "rev-new-" + Date.now(),
        author: "Factory Initial QA Auditor",
        rating: 5,
        date: new Date().toISOString().substring(0, 10),
        comment: "Initial production batch verified and anchored on blockchain ledger."
      }
    ],
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
  prod.recallInfo = {
    isRecalled: true,
    recallCode: "RECALL-" + prod.batchNumber,
    reason: prod.revocationReason,
    recallDate: prod.revokedAt
  };

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

export function reactivateProductRecord(productId, reason) {
  const prod = getProductById(productId);
  if (!prod) return false;

  prod.status = "AUTHENTIC";
  prod.revocationReason = null;
  prod.revokedAt = null;
  prod.recallInfo = null;
  const reactivatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16) + " UTC";

  prod.events = [
    {
      id: "ev-reactivate-" + Date.now(),
      eventType: "PRODUCT_REACTIVATED",
      title: "PRODUCT REACTIVATED BY MANUFACTURER",
      date: reactivatedAt,
      actor: prod.manufacturerName + " (Authorized Manufacturer)",
      actorAddress: prod.registeredBy,
      details: reason || "Product identity restored to Active status after inspection resolution.",
      txHash: "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    },
    ...prod.events
  ];

  return true;
}

/**
 * Get distinct production batches for the Batch Recall Simulation Demo.
 * @returns {Array<{ batchNumber: string, manufacturerName: string, category: string, count: number, isAlreadyRecalled: boolean, reason?: string }>}
 */
export function getDistinctBatches() {
  const batchMap = new Map();

  for (const prod of productsStore) {
    if (!prod.batchNumber || prod.status === 'UNREGISTERED') continue;
    const batchKey = prod.batchNumber;

    if (!batchMap.has(batchKey)) {
      batchMap.set(batchKey, {
        batchNumber: batchKey,
        manufacturerName: prod.manufacturerName,
        category: prod.category,
        count: 0,
        isAlreadyRecalled: prod.status === 'REVOKED',
        reason: prod.revocationReason || null,
        products: []
      });
    }

    const b = batchMap.get(batchKey);
    b.count += 1;
    b.products.push(prod);
    if (prod.status === 'REVOKED') {
      b.isAlreadyRecalled = true;
      b.reason = prod.revocationReason || b.reason;
    }
  }

  return Array.from(batchMap.values());
}

/**
 * Query products by batch number.
 * @param {string} batchNumber
 * @returns {Array} Products in that batch
 */
export function getProductsByBatch(batchNumber) {
  if (!batchNumber) return [];
  const clean = batchNumber.trim().toUpperCase();
  return productsStore.filter(p => p.batchNumber && p.batchNumber.toUpperCase() === clean);
}
