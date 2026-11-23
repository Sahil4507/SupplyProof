import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  QrCode, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Ban, 
  AlertCircle, 
  Fingerprint, 
  Camera, 
  Upload, 
  RotateCcw, 
  ExternalLink,
  History,
  Info,
  Calendar,
  Factory,
  Tag,
  Check,
  Copy,
  Cpu
} from 'lucide-react';
import { getProductById } from '../data/mockProducts';
import { generateProductFingerprint, isValidProductId, extractProductId } from '../utils/crypto';
import { verifyProductOnChain, getProductOnChain } from '../services/blockchain';
import StatusBadge from '../components/StatusBadge';
import QRScannerModal from '../components/QRScannerModal';

export default function VerifyProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id') || '';

  const [inputProductId, setInputProductId] = useState(queryId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Tamper / Mismatch demonstration simulation
  const [tamperMode, setTamperMode] = useState(false);
  const [tamperedField, setTamperedField] = useState('batchNumber');
  const [tamperedValue, setTamperedValue] = useState('COUNTERFEIT-BATCH-99');

  // Perform verification when queryId changes or user submits
  useEffect(() => {
    if (queryId) {
      setInputProductId(queryId);
      performVerification(queryId, tamperMode);
    } else {
      setVerificationResult(null);
    }
  }, [queryId]);

  const performVerification = async (idToVerify, simulateTamper = false) => {
    if (!idToVerify || !idToVerify.trim()) return;
    const cleanId = idToVerify.trim().toUpperCase();
    setIsVerifying(true);

    // CASE E: Format validation (Malformed ID check)
    if (!isValidProductId(cleanId)) {
      setVerificationResult({
        verdict: 'INVALID_FORMAT',
        productId: cleanId,
        title: 'INVALID PRODUCT ID FORMAT',
        subtitle: 'The entered identifier does not conform to the canonical SupplyProof schema.',
        explanation: 'SupplyProof product identifiers follow the canonical schema: SP-YYYY-NNNN (e.g., SP-2026-0001). Please check the code printed on the physical certificate, product packaging, or QR passport.',
        registered: null,
        onChainInfo: null
      });
      setIsVerifying(false);
      return;
    }

    // 1. Check local session/mock registry first
    let registered = getProductById(cleanId);
    let onChainData = null;

    // 2. Query live smart contract if available
    try {
      const chainQuery = await getProductOnChain(cleanId);
      if (chainQuery.success && chainQuery.product && chainQuery.product.productName) {
        onChainData = chainQuery.product;
        // If not in local mock, construct representation from on-chain product
        if (!registered) {
          registered = {
            productId: onChainData.productId,
            productName: onChainData.productName,
            category: onChainData.category,
            manufacturerName: onChainData.manufacturerName,
            manufacturerId: 'ON-CHAIN-CERTIFIED',
            batchNumber: onChainData.batchNumber,
            manufacturingDate: new Date(onChainData.registeredAt).toISOString().substring(0, 10),
            productHash: onChainData.fingerprintHash,
            status: onChainData.status === 1 ? 'REVOKED' : 'AUTHENTIC',
            revocationReason: onChainData.revocationReason,
            registeredBy: onChainData.registeredBy,
            isLiveOnChain: true
          };
        }
      }
    } catch (err) {
      console.warn("Smart contract query notice:", err);
    }

    // CASE D: Unregistered Product Check
    if (!registered) {
      setVerificationResult({
        verdict: 'UNREGISTERED',
        productId: cleanId,
        title: 'UNREGISTERED PRODUCT',
        subtitle: 'No registered product record was found for this Product ID on the blockchain ledger.',
        explanation: 'This identifier does not exist in the official manufacturer registry or EVM smart contract. The product may be a counterfeit, unauthorized replica, or improperly labeled.',
        registered: null,
        onChainInfo: null
      });
      setIsVerifying(false);
      return;
    }

    // 3. Prepare test data (normal or tampered for viva demo)
    const activeData = { ...registered };
    if (simulateTamper) {
      activeData[tamperedField] = tamperedValue;
    }

    // 4. Recalculate deterministic SHA-256 fingerprint from the supplied product data
    const computed = await generateProductFingerprint(activeData);
    
    // Check hash matching
    const registeredHashNormalized = (registered.productHash || '').replace(/^0x/i, '').toUpperCase();
    const computedHashNormalized = computed.hashHex.toUpperCase();
    const hashesMatch = computedHashNormalized === registeredHashNormalized;

    // 5. Query contract verifyProduct method
    let onChainVerification = null;
    try {
      const chainRes = await verifyProductOnChain(cleanId, computed.bytes32Hash);
      if (chainRes.connected) {
        onChainVerification = chainRes;
      }
    } catch (e) {
      // offline / mock fallback
    }

    // 6. Determine definitive verdict
    if (registered.status === 'REVOKED' || (onChainData && onChainData.status === 1)) {
      // CASE B: Revoked Product
      setVerificationResult({
        verdict: 'REVOKED',
        productId: cleanId,
        title: 'PRODUCT REVOKED BY MANUFACTURER',
        subtitle: 'This product identity has been officially revoked or recalled by the authorized manufacturer.',
        explanation: registered.revocationReason || 'This product batch was marked defective or revoked to protect consumers from hazard or counterfeit circulation.',
        registered,
        activeData,
        computedHash: computed.hashHex,
        canonicalString: computed.canonicalString,
        hashesMatch,
        onChainInfo: onChainVerification,
        onChainData
      });
    } else if (!hashesMatch) {
      // CASE C: Record Mismatch (Tampered data)
      setVerificationResult({
        verdict: 'MISMATCH',
        productId: cleanId,
        title: 'RECORD MISMATCH DETECTED',
        subtitle: 'The supplied product information does not match the registered cryptographic fingerprint.',
        explanation: 'One or more essential product attributes (such as batch number, manufacturing date, or model) differ from what was certified at the factory. This indicates physical packaging alteration, forged serial labeling, or data tampering.',
        registered,
        activeData,
        computedHash: computed.hashHex,
        canonicalString: computed.canonicalString,
        hashesMatch: false,
        onChainInfo: onChainVerification,
        onChainData
      });
    } else {
      // CASE A: Authentic Record
      setVerificationResult({
        verdict: 'AUTHENTIC',
        productId: cleanId,
        title: 'AUTHENTIC PRODUCT RECORD',
        subtitle: 'The product identity and specification match the registered blockchain record exactly.',
        explanation: 'The recomputed SHA-256 fingerprint matches the immutable hash anchored on the distributed ledger. All factory metadata is authentic and untampered.',
        registered,
        activeData,
        computedHash: computed.hashHex,
        canonicalString: computed.canonicalString,
        hashesMatch: true,
        onChainInfo: onChainVerification,
        onChainData
      });
    }

    setIsVerifying(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputProductId.trim()) return;
    setSearchParams({ id: inputProductId.trim().toUpperCase() });
  };

  const handleSelectScenario = (id, simulateTamper = false) => {
    setTamperMode(simulateTamper);
    setInputProductId(id);
    setSearchParams({ id });
    if (simulateTamper) {
      performVerification(id, true);
    }
  };

  const handleCopyHash = (text) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleScanSuccess = (scannedId) => {
    setInputProductId(scannedId);
    setSearchParams({ id: scannedId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <QrCode className="w-3.5 h-3.5" />
          <span>Consumer & Retailer Verification Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Verify Product Authenticity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Scan a QR code or enter a Product ID to inspect cryptographic proofs anchored on the blockchain.
        </p>
      </div>

      {/* Main Search & Verification Input with QR Scanner Button */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputProductId}
              onChange={(e) => setInputProductId(e.target.value)}
              placeholder="Enter Product ID (e.g. SP-2026-0001)"
              className="w-full pl-4 pr-12 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Quick QR Scanner Trigger Button inside Input */}
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors"
              title="Open QR Scanner"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>Scan QR</span>
            </button>

            <button
              type="submit"
              disabled={isVerifying}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-xs transition-all shrink-0 active:scale-95 flex items-center justify-center gap-2"
            >
              {isVerifying ? <span>Verifying...</span> : <span>Verify Product</span>}
            </button>
          </div>
        </form>

        {/* 5 VIVA TEST SCENARIOS (1-Click Buttons) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            1-Click Academic Demonstration Scenarios:
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleSelectScenario('SP-2026-0001', false)}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 font-semibold transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Case A: Authentic (SP-2026-0001)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario('SP-2026-0004', false)}
              className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Case B: Revoked Batch (SP-2026-0004)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario('SP-2026-0001', true)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 font-semibold transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Case C: Tampered Fingerprint Mismatch</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario('SP-2026-9999', false)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 font-semibold transition-colors flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Case D: Unregistered Product ID</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectScenario('INVALID-ID-MALFORMED', false)}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 font-semibold transition-colors flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Case E: Invalid Format (Schema Check)</span>
            </button>
          </div>
        </div>
      </div>

      {/* VERIFICATION RESULT CARD */}
      {verificationResult && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* 1. PRIMARY VERDICT BANNER */}
          <div className={`p-6 sm:p-7 rounded-3xl border ${
            verificationResult.verdict === 'AUTHENTIC'
              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : verificationResult.verdict === 'REVOKED'
              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-white ${
                verificationResult.verdict === 'AUTHENTIC' ? 'bg-emerald-600' :
                verificationResult.verdict === 'REVOKED' ? 'bg-amber-600' : 'bg-rose-600'
              }`}>
                {verificationResult.verdict === 'AUTHENTIC' && <ShieldCheck className="w-7 h-7 stroke-[2.5]" />}
                {verificationResult.verdict === 'REVOKED' && <Ban className="w-7 h-7 stroke-[2.5]" />}
                {verificationResult.verdict === 'MISMATCH' && <AlertTriangle className="w-7 h-7 stroke-[2.5]" />}
                {verificationResult.verdict === 'UNREGISTERED' && <XCircle className="w-7 h-7 stroke-[2.5]" />}
                {verificationResult.verdict === 'INVALID_FORMAT' && <AlertCircle className="w-7 h-7 stroke-[2.5]" />}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                    {verificationResult.title}
                  </h2>
                  <StatusBadge status={verificationResult.verdict} size="md" />
                </div>
                <p className="text-xs sm:text-sm font-semibold opacity-90 leading-relaxed">
                  {verificationResult.subtitle}
                </p>
                <p className="text-xs opacity-80 pt-1 leading-relaxed">
                  {verificationResult.explanation}
                </p>

                {/* On-Chain Confirmation Flag */}
                {verificationResult.onChainData && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[11px] font-mono font-bold mt-2">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Direct Hardhat EVM Contract Verified (SupplyProof.sol)</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. REGISTERED DETAILS & CRYPTOGRAPHIC PROOF (When record exists) */}
          {verificationResult.registered && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Verified Product Attributes
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Canonical data stored in the distributed ledger.
                  </p>
                </div>
                <Link
                  to={`/product/${encodeURIComponent(verificationResult.registered.productId)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>View Passport</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Product Name</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">{verificationResult.registered.productName}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Product ID</span>
                  <span className="font-mono font-extrabold text-sm text-blue-600 dark:text-blue-400">{verificationResult.registered.productId}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Manufacturer</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{verificationResult.registered.manufacturerName}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Batch Number</span>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{verificationResult.registered.batchNumber}</span>
                </div>
              </div>

              {/* FINGERPRINT COMPARISON BOX */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-blue-600" />
                    <span>Cryptographic Fingerprint Audit (SHA-256)</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    verificationResult.hashesMatch 
                       ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' 
                       : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                  }`}>
                    {verificationResult.hashesMatch ? 'Exact Match (100%)' : 'Digest Mismatch'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">On-Chain Registered Fingerprint:</span>
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-1">
                      <code className="text-xs font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                        {verificationResult.registered.productHash}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyHash(verificationResult.registered.productHash)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600"
                        title="Copy Hash"
                      >
                        {copiedHash ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] font-bold uppercase block">Recomputed Fingerprint from Supplied Item:</span>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mt-1">
                      <code className={`text-xs font-mono break-all select-all ${
                        verificationResult.hashesMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 font-bold'
                      }`}>
                        {verificationResult.computedHash}
                      </code>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  The client recalculates the SHA-256 digest from canonical parameters. Matching hashes mathematically proves data authenticity.
                </p>
              </div>

              {/* EVENT TIMELINE */}
              {verificationResult.registered.events && (
                <div className="space-y-4 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>Product Lifecycle & Custody Trail</span>
                  </h4>

                  <div className="relative pl-6 border-l-2 border-blue-200 dark:border-blue-900 space-y-5 my-2 text-xs">
                    {verificationResult.registered.events.map((ev, idx) => (
                      <div key={ev.id || idx} className="relative">
                        <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white dark:ring-slate-900 ${
                          ev.eventType === 'PRODUCT_REVOKED' ? 'bg-amber-500' : 'bg-blue-600'
                        }`} />
                        
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{ev.title}</span>
                            <span className="font-mono text-[10px] text-slate-400">{ev.date}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{ev.details}</p>
                          <div className="pt-1 text-[10px] text-slate-400 font-mono">
                            Actor: {ev.actor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* 3. CRUCIAL ACADEMIC DISCLAIMER: PHYSICAL CLONING LIMITATION */}
          <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-bold text-amber-950 dark:text-amber-100">
                Academic Honesty — Physical Cloning Limitation Notice:
              </strong>
              <p>
                A valid blockchain record confirms that this Product ID and its specifications were genuinely registered on-chain. 
                However, <em>blockchain alone cannot verify physical matter</em>. A counterfeiter could print an authentic QR code onto a counterfeit physical box. 
                For complete end-to-end security, digital blockchain identity must be combined with physical anti-tamper seals or cryptographic NFC tags.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

    </div>
  );
}
