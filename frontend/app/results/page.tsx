'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBottomNav } from '../../components/AppBottomNav';
import { InteractionBanner } from '../../components/InteractionBanner';
import { PatientSummary } from '../../components/PatientSummary';
import { MedicationGrid } from '../../components/MedicationGrid';
import { SafetyTips } from '../../components/SafetyTips';
import WhatsAppOptIn from '../../components/WhatsAppOptIn';
import AlarmNotifier from '../../components/AlarmNotifier';
import { MOCK_FLAGGED_PRESCRIPTION, MOCK_CLEAN_PRESCRIPTION } from '../../data/mockPrescriptions';
import { AnalysisResponse } from '../../types/analysis';
import { 
  ArrowLeft, 
  Download,
  ShieldAlert,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function ResultsPage() {
  const [activeDataset, setActiveDataset] = useState<'flagged' | 'clean'>('flagged');
  const result: AnalysisResponse = activeDataset === 'flagged' ? MOCK_FLAGGED_PRESCRIPTION : MOCK_CLEAN_PRESCRIPTION;

  return (
    <div className="min-h-screen bg-[#F8F8F2] flex flex-col items-center justify-start text-[#23272A] selection:bg-[#D6E8FD]">
      <div className="w-full max-w-md min-h-screen bg-[#F8F8F2] flex flex-col relative pb-28">
        
        {/* Top Header */}
        <header className="bg-white border-b border-[#EDEDE5] pt-6 pb-5 px-5 shadow-xs rounded-b-[28px]">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-bold text-[#79828B] hover:text-[#23272A] transition-colors p-1 -ml-1 rounded-full active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Scan Another Rx</span>
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveDataset('flagged')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                  activeDataset === 'flagged'
                    ? 'bg-[#FDCBB8] text-[#7C2D12] border border-[#F99E7F]'
                    : 'bg-[#FAF9F5] text-[#79828B] border border-[#EDEDE5]'
                }`}
              >
                ⚠️ Flagged Alert
              </button>
              <button
                type="button"
                onClick={() => setActiveDataset('clean')}
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                  activeDataset === 'clean'
                    ? 'bg-[#DFEFB3] text-[#2E4A13] border border-[#BEDB76]'
                    : 'bg-[#FAF9F5] text-[#79828B] border border-[#EDEDE5]'
                }`}
              >
                ✓ Safe Regimen
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#23272A]">
                Prescription Report
              </h1>
              <p className="text-xs text-[#79828B] font-medium">
                ID: {result.id} • Complete Clinical Analysis
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FAF9F5] border border-[#E0E0D8] text-[#79828B] hover:text-[#23272A] transition-colors shadow-2xs active:scale-90"
              title="Export PDF Report"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Results Main Scrollable Container */}
        <main className="px-4 py-4 space-y-4 flex-1 overflow-y-auto">
          {/* 1. Critical Interaction Warning Banner */}
          <InteractionBanner
            hasInteractions={result.hasInteractions}
            warnings={result.interactionWarnings}
          />

          {/* 2. Plain-Language Patient Summary */}
          <PatientSummary
            summary={result.summary}
            patientName={result.patientName}
            prescriber={result.prescriber}
          />

          {/* 3. Structured Medication Grid */}
          <MedicationGrid medications={result.medications} />

          {/* 4. WhatsApp Opt-In & Alarm Notifier */}
          <div className="space-y-3">
            <WhatsAppOptIn />
            <AlarmNotifier />
          </div>

          {/* 5. Safety Precautions & Doctor Questions */}
          <SafetyTips
            safetyTips={result.safetyAndDietaryTips}
            doctorQuestions={result.doctorQuestions}
            awsMetadata={result.awsMetadata}
          />
        </main>

        {/* Multi-page Bottom Nav */}
        <AppBottomNav hasAlert={result.hasInteractions} />
      </div>
    </div>
  );
}
