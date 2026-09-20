'use client';

import React, { useState, useRef } from 'react';
import { Camera, UploadCloud, ShieldAlert, CheckCircle, Sparkles, FolderOpen } from 'lucide-react';
import { SamplePicker } from './SamplePicker';

interface UploadDropzoneProps {
  onFileSelect: (file: File | { name: string; type: string; size: number }) => void;
  onSelectPreset: (preset: 'flagged' | 'clean') => void;
  onSampleFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onFileSelect,
  onSelectPreset,
  onSampleFileSelect,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Hidden Native File & Camera Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInputChange}
        disabled={disabled}
      />

      {/* Main Touch Upload Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed p-6 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-[#93C5FD] bg-[#D6E8FD]/30 scale-[1.01]'
            : 'border-[#E0E0D8] bg-[#FAF9F5] hover:border-[#93C5FD] hover:bg-white active:scale-[0.99]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="relative mb-2.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D6E8FD] text-[#1E3A8A] bento-pill-shadow">
          <UploadCloud className="h-7 w-7 stroke-[2]" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#93C5FD] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#60A5FA] border-2 border-white"></span>
          </span>
        </div>

        <h3 className="text-base font-bold text-[#23272A]">
          Scan Prescription
        </h3>
        <p className="mt-0.5 text-xs text-[#79828B] max-w-xs">
          Take a photo or upload doctor notes & slips
        </p>

        {/* Mobile Quick Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5 w-full max-w-xs">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#23272A] py-2.5 px-3 text-xs font-bold text-white hover:bg-black active:scale-95 transition-all bento-btn-shadow"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Camera Snap</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex items-center justify-center gap-1.5 rounded-full border border-[#E0E0D8] bg-white py-2.5 px-3 text-xs font-bold text-[#23272A] hover:bg-[#F8F8F2] active:scale-95 transition-all"
          >
            <FolderOpen className="h-3.5 w-3.5 text-[#79828B]" />
            <span>Select File</span>
          </button>
        </div>
      </div>

      {/* Real Sample Document Picker (4 documents from data/sample_documents) */}
      <SamplePicker
        onSampleSelect={(file) => {
          if (onSampleFileSelect) {
            onSampleFileSelect(file);
          } else {
            onFileSelect(file);
          }
        }}
        disabled={disabled}
      />

      {/* Quick Mock Presets (offline fallback) */}
      <div className="rounded-[24px] bg-white p-3 border border-[#EDEDE5] bento-shadow">
        <div className="flex items-center gap-1.5 text-xs text-[#79828B] mb-2 px-1">
          <Sparkles className="h-3.5 w-3.5 text-[#F5CA68]" />
          <span className="font-semibold text-[#23272A]">Offline Presets:</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSelectPreset('flagged')}
            className="flex items-center gap-2 rounded-2xl bg-[#FDCBB8]/40 border border-[#F99E7F]/30 p-2 text-left text-[10px] font-medium text-[#7C2D12] hover:bg-[#FDCBB8] active:scale-95 transition-all"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-[#EA580C] flex-shrink-0" />
            <div>
              <div className="font-bold text-[#431407]">⚠️ Flagged</div>
              <div className="text-[9px] text-[#9A3412]">Mock Warfarin</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectPreset('clean')}
            className="flex items-center gap-2 rounded-2xl bg-[#DFEFB3]/50 border border-[#BEDB76]/40 p-2 text-left text-[10px] font-medium text-[#2E4A13] hover:bg-[#DFEFB3] active:scale-95 transition-all"
          >
            <CheckCircle className="h-3.5 w-3.5 text-[#4D7C0F] flex-shrink-0" />
            <div>
              <div className="font-bold text-[#1A2E05]">✓ Safe</div>
              <div className="text-[9px] text-[#3F6212]">Mock Clean Rx</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
