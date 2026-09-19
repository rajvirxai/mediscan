'use client';

import React from 'react';
import { ShieldAlert, HelpCircle, Cloud } from 'lucide-react';
import { AnalysisResponse } from '../types/analysis';

interface SafetyTipsProps {
  safetyTips: string[];
  doctorQuestions: string[];
  awsMetadata?: AnalysisResponse['awsMetadata'];
}

export const SafetyTips: React.FC<SafetyTipsProps> = ({
  safetyTips,
  doctorQuestions,
  awsMetadata,
}) => {
  return (
    <div className="space-y-3.5">
      {/* Safety & Dietary Lifestyle Tips (Pastel Warm Amber accent) */}
      <div className="rounded-[26px] border border-[#EDEDE5] bg-white p-4.5 bento-shadow space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FDE6AA] text-[#78350F] bento-pill-shadow">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-[#23272A] text-xs sm:text-sm">
            Dietary & Lifestyle Precautions
          </h3>
        </div>

        <ul className="space-y-2">
          {safetyTips.map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-[#FAF9F5] p-2.5 border border-[#EDEDE5] text-xs text-[#23272A]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#F5CA68] mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Questions to Ask Doctor (Pastel Sage accent) */}
      <div className="rounded-[26px] border border-[#EDEDE5] bg-white p-4.5 bento-shadow space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DFEFB3] text-[#2E4A13] bento-pill-shadow">
            <HelpCircle className="h-4 w-4" />
          </div>
          <h3 className="font-bold text-[#23272A] text-xs sm:text-sm">
            Questions for Your Doctor
          </h3>
        </div>

        <ul className="space-y-2">
          {doctorQuestions.map((q, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-[#FAF9F5] p-2.5 border border-[#EDEDE5] text-xs text-[#23272A]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#BEDB76] mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Clinical Processing Metadata Badge (Pastel Blue accent) */}
      {awsMetadata && (
        <div className="rounded-2xl bg-[#D6E8FD]/50 border border-[#93C5FD]/40 p-3 flex items-center justify-between text-[10px] text-[#1E3A8A]">
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-[#3B82F6]" />
            <span>Analysis: {awsMetadata.ocrEngine} • {awsMetadata.model}</span>
          </div>
          <span className="font-mono font-bold bg-white/80 px-2 py-0.5 rounded-full">
            {awsMetadata.latencyMs}ms
          </span>
        </div>
      )}
    </div>
  );
};
