import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, AlertCircle, CheckCircle2, RefreshCw, QrCode, ShieldAlert, ExternalLink, Smartphone } from 'lucide-react';
import jsQR from 'jsqr';
import { extractProductId, isValidProductId } from '../utils/crypto';

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'
  const [cameraError, setCameraError] = useState(null); // { type: string, title: string, message: string, suggestion?: string }
  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [scanFeedback, setScanFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize camera when active tab is 'camera'
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

  // Clean up if modal is closed
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      } catch (e) {
        console.warn("Track stop error:", e);
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    setScanFeedback(null);
    stopCamera();

    // 1. Check for Insecure Context (HTTP on non-localhost)
    const isSecure = typeof window !== 'undefined' && (
      window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );

    if (!isSecure) {
      setCameraError({
        type: 'INSECURE_CONTEXT',
        title: 'Insecure Connection (HTTP)',
        message: 'Modern mobile browsers strictly require HTTPS to access camera hardware. Connecting via plain HTTP over LAN disables camera APIs.',
        suggestion: 'To scan on your phone, test on the deployed HTTPS website (e.g. Vercel), or use the "Upload Image" tab below.'
      });
      return;
    }

    // 2. Check Browser Support
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError({
        type: 'NOT_SUPPORTED',
        title: 'Camera Not Supported',
        message: 'Your browser does not support the WebRTC MediaDevices API.',
        suggestion: 'Please update your browser, or use the "Upload Image" or "Paste URL" options below.'
      });
      return;
    }

    // 3. Request Media Stream
    try {
      let stream;
      try {
        // Preferred: rear environment camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (constraintErr) {
        // Fallback for laptops/webcams where facingMode 'environment' throws OverconstrainedError
        console.warn("Retrying with generic video constraints:", constraintErr);
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.playsInline = true;
        videoRef.current.muted = true;
        videoRef.current.autoplay = true;

        await videoRef.current.play();
        setCameraActive(true);

        // Offscreen canvas for frame extraction
        if (!canvasRef.current) {
          canvasRef.current = document.createElement('canvas');
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        // Continuous real-time frame scanning loop
        scanIntervalRef.current = setInterval(() => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            const video = videoRef.current;
            const w = video.videoWidth;
            const h = video.videoHeight;

            if (w > 0 && h > 0) {
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(video, 0, 0, w, h);
              const imageData = ctx.getImageData(0, 0, w, h);

              try {
                const code = jsQR(imageData.data, w, h, {
                  inversionAttempts: "dontInvert"
                });

                if (code && code.data) {
                  handleDetectedString(code.data);
                }
              } catch (decodeErr) {
                // Ignore transient frame decode failure
              }
            }
          }
        }, 200);
      }
    } catch (err) {
      console.warn("Camera access error:", err);
      const name = err.name || '';

      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setCameraError({
          type: 'PERMISSION_DENIED',
          title: 'Camera Permission Denied',
          message: 'Your browser has blocked camera permissions for this site.',
          suggestion: 'Tap the lock/settings icon in your browser address bar, set Camera to "Allow", and click Retry Camera below.'
        });
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setCameraError({
          type: 'NO_DEVICE',
          title: 'No Camera Detected',
          message: 'No video capture hardware was found on this system.',
          suggestion: 'Please use the "Upload Image" tab or enter the Product ID manually.'
        });
      } else if (name === 'NotReadableError' || name === 'TrackStartError') {
        setCameraError({
          type: 'IN_USE',
          title: 'Camera Already in Use',
          message: 'Another application or browser tab is currently using the camera hardware.',
          suggestion: 'Please close any other camera apps and click Retry Camera below.'
        });
      } else {
        setCameraError({
          type: 'UNKNOWN',
          title: 'Camera Initialization Error',
          message: err.message || 'Unable to access video stream.',
          suggestion: 'Please try clicking Retry Camera or use the "Upload Image" tab.'
        });
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
      }, 500);
    } else {
      setScanFeedback({
        type: 'error',
        message: `Invalid QR Code: The scanned QR code is not a valid SupplyProof product passport.`
      });
    }
  };

  // Handle image file selection (decodes directly via jsQR)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanFeedback(null);

    try {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      URL.revokeObjectURL(objectUrl);

      if (code && code.data) {
        handleDetectedString(code.data);
      } else {
        setScanFeedback({
          type: 'error',
          message: 'No QR code was detected in the uploaded image. Please ensure the image is clear and well-lit.'
        });
      }
    } catch (err) {
      console.warn("Image decode error:", err);
      setScanFeedback({
        type: 'error',
        message: 'Failed to process image. Please enter the Product ID below.'
      });
    }
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
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-100">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{cameraError.title}</span>
                </div>
                <p className="leading-relaxed opacity-90">{cameraError.message}</p>
                {cameraError.suggestion && (
                  <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-white/60 dark:bg-slate-900/60 p-2 rounded-xl border border-amber-200 dark:border-amber-900/40">
                    💡 {cameraError.suggestion}
                  </p>
                )}
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 font-semibold text-amber-900 dark:text-amber-100 text-xs"
                  >
                    Use Image Upload
                  </button>
                </div>
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

        {/* Upload Image View (Decodes directly via jsQR) */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/50">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Click to browse or drop QR image
              </span>
              <span className="text-[10px] text-slate-400">Decodes PNG, JPG, WebP directly</span>
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
