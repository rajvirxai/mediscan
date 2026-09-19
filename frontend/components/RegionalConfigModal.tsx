'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RegionalConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegionalConfigModal: React.FC<RegionalConfigModalProps> = ({ isOpen, onClose }) => {
  const [selectedCountry, setSelectedCountry] = useState('usa');

  if (!isOpen) return null;

  const countries = [
    { id: 'usa', name: 'UNITED STATES (USA)', flag: '🇺🇸' },
    { id: 'uk', name: 'UNITED KINGDOM', flag: '🇬🇧' },
    { id: 'canada', name: 'CANADA', flag: '🇨🇦' },
    { id: 'colombia', name: 'COLOMBIA', flag: '🇨🇴' },
    { id: 'argentina', name: 'ARGENTINA', flag: '🇦🇷' },
    { id: 'brasil', name: 'BRAZIL', flag: '🇧🇷' },
    { id: 'india', name: 'INDIA', flag: '🇮🇳' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#E5FEEB] space-y-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#3B3B3B]">
              Regional Settings
            </h3>
            <p className="text-[11px] text-[#606060]">
              Please select your country of operation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Country Selector Options */}
        <div className="space-y-2 max-h-60 overflow-y-auto py-1">
          {countries.map((c) => (
            <label
              key={c.id}
              onClick={() => setSelectedCountry(c.id)}
              className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3 text-xs font-semibold transition-all ${
                selectedCountry === c.id
                  ? 'border-[#08A045] bg-[#E5FEEB] text-[#046A38] shadow-xs'
                  : 'border-slate-200 bg-white text-[#3B3B3B] hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{c.flag}</span>
                <span>{c.name}</span>
              </div>
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                  selectedCountry === c.id
                    ? 'border-[#08A045] bg-[#08A045] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedCountry === c.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
              </div>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-[#606060] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl bg-[#08A045] py-2.5 text-xs font-bold text-white hover:bg-[#009441] shadow-md shadow-[#08A045]/20 transition-all active:scale-95"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
