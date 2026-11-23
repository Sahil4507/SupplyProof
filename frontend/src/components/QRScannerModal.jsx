import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, AlertCircle, CheckCircle2, RefreshCw, QrCode } from 'lucide-react';
import { extractProductId, isValidProductId } from '../utils/crypto';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [cameraError, setCameraError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  // Initialize camera when tab is 'camera'
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError('');
    setScanFeedback(null);
    stopCamera();

    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser. Please use the image upload option or enter the ID manually.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        await videoRef.current.play();
        setCameraActive(true);

        // Check if BarcodeDetector API is natively supported
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          scanIntervalRef.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes && barcodes.length > 0) {
                  const rawValue = barcodes[0].rawValue;
                  handleDetectedString(rawValue);
                }
              } catch (e) {
                // frame detection failed, retry next tick
              }
            }
          }, 400);
        } else {
          // BarcodeDetector not natively available in this browser
          // Fall back gracefully to manual input or file upload
        }
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera permission denied. Please allow camera permissions in your browser address bar, or use the image upload tab.");
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError("No camera device was detected on your system. Please upload a QR image or enter the Product ID.");
      } else {
        setCameraError(`Camera error: ${err.message || 'Unable to start camera stream'}.`);
      }
    }
  };

  const handleDetectedString = (rawString) => {
    if (!rawString) return;
    const extractedId = extractProductId(rawString);

    if (extractedId) {
      setScanFeedback({
        type: 'success',
        message: `Product ID Detected: ${extractedId}`
      });
      setTimeout(() => {
        stopCamera();
        onScanSuccess(extractedId);
        onClose();
      }, 700);
    } else {
      setScanFeedback({
        type: 'error',
        message: `Invalid QR Code: The scanned code is not a valid SupplyProof product passport.`
      });
    }
  };

  // Handle image file selection
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanFeedback(null);

    // Try reading with BarcodeDetector
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise((resolve) => { img.onload = resolve; });

        const barcodes = await barcodeDetector.detect(img);
        if (barcodes && barcodes.length > 0) {
          handleDetectedString(barcodes[0].rawValue);
          return;
        } else {
          setScanFeedback({
            type: 'error',
            message: 'No QR code was detected in the uploaded image. Please ensure the image is clear and well-lit.'
          });
          return;
        }
      } catch (err) {
        console.warn("BarcodeDetector image decode error:", err);
      }
    }

    // Fallback: If BarcodeDetector is not supported, suggest manual entry
    setScanFeedback({
      type: 'error',
      message: 'Client-side QR image decoding requires BarcodeDetector API. Please enter or paste the Product ID below.'
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;

    const extracted = extractProductId(manualInput) || (isValidProductId(manualInput) ? manualInput.trim().toUpperCase() : null);

    if (extracted) {
      stopCamera();
      onScanSuccess(extracted);
      onClose();
    } else {
      setScanFeedback({
        type: 'error',
        message: 'Invalid Format: Product ID must follow SP-YYYY-NNNN format (e.g. SP-2026-0001).'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">QR Code Scanner</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Scan Product Passport QR</p>
            </div>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Scan Feedback Banner */}
        {scanFeedback && (
          <div className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-semibold ${
            scanFeedback.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
          }`}>
            {scanFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{scanFeedback.message}</span>
          </div>
        )}

        {/* Camera View */}
        {activeTab === 'camera' && (
          <div className="space-y-3">
            {cameraError ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Camera Unavailable</span>
                </div>
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-900/60 font-semibold text-amber-900 dark:text-amber-100 text-[11px] inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry Camera</span>
                </button>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square max-h-60 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Target overlay reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-40 h-40 border-2 border-dashed border-blue-400/80 rounded-2xl bg-blue-500/5" />
                </div>

                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 text-xs font-mono">
                    Initializing camera stream...
                  </div>
                )}
              </div>
            )}

            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Align the product passport QR code within the frame to scan automatically.
            </p>
          </div>
        )}

        {/* Upload Image View */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/50">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Click to browse or drop QR image
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WebP or SVG</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Manual Paste / Input Fallback */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Or Paste Scanned Text / Verification URL:
          </span>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. SP-2026-0001 or https://.../verify?id=..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 shadow-xs"
            >
              Parse
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
