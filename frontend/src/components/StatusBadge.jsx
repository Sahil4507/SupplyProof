import React from 'react';
import { ShieldCheck, XCircle, AlertTriangle, Ban, AlertCircle } from 'lucide-react';

/**
 * Standard Status Badge for SupplyProof
 * Visualizes the core verification states:
 * - AUTHENTIC: Green (Registered & matching hash)
 * - REVOKED: Amber (Recalled or revoked by manufacturer)
 * - MISMATCH / FINGERPRINT MISMATCH: Red (Data fingerprint differs from on-chain hash)
 * - UNREGISTERED: Red (No ledger record found)
 * - INVALID_FORMAT: Orange (Malformed ID format, schema check failed)
 * - SUSPICIOUS: Amber (Duplicate claim or irregular history)
 */
export default function StatusBadge({ status = "AUTHENTIC", size = "md", showIcon = true }) {
  const normStatus = (status || "").toUpperCase();

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-bold",
    lg: "text-sm px-3.5 py-1.5 gap-2 font-extrabold",
  }[size] || "text-xs px-2.5 py-1 gap-1.5 font-bold";

  if (normStatus === "AUTHENTIC" || normStatus === "ACTIVE" || normStatus === "AUTHENTIC RECORD") {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
        <span>Authentic Record</span>
      </span>
    );
  }

  if (normStatus === "REVOKED" || normStatus === "PRODUCT REVOKED") {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <Ban className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
        <span>Product Revoked</span>
      </span>
    );
  }

  if (normStatus === "MISMATCH" || normStatus === "RECORD MISMATCH" || normStatus === "FINGERPRINT MISMATCH") {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />}
        <span>Fingerprint Mismatch</span>
      </span>
    );
  }

  if (normStatus === "UNREGISTERED" || normStatus === "UNREGISTERED PRODUCT") {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />}
        <span>Unregistered Product</span>
      </span>
    );
  }

  if (
    normStatus === "INVALID" || 
    normStatus === "INVALID_FORMAT" || 
    normStatus === "INVALID FORMAT" || 
    normStatus === "INVALID PRODUCT ID FORMAT"
  ) {
    return (
      <span className={`inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 shrink-0" />}
        <span>Invalid Product ID Format</span>
      </span>
    );
  }

  if (normStatus === "SUSPICIOUS") {
    return (
      <span className={`inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 tracking-wide uppercase ${sizeClasses}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />}
        <span>Suspicious Record</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}>
      <span>{status}</span>
    </span>
  );
}
