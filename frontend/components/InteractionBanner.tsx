'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, PhoneCall, Info } from 'lucide-react';
import { InteractionWarning } from '../types/analysis';

interface InteractionBannerProps {
  hasInteractions: boolean;
  warnings: InteractionWarning[];
}

export const InteractionBanner: React.FC<InteractionBannerProps> = ({
  hasInteractions,
  warnings,
}) => {
  if (!hasInteractions || warnings.length === 0) {
    return (
      <div className="rounded-[26px] bg-[#DFEFB3] p-4.5 bento-shadow border border-[#BEDB76]/60">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#BEDB76] text-[#2E4A13] bento-pill-shadow">
            <ShieldCheck className="h-5 w-5 stroke-[2.4]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#2E4A13] bento-pill-shadow">
                Safe Regimen
              </span>
              <h3 className="text-xs font-bold text-[#1A2E05]">
                No Drug Interactions Detected
              </h3>
            </div>
            <p className="mt-1 text-xs text-[#2E4A13]/85 leading-relaxed">
              All prescribed medications have been cross-checked against the contraindication database. Active ingredients are compatible to take as scheduled.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Top Banner Alert Bar (Pastel Coral) */}
      <div className="rounded-[26px] bg-[#FDCBB8] p-4 bento-shadow border border-[#F99E7F]/70">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F99E7F]/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#F99E7F] text-[#7C2D12] bento-pill-shadow animate-pulse">
              <AlertTriangle className="h-5 w-5 stroke-[2.4]" />
            </div>
            <div>
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-[#EA580C] uppercase tracking-wider bento-pill-shadow">
                ⚠️ Critical Warning
              </span>
              <h3 className="text-xs font-bold text-[#431407] mt-0.5">
                Drug Interaction Flagged
              </h3>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#EA580C] bento-pill-shadow">
            <PhoneCall className="h-3 w-3" /> Call Doctor
          </span>
        </div>

        {/* Warning Cards List */}
        <div className="mt-3 space-y-2.5">
          {warnings.map((warning) => {
            const isHigh = warning.severity === 'high';

            return (
              <div
                key={warning.id}
                className="rounded-2xl bg-white/90 p-3.5 bento-shadow border border-white/60 space-y-2 text-[#23272A]"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#431407]">
                    {warning.drug1} + {warning.drug2}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      isHigh
                        ? 'bg-[#FDCBB8] text-[#7C2D12]'
                        : 'bg-[#FDE6AA] text-[#78350F]'
                    }`}
                  >
                    {warning.severity.toUpperCase()} RISK
                  </span>
                </div>

                <p className="text-xs text-[#522504] leading-relaxed">
                  {warning.clinicalExplanation}
                </p>

                <div className="rounded-xl bg-[#FAF9F5] p-2 text-[11px] text-[#23272A] border border-[#EDEDE5]">
                  <strong className="text-[#EA580C]">Action: </strong>
                  {warning.recommendation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
