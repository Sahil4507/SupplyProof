import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  QrCode, 
  ShieldCheck, 
  Ban, 
  Calendar, 
  Factory, 
  Tag, 
  Fingerprint, 
  Copy, 
  Check, 
  History, 
  ExternalLink,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { getProductById, revokeProductRecord } from '../data/mockProducts';
import { truncateHash, truncateAddress } from '../utils/formatters';
import { isWalletAvailable, revokeProductOnChain, getProductOnChain } from '../services/blockchain';
import StatusBadge from '../components/StatusBadge';
import ProductQRCode from '../components/ProductQRCode';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const activeId = id ? id.trim().toUpperCase() : 'SP-2026-0001';
  
  const [product, setProduct] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Revocation modal state
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const found = getProductById(activeId);
    if (found) {
      setProduct({ ...found });
      setLoading(false);
    } else {
      // Query on-chain smart contract
      getProductOnChain(activeId).then(res => {
        if (res.success && res.product && res.product.productName) {
          setProduct({
            productId: res.product.productId,
            productName: res.product.productName,
            category: res.product.category,
            manufacturerName: res.product.manufacturerName,
            manufacturerId: 'ON-CHAIN-RECORD',
            batchNumber: res.product.batchNumber,
            manufacturingDate: new Date(res.product.registeredAt).toISOString().substring(0, 10),
            productHash: res.product.fingerprintHash,
            status: res.product.status === 1 ? 'REVOKED' : 'AUTHENTIC',
            revocationReason: res.product.revocationReason,
            registeredBy: res.product.registeredBy,
            isLiveOnChain: true,
            events: [
              {
                id: 'ev-1',
                title: 'Factory Minting & Fingerprint Anchor',
                eventType: 'PRODUCT_REGISTERED',
                actor: res.product.registeredBy,
                date: new Date(res.product.registeredAt).toISOString().substring(0, 10),
                details: 'Anchored directly to SupplyProof.sol on EVM distributed ledger.'
              }
            ]
          });
        } else {
          setProduct(null);
        }
      }).catch(() => {
        setProduct(null);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [activeId]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Querying distributed ledger & product registry...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No product was found matching identifier "{id}".
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const handleCopy = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleRevoke = async (e) => {
    e.preventDefault();
    if (!revokeReason.trim()) return;
    setRevoking(true);

    try {
      if (isWalletAvailable()) {
        try {
          await revokeProductOnChain(product.productId, revokeReason);
        } catch (chainErr) {
          console.warn("On-chain revocation fallback to demo store:", chainErr);
        }
      }

      revokeProductRecord(product.productId, revokeReason);
      setProduct(getProductById(product.productId));
      setShowRevokeModal(false);
      setRevokeReason('');
    } catch (err) {
      alert("Revocation failed: " + (err.message || 'Unknown error'));
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>

      {/* 1. PRODUCT OVERVIEW & PASSPORT */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.manufacturerName}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {product.productName}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={product.status} size="md" />
            <Link
              to={`/verify?id=${encodeURIComponent(product.productId)}`}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>
          </div>
        </div>

        {/* Core Passport Grid & QR Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Mobile-Ready Product QR Code */}
          <div className="flex justify-center">
            <ProductQRCode productId={product.productId} size={144} />
          </div>

          {/* Details */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Product ID</span>
              <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">{product.productId}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Batch Number</span>
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{product.batchNumber}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Manufacturing Date</span>
              <span className="font-semibold text-sm text-slate-900 dark:text-white">{product.manufacturingDate}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Current Holder</span>
              <span className="font-mono text-xs text-slate-900 dark:text-white truncate block">
                {truncateAddress(product.currentHolder || product.registeredBy, 6, 4)}
              </span>
            </div>

            <div className="col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Product Overview</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Revoked Warning Banner if revoked */}
        {product.status === 'REVOKED' && (
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <Ban className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase tracking-wider block">OFFICIAL PRODUCT RECALL / REVOCATION NOTICE:</strong>
              <p className="mt-1">{product.revocationReason || 'This product identity was revoked by the manufacturer.'}</p>
              {product.revokedAt && <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 block mt-1">Revoked Timestamp: {product.revokedAt}</span>}
            </div>
          </div>
        )}

        {/* Revoke Action Button (Only if Active) */}
        {product.status !== 'REVOKED' && (
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setShowRevokeModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Revoke Product (Manufacturer Action)</span>
            </button>
          </div>
        )}

      </section>

      {/* 2. CRYPTOGRAPHIC FINGERPRINT & BLOCKCHAIN INFO */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Cryptographic Fingerprint & Blockchain Record</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cryptographic proof permanently anchored on the Ethereum EVM via <code className="font-mono text-blue-600">SupplyProof.sol</code>.
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
            <span>Anchored SHA-256 Digest</span>
            <span className="text-[11px] text-slate-400 font-mono">32 Bytes (256 bits)</span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all font-semibold">
              {product.productHash}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(product.productHash)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              title="Copy Hash"
            >
              {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Transaction Hash</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 truncate block">
                {product.txHash || '0x8f2c3b4a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a...'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Ledger Block Height</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                Block #{product.blockNumber || '4892120'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIFECYCLE EVENT HISTORY TIMELINE */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Product Lifecycle History</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable chronological log of factory registration, inspections, and custody milestones.
          </p>
        </div>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 dark:border-blue-900 space-y-6 my-2">
          {product.events?.map((ev, idx) => (
            <div key={ev.id || idx} className="relative">
              <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                ev.eventType === 'PRODUCT_REVOKED' ? 'bg-amber-500' : 'bg-blue-600'
              }`} />

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{ev.title}</span>
                  <span className="font-mono text-slate-400">{ev.date}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ev.details}
                </p>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Actor: <strong className="text-slate-700 dark:text-slate-300 font-sans">{ev.actor}</strong></span>
                  {ev.txHash && <span>Tx: {truncateHash(ev.txHash, 6, 4)}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Revoke Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Revoke Product Record</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Revoking marks this product identity as <strong>REVOKED</strong> on the blockchain. Consumers scanning this unit will receive an alert. This action cannot be reversed.
            </p>

            <form onSubmit={handleRevoke} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Revocation / Recall Reason *
                </label>
                <textarea
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  placeholder="e.g. Battery batch recall #8821, defective PCB solder, or counterfeit packaging detected..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-xs focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevokeModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={revoking}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                >
                  {revoking ? 'Revoking...' : 'Confirm Revocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
