import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Tag, 
  Filter, 
  X, 
  ShieldCheck, 
  PlusCircle, 
  Layers, 
  AlertTriangle, 
  Ban, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getAllProducts, searchProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialCategory = searchParams.get('cat') || 'ALL';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const categories = [
    'ALL', 
    'Electronics', 
    'Personal Care', 
    'Home Products', 
    'Accessories', 
    'Audio', 
    'Robotics', 
    'Healthcare'
  ];

  // Specific user-requested scenario filters
  const statusFilters = [
    { id: 'ALL', label: 'All Products' },
    { id: 'VERIFIED', label: 'Verified' },
    { id: 'RECALLED', label: 'Recalled' },
    { id: 'ISSUES', label: 'Issues' },
    { id: 'UNREGISTERED', label: 'Unregistered' }
  ];

  const filteredProducts = useMemo(() => {
    return searchProducts(searchQuery, selectedCategory, selectedStatus);
  }, [searchQuery, selectedCategory, selectedStatus]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSearchParams({});
  };

  const handleSelectStatus = (statusId) => {
    setSelectedStatus(statusId);
    if (statusId === 'ALL') {
      const next = new URLSearchParams(searchParams);
      next.delete('status');
      setSearchParams(next);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), status: statusId });
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'ALL') {
      const next = new URLSearchParams(searchParams);
      next.delete('cat');
      setSearchParams(next);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), cat });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>Demonstration Product Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Product Discovery & Ledger Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Explore curated demonstration products across verified, recalled, quality advisory, and unregistered states.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/batch-recall"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-bold text-xs shadow-xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Batch Recall Demo</span>
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register New Product</span>
          </Link>
        </div>
      </div>

      {/* Feature Highlight Banner: Batch Recall Demo */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Viva Feature</span>
          </div>
          <h2 className="text-base sm:text-lg font-black tracking-tight">
            Manufacturer Batch Recall Demonstration
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Simulate how enterprise manufacturers query all registered serial units belonging to an affected production batch and broadcast recall alerts.
          </p>
        </div>
        <Link
          to="/batch-recall"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-slate-900 font-extrabold text-xs shrink-0 transition-transform active:scale-95 self-start sm:self-auto"
        >
          <span>Launch Batch Recall Demo</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </Link>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Product ID, Name, Batch (e.g. TN-2026-08), or Manufacturer..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Clear All Button if active filters */}
          {(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 1. Situation Status Filters (All, Verified, Recalled, Issues, Unregistered) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider text-[11px]">
            Filter by Situation:
          </span>
          {statusFilters.map((st) => {
            const active = selectedStatus === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleSelectStatus(st.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-blue-600 dark:text-white ring-2 ring-slate-900/10'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st.label}
              </button>
            );
          })}
        </div>

        {/* 2. Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider text-[11px] shrink-0">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleSelectCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.productId} product={prod} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-800 dark:text-white">
              No products matched your active filters.
            </p>
            <p className="text-xs text-slate-400">
              Try adjusting your search query, status filter, or category selection.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Educational Notice on Demo Ratings vs. Blockchain Proof */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
        <strong className="text-slate-700 dark:text-slate-300 font-bold block">
          Academic Rigor & Data Integrity Distinction:
        </strong>
        <p>
          Demonstration customer ratings (e.g. ⭐ 4.9) and review sentiments represent simulated consumer satisfaction. They do not alter, prove, or replace cryptographic SHA-256 fingerprint validation anchored on the blockchain. A high customer rating does not guarantee authenticity, and a batch recall does not imply counterfeit origin.
        </p>
      </div>

    </div>
  );
}
