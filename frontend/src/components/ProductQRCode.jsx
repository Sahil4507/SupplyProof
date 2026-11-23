import React, { useState } from 'react';
import { QrCode, Smartphone, Copy, Check, Settings2, Globe, ExternalLink } from 'lucide-react';
import { generateQRCodeSVG } from '../utils/qr';
import { getVerificationUrl, getQrBaseUrl, setCustomQrBaseUrl, DEFAULT_LAN_IP } from '../utils/qrUrl';

/**
 * Reusable Product QR Code Component
 * Team: HashGuard | Project: SupplyProof
 * 
 * Generates an offline vector SVG QR code with a mobile-friendly verification URL.
 * Automatically resolves localhost to the computer's active LAN IP (e.g. 192.168.1.4)
 * or deployed production URL, enabling direct phone scanning.
 */
export default function ProductQRCode({ productId, size = 144, showDetails = true }) {
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [customHost, setCustomHost] = useState(getQrBaseUrl());

  const currentUrl = getVerificationUrl(productId);
  const isLan = currentUrl.includes('192.168.') || currentUrl.includes('10.') || currentUrl.includes('172.');
  const isLocalhost = currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1');

  const handleCopyUrl = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(currentUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveCustomHost = (e) => {
    e.preventDefault();
    setCustomQrBaseUrl(customHost);
    setShowConfig(false);
  };

  const handleResetHost = () => {
    setCustomQrBaseUrl('');
    setCustomHost(getQrBaseUrl());
    setShowConfig(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-center w-full max-w-xs mx-auto">
      
      {/* Rendered Pure SVG QR Code */}
      <div 
        className="p-2.5 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center transition-transform hover:scale-102"
        dangerouslySetInnerHTML={{ 
          __html: generateQRCodeSVG(currentUrl, { size }) 
        }}
      />

      {/* Product ID & Mobile Badge */}
      <div className="space-y-1">
        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block select-all">
          {productId}
        </span>
        
        {isLan && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            <Smartphone className="w-3 h-3" />
            <span>Mobile-Ready (Wi-Fi)</span>
          </div>
        )}

        {!isLan && !isLocalhost && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-700 dark:text-blue-300">
            <Globe className="w-3 h-3" />
            <span>Cloud Deployed</span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="w-full space-y-2 pt-1">
          {/* Target URL display with copy action */}
          <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono">
            <span className="truncate text-slate-600 dark:text-slate-400 select-all" title={currentUrl}>
              {currentUrl}
            </span>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-1 rounded text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 shrink-0"
              title="Copy mobile verification URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            Scan with any mobile camera on the same Wi-Fi network to verify this product identity.
          </p>

          {/* Network Host Settings Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="text-[10px] text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <Settings2 className="w-3 h-3" />
              <span>{showConfig ? 'Hide Network Settings' : 'Network / Host Settings'}</span>
            </button>

            {showConfig && (
              <form onSubmit={handleSaveCustomHost} className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-left animate-fadeIn">
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 block">
                  QR Base URL / Host IP:
                </label>
                <input
                  type="text"
                  value={customHost}
                  onChange={(e) => setCustomHost(e.target.value)}
                  placeholder={`http://${DEFAULT_LAN_IP}:5173`}
                  className="w-full px-2 py-1 text-[11px] font-mono rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <div className="flex gap-1.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold"
                  >
                    Apply Host
                  </button>
                  <button
                    type="button"
                    onClick={handleResetHost}
                    className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-[10px]"
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
