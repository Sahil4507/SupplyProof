import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          {/* Logo & Identity */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                SUPPLY<span className="text-blue-600 dark:text-blue-400">PROOF</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono">
                Team HashGuard
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Register Product
            </Link>
            <Link to="/verify" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Verify Product
            </Link>
            <Link to="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Products Registry
            </Link>
            <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About & BCT Viva
            </Link>
          </div>
        </div>

        {/* Academic Notice & Limitations */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-slate-400 gap-4 leading-relaxed">
          <p className="max-w-2xl">
            <strong>SupplyProof</strong> is an academic Blockchain Technology (BCT) prototype engineered by Team HashGuard. Demonstrates cryptographic product fingerprinting, smart contract access control, and counterfeit detection.
          </p>
          <div className="font-mono text-[11px] shrink-0">
            © 2026 Team HashGuard • MIT License
          </div>
        </div>
      </div>
    </footer>
  );
}
