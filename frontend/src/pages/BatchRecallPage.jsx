import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Ban, 
  RotateCcw, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Factory, 
  Tag, 
  QrCode, 
  ExternalLink, 
  Info, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { getAllProducts, getDistinctBatches, getProductsByBatch } from '../data/mockProducts';
import StatusBadge from '../components/StatusBadge';

export default function BatchRecallPage() {
  const allBatches = getDistinctBatches();
  
  // Default selected batch to PH-2025-09 (the medical ring recall demo)
  const [selectedBatchNumber, setSelectedBatchNumber] = useState('PH-2025-09');
  const [recallReason, setRecallReason] = useState(
    'Battery cell thermal runaway risk detected during rapid wireless charging cycles.'
  );
  const [isSimulationActive, setIsSimulationActive] = useState(true);

  // Selected batch metadata
  const currentBatchMeta = allBatches.find(b => b.batchNumber === selectedBatchNumber) || allBatches[0];
  const affectedProducts = getProductsByBatch(selectedBatchNumber);

  const handleSelectBatch = (batchNum) => {
    setSelectedBatchNumber(batchNum);
    const meta = allBatches.find(b => b.batchNumber === batchNum);
    if (meta && meta.reason) {
      setRecallReason(meta.reason);
      setIsSimulationActive(true);
    } else {
      setRecallReason('Packaging seal integrity defect flagged during regional logistics audit.');
      setIsSimulationActive(false);
    }
  };

  const handleSimulateRecall = () => {
    setIsSimulationActive(true);
  };

  const handleResetSimulation = () => {
    setIsSimulationActive(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Academic Demonstration Feature</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Batch Recall Demonstration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Demonstrates how authorized manufacturers and regulators identify, query, and isolate defective product batches across the distributed supply chain.
        </p>
      </div>

      {/* Crucial Academic Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3 leading-relaxed">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold uppercase tracking-wider block text-blue-950 dark:text-blue-100 mb-0.5">
            Demonstration Simulation Notice:
          </strong>
          <p>
            This feature simulates enterprise batch recall tracing in memory. It uses demonstration data and does not broadcast real blockchain transactions or alter stored records. Real-world recalls execute through authorized calls to <code className="font-mono text-blue-700 dark:text-blue-300">revokeProduct()</code> in <code className="font-mono">SupplyProof.sol</code>.
          </p>
        </div>
      </div>

      {/* Control Panel: Select Batch & Set Recall Reason */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Select Demonstration Production Batch</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose a manufactured batch to inspect registered serial identities and simulate recall broadcast.
          </p>
        </div>

        {/* Batch Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {allBatches.map((b) => (
            <button
              key={b.batchNumber}
              type="button"
              onClick={() => handleSelectBatch(b.batchNumber)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedBatchNumber === b.batchNumber
                  ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 dark:border-blue-500 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono font-bold text-xs">{b.batchNumber}</span>
                {b.isAlreadyRecalled && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 uppercase">
                    Recalled
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">
                {b.manufacturerName}
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {b.category} • {b.count} unit{b.count > 1 ? 's' : ''}
              </span>
            </button>
          ))}
        </div>

        {/* Recall Reason Input & Simulation Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Simulated Recall Stated Reason:
            </label>
            <input
              type="text"
              value={recallReason}
              onChange={(e) => setRecallReason(e.target.value)}
              placeholder="e.g. Defective lithium cell thermal runaway risk during rapid charging..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateRecall}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Simulate Recall for Batch {selectedBatchNumber}</span>
              </button>

              <button
                type="button"
                onClick={handleResetSimulation}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>

            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Simulation State: <strong className={isSimulationActive ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {isSimulationActive ? 'RECALL SIMULATED' : 'STANDARD / ACTIVE'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Recall Impact & Affected Units */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Affected Products in Batch</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">({selectedBatchNumber})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manufacturer: <strong>{currentBatchMeta?.manufacturerName}</strong> • Category: <strong>{currentBatchMeta?.category}</strong>
            </p>
          </div>

          <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
            isSimulationActive
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
          }`}>
            {isSimulationActive ? 'Recall Flag Active' : 'No Recall Active'}
          </span>
        </div>

        {/* Active Simulation Alert Card */}
        {isSimulationActive && (
          <div className="p-5 rounded-3xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-2 text-xs text-amber-950 dark:text-amber-100 animate-fadeIn">
            <div className="flex items-center gap-2 font-black uppercase tracking-wide text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Simulated Recall Broadcast Warning</span>
            </div>
            <p className="leading-relaxed">
              <strong>Recall Justification:</strong> {recallReason}
            </p>
            <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 leading-relaxed pt-1">
              Consumers or retailers scanning QR passports for products in this batch will immediately receive a <strong>PRODUCT REVOKED</strong> alert on the verification portal.
            </p>
          </div>
        )}

        {/* Affected Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {affectedProducts.map((prod) => (
            <div
              key={prod.productId}
              className={`p-6 rounded-3xl border transition-all space-y-5 flex flex-col justify-between ${
                isSimulationActive
                  ? 'bg-amber-50/30 dark:bg-amber-950/10 border-amber-300 dark:border-amber-800/80 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {prod.productId}
                  </span>

                  {isSimulationActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold uppercase border border-amber-300 dark:border-amber-700">
                      <Ban className="w-3 h-3 text-amber-600" />
                      <span>Simulated Recall</span>
                    </span>
                  ) : (
                    <StatusBadge status={prod.status} size="sm" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {prod.productName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {prod.description}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batch Code:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{prod.batchNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Minted Date:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{prod.manufacturingDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cryptographic Digest:</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[180px]">{prod.productHash}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  to={`/verify?id=${encodeURIComponent(prod.productId)}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Test in Verification Hub</span>
                </Link>

                <Link
                  to={`/product/${encodeURIComponent(prod.productId)}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-600 text-white dark:text-slate-900 dark:hover:text-white text-xs font-bold transition-all shadow-xs"
                >
                  <span>View Passport</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
