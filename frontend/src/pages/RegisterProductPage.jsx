import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Fingerprint, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ExternalLink,
  Factory,
  Tag,
  Hash,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { generateUniqueProductId, generateProductFingerprint, getCanonicalProductString } from '../utils/crypto';
import { registerNewProduct, getProductById } from '../data/mockProducts';
import { isWalletAvailable, registerProductOnChain } from '../services/blockchain';
import { generateQRCodeSVG } from '../utils/qr';

export default function RegisterProductPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    productId: generateUniqueProductId(),
    productName: '',
    category: 'Electronics',
    manufacturerName: 'TechNova Industries',
    manufacturerId: 'MFG-TECHNOVA-01',
    batchNumber: '',
    manufacturingDate: new Date().toISOString().substring(0, 10),
    description: '',
  });

  // Fingerprint calculation state
  const [canonicalString, setCanonicalString] = useState('');
  const [productHash, setProductHash] = useState('');
  const [bytes32Hash, setBytes32Hash] = useState('');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Recalculate deterministic fingerprint on every form change
  useEffect(() => {
    let isMounted = true;
    async function updateFingerprint() {
      const res = await generateProductFingerprint(formData);
      if (isMounted) {
        setCanonicalString(res.canonicalString);
        setProductHash(res.hashHex);
        setBytes32Hash(res.bytes32Hash);
      }
    }
    updateFingerprint();
    return () => { isMounted = false; };
  }, [formData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleRegenerateId = () => {
    handleChange('productId', generateUniqueProductId());
  };

  const handleLoadSample = () => {
    const sampleId = generateUniqueProductId();
    setFormData({
      productId: sampleId,
      productName: 'Apex VR Vision Pro',
      category: 'Electronics',
      manufacturerName: 'TechNova Industries',
      manufacturerId: 'MFG-TECHNOVA-01',
      batchNumber: 'TN-2026-VR09',
      manufacturingDate: '2026-09-01',
      description: 'Spatial computing mixed-reality headset with dual micro-OLED 4K displays and real-time iris biometric authentication.'
    });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validation
    if (!formData.productId.trim()) {
      setErrorMsg('Product ID is required.');
      return;
    }
    if (!formData.productName.trim()) {
      setErrorMsg('Product Name is required.');
      return;
    }
    if (!formData.batchNumber.trim()) {
      setErrorMsg('Batch Number is required.');
      return;
    }

    // Check duplicate in local store
    if (getProductById(formData.productId)) {
      setErrorMsg(`Product ID '${formData.productId}' already exists. Please generate a unique ID.`);
      return;
    }

    setSubmitting(true);

    try {
      // Check if wallet is available and connected for live on-chain registration
      if (isWalletAvailable()) {
        try {
          const txResult = await registerProductOnChain(formData, bytes32Hash);
          const saved = registerNewProduct({
            ...formData,
            productHash,
            txHash: txResult.txHash,
            blockNumber: txResult.blockNumber
          });
          setIsDemoMode(false);
          setRegisteredSuccess(saved);
          return;
        } catch (chainErr) {
          console.warn("On-chain submission fallback to demo mode:", chainErr);
          // If user cancelled or node not available, fall back to demonstration registry
        }
      }

      // Demonstration registry fallback
      const saved = registerNewProduct({
        ...formData,
        productHash,
        registeredBy: "0x71C8364237FDb33321558913F2459bAb83eE82A1"
      });
      setIsDemoMode(true);
      setRegisteredSuccess(saved);
    } catch (err) {
      setErrorMsg(err.message || 'Product registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manufacturer Portal</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Register Manufactured Product
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Anchor a genuine product identity and its cryptographic SHA-256 fingerprint into the distributed ledger.
          </p>
        </div>

        {/* Load Sample Button */}
        <button
          type="button"
          onClick={handleLoadSample}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>⚡ Load Sample Product</span>
        </button>
      </div>

      {/* Registration Success View */}
      {registeredSuccess ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Product Identity Successfully Registered
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isDemoMode 
                  ? "Demonstration Mode — Anchored to Session Registry" 
                  : "Blockchain Confirmed — Recorded via SupplyProof.sol"}
              </span>
            </div>
          </div>

          {/* QR Code & Identity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 items-center">
            
            {/* Rendered Pure SVG QR Code */}
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div 
                className="w-40 h-40 p-2 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center"
                dangerouslySetInnerHTML={{ 
                  __html: generateQRCodeSVG(
                    `${window.location.origin}/verify?id=${registeredSuccess.productId}`,
                    { size: 144 }
                  ) 
                }}
              />
              <span className="text-[11px] font-mono text-slate-500">Scan to Verify</span>
            </div>

            {/* Passport Data */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Product Name</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">{registeredSuccess.productName}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Product ID</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{registeredSuccess.productId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Batch Number</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{registeredSuccess.batchNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Manufacturer</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{registeredSuccess.manufacturerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Category</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{registeredSuccess.category}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Anchored SHA-256 Fingerprint</span>
                <code className="text-[11px] font-mono text-slate-800 dark:text-slate-200 break-all select-all block bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 mt-0.5">
                  {registeredSuccess.productHash}
                </code>
              </div>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/verify?id=${encodeURIComponent(registeredSuccess.productId)}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify Product in Verification Hub</span>
            </Link>

            <Link
              to={`/product/${encodeURIComponent(registeredSuccess.productId)}`}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold inline-flex items-center gap-2"
            >
              <span>View Full Passport</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setRegisteredSuccess(null);
                setFormData({
                  productId: generateUniqueProductId(),
                  productName: '',
                  category: 'Electronics',
                  manufacturerName: 'TechNova Industries',
                  manufacturerId: 'MFG-TECHNOVA-01',
                  batchNumber: '',
                  manufacturingDate: new Date().toISOString().substring(0, 10),
                  description: '',
                });
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Register Another Product
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Product ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Product ID (Unique Identifier) *</span>
                <button
                  type="button"
                  onClick={handleRegenerateId}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Regenerate ID</span>
                </button>
              </label>
              <input
                type="text"
                value={formData.productId}
                onChange={(e) => handleChange('productId', e.target.value)}
                placeholder="SP-2026-0001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 2. Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Name / Model *
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) => handleChange('productName', e.target.value)}
                placeholder="e.g. SmartWatch X"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 3. Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Product Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Audio">Audio</option>
                <option value="Robotics">Robotics</option>
                <option value="Healthcare">Healthcare & MedTech</option>
                <option value="Automotive Parts">Automotive Parts</option>
                <option value="Luxury Goods">Luxury Goods</option>
                <option value="Industrial">Industrial</option>
              </select>
            </div>

            {/* 4. Batch Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Production Batch Number *
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => handleChange('batchNumber', e.target.value)}
                placeholder="e.g. TN-2026-08"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 5. Manufacturer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Manufacturer Name *
              </label>
              <input
                type="text"
                value={formData.manufacturerName}
                onChange={(e) => handleChange('manufacturerName', e.target.value)}
                placeholder="TechNova Industries"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* 6. Manufacturing Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Manufacturing Date *
              </label>
              <input
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => handleChange('manufacturingDate', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Product Description / Hardware Summary (Off-Chain)
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Detailed description, chassis material, warranty references, and inspection notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          {/* LIVE SHA-256 FINGERPRINT PREVIEW */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Fingerprint className="w-4 h-4" />
              <span>Real-Time Cryptographic Fingerprint (SHA-256)</span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              As you fill out the product fields, SupplyProof deterministically normalizes them into a canonical string and calculates its exact SHA-256 hash. This fingerprint is what gets recorded on the blockchain.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Canonical Form:</span>
                <code className="text-[11px] font-mono text-slate-700 dark:text-slate-300 break-all select-all block bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  {canonicalString || 'Waiting for inputs...'}
                </code>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Generated SHA-256 Digest:</span>
                <code className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 break-all select-all block bg-blue-50/60 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200 dark:border-blue-900">
                  {productHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                </code>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Access Control: </span>
              Restricted to authorized <code className="font-mono text-blue-600">MANUFACTURER_ROLE</code>.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              {submitting ? (
                <span>Submitting to Ledger...</span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Register & Anchor on Blockchain</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
