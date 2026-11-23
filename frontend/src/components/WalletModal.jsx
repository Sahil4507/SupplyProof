import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, CheckCircle, AlertCircle, ArrowRight, Key } from 'lucide-react';
import { truncateAddress } from '../utils/formatters';
import { isWalletAvailable, connectWallet } from '../services/blockchain';

export default function WalletModal({ isOpen, onClose, isConnected, setIsConnected, walletAddress, setWalletAddress }) {
  if (!isOpen) return null;

  const [connecting, setConnecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleConnectRealWallet = async () => {
    setErrorMsg('');
    setConnecting(true);
    try {
      const { address } = await connectWallet();
      setIsConnected(true);
      setWalletAddress(address);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to connect MetaMask');
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectSimulated = () => {
    setConnecting(true);
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress("0x71C8364237FDb33321558913F2459bAb83eE82A1"); // Authorized Demo Manufacturer
      setConnecting(false);
      onClose();
    }, 350);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    onClose();
  };

  const hasMetaMask = isWalletAvailable();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Web3 Identity & Signer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">SupplyProof Smart Contract Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {isConnected ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Connected Signer
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    MANUFACTURER_ROLE
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-900 dark:text-slate-100 font-bold break-all select-all">
                  {walletAddress}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  Designated Signer: <strong className="text-slate-700 dark:text-slate-300">TechNova Industries Node</strong>
                </p>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                This wallet signs authenticated transactions to call <code className="font-mono font-bold text-blue-600 dark:text-blue-400">registerProduct()</code> and <code className="font-mono font-bold text-blue-600 dark:text-blue-400">revokeProduct()</code> on the SupplyProof Solidity ledger.
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 transition-colors"
              >
                Disconnect Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Connect a Web3 signer to authenticate manufacturer product registrations and audit trail events on the blockchain.
              </p>

              {/* Web3 flow diagram */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Smart Contract Authorization Flow</span>
                <div className="text-slate-700 dark:text-slate-300 flex items-center justify-between text-xs pt-1">
                  <span>Manufacturer</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span>MetaMask / Signer</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="text-blue-600 dark:text-blue-400 font-bold">SupplyProof.sol</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                {hasMetaMask && (
                  <button
                    onClick={handleConnectRealWallet}
                    disabled={connecting}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-blue-500/40 hover:border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Connect MetaMask
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {connecting ? "Requesting accounts..." : "Sign with browser extension"}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      Live Web3
                    </span>
                  </button>
                )}

                <button
                  onClick={handleConnectSimulated}
                  disabled={connecting}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50/20 text-left transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Simulate Demo Manufacturer
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {connecting ? "Activating session..." : "Activate TechNova Industries Signer"}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    Viva Demo
                  </span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Academic Honesty:</strong> SupplyProof operates against a local Hardhat EVM node or demo state. No real mainnet cryptocurrency or private keys are exposed.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
