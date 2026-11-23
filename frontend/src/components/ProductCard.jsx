import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Factory, Tag, ShieldCheck } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/40 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-4">
        
        {/* Top Header: Category & Status */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800/60">
            <Tag className="w-3 h-3" />
            <span>{product.category}</span>
          </span>

          <StatusBadge status={product.status} size="sm" />
        </div>

        {/* Product Name & ID */}
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.productName}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">
              <span>ID:</span>
              <span className="text-blue-600 dark:text-blue-400">{product.productId}</span>
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              Batch: <strong className="text-slate-700 dark:text-slate-300">{product.batchNumber}</strong>
            </span>
          </div>
        </div>

        {/* Manufacturer & Description preview */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-slate-400" />
              <span>Manufacturer</span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {product.manufacturerName}
            </span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-xs pt-1 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Action Links */}
      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <Link
          to={`/verify?id=${encodeURIComponent(product.productId)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Verify Identity</span>
        </Link>

        <Link
          to={`/product/${encodeURIComponent(product.productId)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 dark:bg-slate-100 dark:hover:bg-blue-600 dark:hover:text-white text-white dark:text-slate-900 text-xs font-bold transition-all shadow-xs"
        >
          <span>View Passport</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
