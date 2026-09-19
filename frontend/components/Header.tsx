'use client';

import React from 'react';
import { RefreshCcw, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface HeaderProps {
  onSelectSample?: (type: 'flagged' | 'clean') => void;
  activePreset?: 'flagged' | 'clean' | null;
  onReset?: () => void;
  hasResults?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  activePreset,
  onReset,
  hasResults,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E9EBED] bg-white/95 backdrop-blur-md px-4 py-3 shadow-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        {/* Brand with Logo */}
        <div
          onClick={onReset}
          className="flex cursor-pointer items-center gap-3 active:opacity-80 transition-opacity"
        >
          <div className="relative h-11 w-11 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mediscan-logo.png"
              alt="MediScan Shield Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-[#111e18]">
                Medi<span className="text-[#13714C]">Scan</span>
              </span>
              <span className="rounded-full bg-[#A2E494]/40 border border-[#3AB67D]/40 px-2 py-0.5 text-[10px] font-bold text-[#13714C]">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Prescription & Safety Radar</p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {hasResults && onReset ? (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-[#E9EBED] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#111e18] active:scale-95 transition-all hover:border-[#3AB67D] hover:bg-white shadow-xs"
            >
              <RefreshCcw className="h-3.5 w-3.5 text-[#13714C]" />
              <span>New Scan</span>
            </button>
          ) : (
            onSelectSample && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onSelectSample('flagged')}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs ${
                    activePreset === 'flagged'
                      ? 'border-rose-400 bg-rose-100 text-rose-800'
                      : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                  title="Conflict Sample"
                >
                  ⚠️ Test Conflict
                </button>
                <button
                  type="button"
                  onClick={() => onSelectSample('clean')}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all active:scale-95 shadow-xs ${
                    activePreset === 'clean'
                      ? 'border-[#3AB67D] bg-[#A2E494]/40 text-[#13714C]'
                      : 'border-[#3AB67D]/30 bg-[#A2E494]/20 text-[#13714C] hover:bg-[#A2E494]/30'
                  }`}
                  title="Safe Sample"
                >
                  ✓ Test Safe
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};
