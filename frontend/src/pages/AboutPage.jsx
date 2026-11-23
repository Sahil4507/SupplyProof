import React from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  Lock, 
  Database, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  ArrowRight, 
  QrCode,
  FileCheck2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Title */}
      <div className="space-y-3 text-center sm:text-left border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Team HashGuard • BCT Academic Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          About SupplyProof Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          An academic study and prototype implementation of decentralized product identity and counterfeit detection using Ethereum smart contracts and SHA-256 hashing.
        </p>
      </div>

      {/* 1. PROBLEM STATEMENT */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>The Problem: The Global Counterfeiting Crisis</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          The global counterfeit market exceeds <strong>$500 billion annually</strong>, creating massive economic damage and critical safety risks in pharmaceuticals, electronics, automotive components, and luxury products.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="font-bold text-slate-900 dark:text-white block">Centralized Vulnerability</strong>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Traditional company databases are internal silos vulnerable to rogue employees, single points of failure, and unauthorized record modification.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="font-bold text-slate-900 dark:text-white block">Paper & Label Forgery</strong>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Holograms and printed certificates of authenticity are easily photocopied or manufactured by sophisticated counterfeit syndicates.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <strong className="font-bold text-slate-900 dark:text-white block">Inability to Audit Recalls</strong>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              When a manufacturer recalls a hazardous batch, consumers have no instant, cryptographically verifiable way to check if their specific unit is revoked.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE SOLUTION & DIFFERENTIATION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <span>Our Solution: Cryptographic Product Identity</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Unlike generic supply chain dApps that try to record every courier checkpoint, <strong>SupplyProof focuses strictly on Product Identity and Counterfeit Detection</strong>:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 list-disc list-inside leading-relaxed">
          <li><strong>Unique Product ID:</strong> Every unit gets an individual, permanent ID (e.g. <code className="font-mono text-blue-600 font-bold">SP-2026-0001</code>).</li>
          <li><strong>Deterministic SHA-256 Fingerprint:</strong> A mathematical digest generated from normalized canonical attributes.</li>
          <li><strong>Immutable On-Chain Anchor:</strong> Anchored via OpenZeppelin Role-Based Access Control (<code className="font-mono text-blue-600">MANUFACTURER_ROLE</code>).</li>
          <li><strong>Instant Public Verification:</strong> Customers can verify whether a product is Authentic, Revoked, Mismatched, or Unregistered without an account.</li>
        </ul>
      </section>

      {/* 3. ON-CHAIN VS OFF-CHAIN STORAGE ARCHITECTURE */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          <span>On-Chain vs Off-Chain Storage (Hybrid Model)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Storing entire user manuals, high-resolution product photography, and full legal agreements directly on Ethereum smart contracts is technically and economically prohibitive due to block size limits and gas fees. SupplyProof adopts the industry-standard hybrid model:
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 font-bold">Data Type</th>
                <th className="py-2.5 font-bold">Storage Location</th>
                <th className="py-2.5 font-bold">Engineering Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-mono font-bold text-blue-600">Product ID & Status</td>
                <td className="py-2.5 font-semibold text-emerald-600">On-Chain (Solidity)</td>
                <td className="py-2.5 text-slate-500">Immutable global index for verifiable lookups.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono font-bold text-blue-600">SHA-256 Fingerprint</td>
                <td className="py-2.5 font-semibold text-emerald-600">On-Chain (bytes32)</td>
                <td className="py-2.5 text-slate-500">Fixed 32-byte hash provides zero-knowledge mathematical proof.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono font-bold text-blue-600">Manufacturer Address</td>
                <td className="py-2.5 font-semibold text-emerald-600">On-Chain (address)</td>
                <td className="py-2.5 text-slate-500">Cryptographic non-repudiation of issuer.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono font-bold">Product Photography</td>
                <td className="py-2.5 font-semibold text-slate-400">Off-Chain (IPFS / Cloud)</td>
                <td className="py-2.5 text-slate-500">High bandwidth media files prevent chain bloat.</td>
              </tr>
              <tr>
                <td className="py-2.5 font-mono font-bold">Detailed User Manuals</td>
                <td className="py-2.5 font-semibold text-slate-400">Off-Chain (Local Cache)</td>
                <td className="py-2.5 text-slate-500">Static metadata not required for cryptographic verification.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. PHYSICAL CLONING LIMITATION — ACADEMIC HONESTY */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 space-y-4">
        <h2 className="text-lg font-extrabold text-amber-950 dark:text-amber-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-600" />
          <span>Academic Honesty: The Physical Cloning Limitation</span>
        </h2>
        <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
          A fundamental requirement for our college BCT viva is recognizing that <strong>a blockchain record alone cannot verify that a physical item is genuine</strong>.
        </p>
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          A bad actor who purchases an authentic product could photograph or copy its Product ID and QR code, printing identical labels onto 10,000 counterfeit items. Anyone scanning those fake boxes would see an "Authentic" digital result.
        </p>
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <strong className="font-bold text-slate-900 dark:text-white block">Defense-In-Depth Architecture:</strong>
          <p>
            SupplyProof solves this when paired with:
            (1) <em>Tamper-evident holographic tape</em> that destroys the QR code upon opening,
            (2) <em>Cryptographic serialized NFC chips</em> embedded inside the product housing,
            (3) <em>First-scan claim tokens</em> that register the consumer as final owner and alert the system on duplicate scans.
          </p>
        </div>
      </section>

      {/* 5. TECH STACK */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <span>Technology Stack</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Smart Contracts</span>
            <span className="font-bold text-slate-900 dark:text-white block">Solidity 0.8.20</span>
            <span className="text-[10px] text-slate-500">OpenZeppelin AccessControl</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">EVM Environment</span>
            <span className="font-bold text-slate-900 dark:text-white block">Hardhat 3.x</span>
            <span className="text-[10px] text-slate-500">Ethers.js v6 Library</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Frontend UI</span>
            <span className="font-bold text-slate-900 dark:text-white block">React 19 + Vite 8</span>
            <span className="text-[10px] text-slate-500">Tailwind CSS 3.4</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Cryptography</span>
            <span className="font-bold text-slate-900 dark:text-white block">SHA-256</span>
            <span className="text-[10px] text-slate-500">Web Cryptography API</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="text-center pt-2">
        <Link
          to="/verify"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95"
        >
          <QrCode className="w-4 h-4" />
          <span>Launch Verification Hub</span>
        </Link>
      </div>

    </div>
  );
}
