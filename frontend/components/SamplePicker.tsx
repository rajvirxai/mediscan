'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  FlaskConical,
  ScanLine,
  Loader2,
} from 'lucide-react';

interface SamplePickerProps {
  onSampleSelect: (file: File) => void;
  disabled?: boolean;
}

const SAMPLES = [
  {
    id: 'sample_01',
    label: 'Warfarin + Aspirin',
    subtitle: 'Flagged Interaction',
    file: 'sample_01_flagged_rx.png',
    icon: ShieldAlert,
    bg: 'bg-[#FDCBB8]/50',
    border: 'border-[#F99E7F]/40',
    hoverBg: 'hover:bg-[#FDCBB8]/80',
    iconColor: 'text-[#EA580C]',
    textPrimary: 'text-[#431407]',
    textSecondary: 'text-[#9A3412]',
    badgeColor: 'bg-[#FEE2E2] text-[#B91C1C]',
    badgeText: 'HIGH RISK',
  },
  {
    id: 'sample_02',
    label: 'Clean Prescription',
    subtitle: 'No Interactions',
    file: 'sample_02_standard_rx.png',
    icon: CheckCircle,
    bg: 'bg-[#DFEFB3]/50',
    border: 'border-[#BEDB76]/50',
    hoverBg: 'hover:bg-[#DFEFB3]/80',
    iconColor: 'text-[#4D7C0F]',
    textPrimary: 'text-[#1A2E05]',
    textSecondary: 'text-[#3F6212]',
    badgeColor: 'bg-[#DCFCE7] text-[#166534]',
    badgeText: 'SAFE',
  },
  {
    id: 'sample_03',
    label: 'CBC Lab Report',
    subtitle: 'Tabular Pathology',
    file: 'sample_03_cbc_lab_report.png',
    icon: FlaskConical,
    bg: 'bg-[#D6E8FD]/40',
    border: 'border-[#93C5FD]/40',
    hoverBg: 'hover:bg-[#D6E8FD]/70',
    iconColor: 'text-[#1E3A8A]',
    textPrimary: 'text-[#1E3A5F]',
    textSecondary: 'text-[#3B82F6]',
    badgeColor: 'bg-[#DBEAFE] text-[#1E40AF]',
    badgeText: 'LAB',
  },
  {
    id: 'sample_04',
    label: 'Noisy Scan',
    subtitle: 'Skew + Stamp + Watermark',
    file: 'sample_04_noisy_rx.png',
    icon: ScanLine,
    bg: 'bg-[#F5F5F4]/70',
    border: 'border-[#D6D3D1]/50',
    hoverBg: 'hover:bg-[#E7E5E4]/70',
    iconColor: 'text-[#57534E]',
    textPrimary: 'text-[#292524]',
    textSecondary: 'text-[#78716C]',
    badgeColor: 'bg-[#F5F5F4] text-[#57534E]',
    badgeText: 'NOISE',
  },
];

export const SamplePicker: React.FC<SamplePickerProps> = ({
  onSampleSelect,
  disabled = false,
}) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePickSample = async (sample: (typeof SAMPLES)[0]) => {
    if (disabled || loadingId) return;
    setLoadingId(sample.id);

    try {
      const res = await fetch(`/samples/${sample.file}`);
      if (!res.ok) throw new Error(`Failed to fetch ${sample.file}`);
      const blob = await res.blob();
      const file = new File([blob], sample.file, { type: 'image/png' });
      onSampleSelect(file);
    } catch (err) {
      console.error('Sample fetch error:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-[24px] bg-white p-3.5 border border-[#EDEDE5] bento-shadow">
      <div className="flex items-center gap-1.5 text-xs text-[#79828B] mb-2.5 px-1">
        <FlaskConical className="h-3.5 w-3.5 text-[#60A5FA]" />
        <span className="font-semibold text-[#23272A]">
          Quick Demo Samples:
        </span>
        <span className="text-[10px] text-[#A1A1AA] ml-auto">Tap to load</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SAMPLES.map((sample) => {
          const Icon = sample.icon;
          const isLoading = loadingId === sample.id;

          return (
            <button
              key={sample.id}
              type="button"
              disabled={disabled || !!loadingId}
              onClick={() => handlePickSample(sample)}
              className={`flex flex-col rounded-2xl ${sample.bg} border ${sample.border} p-2.5 text-left text-xs transition-all ${sample.hoverBg} active:scale-95 ${
                disabled || loadingId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-1.5">
                  {isLoading ? (
                    <Loader2 className={`h-4 w-4 ${sample.iconColor} animate-spin`} />
                  ) : (
                    <Icon className={`h-4 w-4 ${sample.iconColor} flex-shrink-0`} />
                  )}
                  <span className={`font-bold ${sample.textPrimary} text-[11px] leading-tight`}>
                    {sample.label}
                  </span>
                </div>
                <span className={`rounded-full ${sample.badgeColor} px-1.5 py-px text-[8px] font-bold`}>
                  {sample.badgeText}
                </span>
              </div>
              <span className={`text-[10px] ${sample.textSecondary} pl-5.5`}>
                {sample.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
