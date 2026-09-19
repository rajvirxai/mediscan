'use client';

import React from 'react';
import { Cloud, Cpu, ShieldAlert, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { ProcessingStep } from '../types/analysis';

interface ProcessingStatusProps {
  currentStep: ProcessingStep;
  progressPercent: number;
  statusMessage: string;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  currentStep,
  progressPercent,
  statusMessage,
}) => {
  const steps = [
    {
      id: 'uploading_s3',
      label: 'Doc Ingestion',
      subtext: 'Encrypted S3 transmission',
      icon: Cloud,
    },
    {
      id: 'ocr_extraction',
      label: 'Vision OCR',
      subtext: 'MediScan handwriting extraction',
      icon: Cpu,
    },
    {
      id: 'checking_interactions',
      label: 'Safety Radar',
      subtext: 'RxNorm & contraindication graph',
      icon: ShieldAlert,
    },
    {
      id: 'synthesizing_summary',
      label: 'Plain Summary',
      subtext: 'Simplifying for patient care',
      icon: Sparkles,
    },
  ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['uploading_s3', 'ocr_extraction', 'checking_interactions', 'synthesizing_summary', 'completed'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (currentStep === 'completed' || currentIndex > stepIndex) return 'done';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="rounded-3xl border border-[#E9EBED] bg-white p-5 shadow-lg backdrop-blur-xl">
      <div className="text-center max-w-lg mx-auto mb-6">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#A2E494]/30 text-[#13714C] border border-[#3AB67D]/30 mb-2.5 shadow-inner">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h3 className="text-base font-bold text-[#111e18] tracking-tight">
          MediScan AI Processing...
        </h3>
        <p className="mt-0.5 text-xs text-slate-500 font-mono">
          {statusMessage}
        </p>

        {/* Linear Gradient Progress Bar */}
        <div className="mt-4 w-full bg-[#E9EBED] h-2.5 rounded-full overflow-hidden border border-[#E9EBED]">
          <div
            className="bg-gradient-to-r from-[#13714C] via-[#3AB67D] to-[#A2E494] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
          <span>PIPELINE: MEDISCAN</span>
          <span className="text-[#13714C] font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* Grid of Pipeline Stages */}
      <div className="grid grid-cols-2 gap-2">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-2.5 rounded-2xl border p-2.5 transition-all duration-300 ${
                status === 'done'
                  ? 'border-[#3AB67D]/40 bg-[#A2E494]/20 text-[#111e18]'
                  : status === 'active'
                  ? 'border-[#3AB67D] bg-[#A2E494]/30 text-[#111e18] ring-1 ring-[#3AB67D]/50 scale-[1.01] shadow-xs'
                  : 'border-[#E9EBED] bg-[#f8fafc] text-slate-400'
              }`}
            >
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border ${
                  status === 'done'
                    ? 'border-[#3AB67D]/40 bg-[#3AB67D] text-white'
                    : status === 'active'
                    ? 'border-[#3AB67D] bg-[#13714C] text-white animate-pulse'
                    : 'border-[#E9EBED] bg-white text-slate-400'
                }`}
              >
                {status === 'done' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold truncate block">
                  {step.label}
                </span>
                <p className="text-[9px] leading-tight text-slate-500 mt-0.5">
                  {step.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
