import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  QrCode, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Fingerprint, 
  Lock, 
  AlertTriangle, 
  Ban, 
  FileCheck2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { getAllProducts, getProductById } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();
  const featuredProducts = getAllProducts().slice(0, 3);

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    navigate(`/verify?id=${encodeURIComponent(searchId.trim())}`);
  };

  const sampleQuickIds = [
    { id: 'SP-2026-0001', label: 'Authentic SmartWatch' },
    { id: 'SP-2026-0004', label: 'Revoked Batch Demo' },
    { id: 'SP-9999-9999', label: 'Unregistered Demo' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-10 sm:py-16">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Project & Team Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Team HashGuard • BCT Academic Capstone</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight sm:leading-none">
          Blockchain-Based Product Identity & <span className="text-blue-600 dark:text-blue-400">Counterfeit Detection</span>
        </h1>

        {/* Subtitle / Value Proposition */}
        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
          SupplyProof issues tamper-resistant digital identities for manufactured goods. Verify canonical product fingerprints, detect revoked or altered batches, and protect consumers from counterfeit fraud.
        </p>

        {/* Two Main Call-To-Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Product</span>
          </Link>

          <Link
            to="/verify"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-extrabold text-sm border border-slate-200 dark:border-slate-800 shadow-xs transition-all active:scale-95"
          >
            <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Verify Product</span>
          </Link>
        </div>
      </section>

      {/* 2. INSTANT VERIFICATION SEARCH BAR */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Instant Product Verification</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter any SupplyProof Product ID (or scan a QR code) to inspect its blockchain registration status.
            </p>
          </div>

          <form onSubmit={handleQuickVerify} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. SP-2026-0001"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-600 dark:hover:text-white text-white dark:text-slate-900 text-sm font-bold shadow-xs transition-all shrink-0 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Verify ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Viva Demo Scenarios:</span>
            {sampleQuickIds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/verify?id=${encodeURIComponent(item.id)}`)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-mono text-[11px] font-semibold transition-colors border border-slate-200 dark:border-slate-700"
              >
                {item.id} ({item.label})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HOW SUPPLYPROOF WORKS (ARCHITECTURE FLOW) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How SupplyProof Works
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A deterministic cryptographic pipeline protecting products from the assembly line to the end consumer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Product ID Generation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every newly manufactured unit receives a permanent, collision-resistant identifier (e.g. <code className="font-mono text-blue-600">SP-2026-0001</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              SHA-256 Fingerprinting
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Canonical fields (Product ID, Name, Manufacturer ID, Batch, Date) are normalized and hashed into a 32-byte cryptographic fingerprint.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Smart Contract Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Authorized manufacturers (<code className="font-mono text-purple-600">MANUFACTURER_ROLE</code>) commit the fingerprint and metadata to <code className="font-mono text-purple-600">SupplyProof.sol</code>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Public QR Verification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Consumers scan the product QR code. The app recomputes the fingerprint and verifies against the immutable on-chain record.
            </p>
          </div>

        </div>
      </section>

      {/* 4. KEY DIFFERENTIATION: WHY WE FOCUS ON PRODUCT IDENTITY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Academic Differentiation • Team HashGuard</span>
          </div>

          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Product Identity vs Generic Supply Chain Tracking
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Many blockchain projects claim to be "end-to-end supply chain trackers," resulting in bloated databases logging trivial courier movements. SupplyProof specifically attacks the <strong>counterfeit problem</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <Fingerprint className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Cryptographic Fingerprint</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Any post-manufacturing modification to batch, date, or model immediately invalidates the SHA-256 digest.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <Ban className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Active Revocation</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manufacturers can instantly revoke compromised or recalled batches on-chain without altering historical audit logs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Role-Based Access</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Only certified manufacturer nodes can register products; public users can freely audit and verify records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED DEMONSTRATION PRODUCTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Demonstration Products
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore authentic registered records, inspect event timelines, and test revocation states.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <span>View All Registry Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
}
