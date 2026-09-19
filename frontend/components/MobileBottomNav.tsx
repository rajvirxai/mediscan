'use client';

import React from 'react';
import { Camera, FileText, AlertTriangle, Pill, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'upload' | 'summary' | 'warnings' | 'meds';
  onTabChange: (tab: 'upload' | 'summary' | 'warnings' | 'meds') => void;
  hasInteractions?: boolean;
  hasResults: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  hasInteractions,
  hasResults,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E9EBED] bg-white/95 backdrop-blur-lg px-2 py-2 shadow-lg safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {/* Upload / Scan Tab */}
        <button
          type="button"
          onClick={() => onTabChange('upload')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all active:scale-95 ${
            activeTab === 'upload'
              ? 'text-[#13714C] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Camera className={`h-5 w-5 ${activeTab === 'upload' ? 'text-[#13714C]' : ''}`} />
          <span className="text-[10px]">Scan Rx</span>
        </button>

        {/* Plain Summary Tab */}
        <button
          type="button"
          disabled={!hasResults}
          onClick={() => onTabChange('summary')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all active:scale-95 ${
            !hasResults ? 'opacity-30 cursor-not-allowed text-slate-300' :
            activeTab === 'summary'
              ? 'text-[#13714C] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className={`h-5 w-5 ${activeTab === 'summary' ? 'text-[#13714C]' : ''}`} />
          <span className="text-[10px]">Summary</span>
        </button>

        {/* Warnings / Safety Tab */}
        <button
          type="button"
          disabled={!hasResults}
          onClick={() => onTabChange('warnings')}
          className={`relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all active:scale-95 ${
            !hasResults ? 'opacity-30 cursor-not-allowed text-slate-300' :
            activeTab === 'warnings'
              ? 'text-rose-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {hasInteractions ? (
            <>
              <AlertTriangle className="h-5 w-5 text-rose-600 animate-bounce" />
              <span className="absolute top-1 right-2.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
            </>
          ) : (
            <ShieldCheck className={`h-5 w-5 ${activeTab === 'warnings' ? 'text-[#13714C]' : ''}`} />
          )}
          <span className="text-[10px]">{hasInteractions ? 'Alerts' : 'Safety'}</span>
        </button>

        {/* Medicines Schedule Tab */}
        <button
          type="button"
          disabled={!hasResults}
          onClick={() => onTabChange('meds')}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all active:scale-95 ${
            !hasResults ? 'opacity-30 cursor-not-allowed text-slate-300' :
            activeTab === 'meds'
              ? 'text-[#13714C] font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Pill className={`h-5 w-5 ${activeTab === 'meds' ? 'text-[#13714C]' : ''}`} />
          <span className="text-[10px]">Pills ({hasResults ? 'Active' : '0'})</span>
        </button>
      </div>
    </nav>
  );
};
