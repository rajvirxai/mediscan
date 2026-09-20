'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UploadDropzone } from '../components/UploadDropzone';
import { FilePreview } from '../components/FilePreview';
import { ProcessingStatus } from '../components/ProcessingStatus';
import { AppBottomNav } from '../components/AppBottomNav';
import { RegionalConfigModal } from '../components/RegionalConfigModal';
import { AnalysisResponse, ProcessingStep } from '../types/analysis';
import { analyzePrescriptionDocument } from '../services/analyzerService';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  ScanLine,
  Globe,
  Bell,
  Camera,
  History
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | { name: string; type: string; size: number; previewUrl?: string } | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [activePreset, setActivePreset] = useState<'flagged' | 'clean' | null>(null);
  const [isRegionalOpen, setIsRegionalOpen] = useState<boolean>(false);

  const fileInputHiddenRef = useRef<HTMLInputElement>(null);

  // Handle new file selection from dropzone
  const handleFileSelect = (file: File | { name: string; type: string; size: number }) => {
    setSelectedFile(file);
    setActivePreset(null);
    setProcessingStep('idle');
  };

  // Instant preset injector
  const handleSelectPreset = async (preset: 'flagged' | 'clean') => {
    setActivePreset(preset);
    const mockFile =
      preset === 'flagged'
        ? {
            name: 'Dr_Sharma_Prescription_Cardiology.png',
            type: 'image/png',
            size: 1468006,
          }
        : {
            name: 'Dr_Patel_Pediatric_ENT_Prescription.pdf',
            type: 'application/pdf',
            size: 839680,
          };

    setSelectedFile(mockFile);
    await runAnalysis(mockFile, preset);
  };

  // Trigger analysis execution & navigate to /results
  const runAnalysis = async (
    fileToAnalyze = selectedFile,
    forcedPreset: 'flagged' | 'clean' | 'auto' = activePreset || 'auto'
  ) => {
    if (!fileToAnalyze) return;

    setProcessingStep('uploading_s3');
    setProgressPercent(15);
    setStatusMessage('Please wait... Analyzing clinical prescription...');

    try {
      const result = await analyzePrescriptionDocument(fileToAnalyze, {
        forcePreset: forcedPreset,
        onProgress: (step, percent, msg) => {
          setProcessingStep(step);
          setProgressPercent(percent);
          setStatusMessage(msg);
        },
      });

      setProcessingStep('completed');

      // Save dynamic report to sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('mediscan_active_report', JSON.stringify(result));
      }

      // Navigate to results page
      setTimeout(() => {
        router.push('/results');
      }, 500);
    } catch (err) {
      console.error('Analysis error:', err);
      setProcessingStep('error');
      setStatusMessage('Error processing prescription.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setProcessingStep('idle');
    setProgressPercent(0);
    setStatusMessage('');
    setActivePreset(null);
  };

  const isAnalyzing = processingStep !== 'idle' && processingStep !== 'completed' && processingStep !== 'error';

  return (
    <div className="min-h-screen bg-[#F8F8F2] flex flex-col items-center justify-start text-[#23272A] selection:bg-[#D6E8FD] selection:text-[#1E3A8A]">
      {/* Mobile Web Frame Container */}
      <div className="w-full max-w-md min-h-screen bg-[#F8F8F2] flex flex-col relative pb-28">
        
        {/* Top Header styled with Soft Cream & Sage/Charcoal from Reference */}
        <header className="bg-white border-b border-[#EDEDE5] pt-6 pb-5 px-5 shadow-xs rounded-b-[28px]">
          {/* Top Bar with Logo & Region */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 flex items-center justify-center">
                {/* Clean shield logo - NO white background box */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/mediscan-logo.png"
                  alt="MediScan Shield Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-[#23272A] block leading-none">
                  Medi<span className="text-[#3A752B]">Scan</span>
                </span>
                <span className="text-[10px] text-[#79828B] font-semibold">
                  Prescription Radar
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRegionalOpen(true)}
                className="flex items-center gap-1 rounded-full bg-[#FAF9F5] border border-[#E0E0D8] px-2.5 py-1 text-[11px] font-bold text-[#23272A] hover:bg-[#F0F0EA] transition-colors"
              >
                <Globe className="h-3 w-3 text-[#79828B]" />
                <span>US 🇺🇸</span>
              </button>
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FAF9F5] border border-[#E0E0D8] text-[#79828B] hover:text-[#23272A] transition-colors"
              >
                <Bell className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* User Welcome */}
          <div className="space-y-1">
            <h1 className="text-xl font-black tracking-tight text-[#23272A]">
              Hello, Pragya! 👋
            </h1>
            <p className="text-xs text-[#79828B] font-medium">
              Scan your prescription to check for dangerous drug interactions
            </p>
          </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
          {/* Hidden Native File Input */}
          <input
            ref={fileInputHiddenRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          {/* Scanner Card */}
          <div className="rounded-[28px] border border-[#EDEDE5] bg-white p-4.5 bento-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DFEFB3] text-[#2E4A13]">
                  <ScanLine className="h-4 w-4 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#23272A]">
                    Scan Prescription
                  </h3>
                  <p className="text-[10px] text-[#79828B]">
                    Camera photo, image, or PDF document
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#DFEFB3] px-2 py-0.5 text-[9px] font-bold text-[#2E4A13]">
                AI Vision
              </span>
            </div>

            {!selectedFile ? (
              <UploadDropzone
                onFileSelect={handleFileSelect}
                onSelectPreset={handleSelectPreset}
                disabled={isAnalyzing}
              />
            ) : (
              <div className="space-y-4">
                <FilePreview
                  file={selectedFile}
                  onRemove={handleReset}
                  onReplaceClick={() => fileInputHiddenRef.current?.click()}
                />

                {isAnalyzing ? (
                  <ProcessingStatus
                    currentStep={processingStep}
                    progressPercent={progressPercent}
                    statusMessage={statusMessage}
                  />
                ) : (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => runAnalysis()}
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-[#23272A] py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all hover:bg-black"
                    >
                      <ScanLine className="h-4 w-4" />
                      <span>Analyze with MediScan</span>
                      <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Access Shortcuts (Styled with Pastel Reference Colors) */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/results"
              className="rounded-[24px] border border-[#F99E7F]/40 bg-[#FDCBB8]/50 p-3.5 flex flex-col justify-between bento-shadow hover:bg-[#FDCBB8]/70 transition-all active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#EA580C] mb-2 bento-pill-shadow">
                <ShieldAlert className="h-4 w-4 stroke-[2.4]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#431407]">Safety Radar</h4>
                <p className="text-[10px] text-[#7C2D12]">View drug conflict alert</p>
              </div>
            </Link>

            <Link
              href="/history"
              className="rounded-[24px] border border-[#EDEDE5] bg-white p-3.5 flex flex-col justify-between bento-shadow hover:border-[#BEDB76] transition-all active:scale-95"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D6E8FD] text-[#1E3A8A] mb-2 bento-pill-shadow">
                <History className="h-4 w-4 stroke-[2.4]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#23272A]">Rx History</h4>
                <p className="text-[10px] text-[#79828B]">Past scanned records</p>
              </div>
            </Link>
          </div>

          {/* Clinical Assurance Banner (Pastel Sage) */}
          <div className="rounded-[22px] bg-[#DFEFB3]/70 border border-[#BEDB76]/60 p-3.5 flex items-start gap-2.5 text-xs text-[#2E4A13]">
            <CheckCircle2 className="h-4 w-4 text-[#4D7C0F] flex-shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              MediScan cross-validates active pharmaceutical ingredients against clinical databases and creates an easy-to-follow safety schedule.
            </span>
          </div>
        </main>

        {/* Multi-page Floating Bottom Nav */}
        <AppBottomNav hasAlert={false} />
      </div>

      {/* Regional Config Modal */}
      <RegionalConfigModal
        isOpen={isRegionalOpen}
        onClose={() => setIsRegionalOpen(false)}
      />
    </div>
  );
}
