'use client';

import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, CheckCircle2, Copy, Check } from 'lucide-react';

interface PatientSummaryProps {
  summary: {
    plainLanguage: string;
    keyTakeaways: string[];
  };
  patientName?: string;
  prescriber?: string;
}

export const PatientSummary: React.FC<PatientSummaryProps> = ({
  summary,
  patientName,
  prescriber,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const handleToggleAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(summary.plainLanguage);
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  const handleCopySummary = () => {
    const textToCopy = `${summary.plainLanguage}\n\nKey Takeaways:\n${summary.keyTakeaways.map((t) => `• ${t}`).join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="rounded-[26px] bg-white p-4.5 bento-shadow border border-[#EDEDE5] space-y-3.5">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EDEDE5]">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#DFEFB3] text-[#2E4A13] bento-pill-shadow">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#23272A]">
              Plain-Language Summary
            </h3>
            <p className="text-[10px] text-[#79828B]">
              {patientName ? `For ${patientName}` : 'Patient Guide'} • {prescriber || 'Verified Rx'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio TTS Button */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition-all active:scale-95 ${
              isPlayingAudio
                ? 'bg-[#23272A] text-white'
                : 'bg-[#FAF9F5] text-[#23272A] border border-[#E0E0D8] hover:bg-[#F0F0EA]'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="h-3 w-3" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3" />
                <span>Listen</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF9F5] border border-[#E0E0D8] text-[#79828B] hover:text-[#23272A] transition-colors active:scale-90"
            title="Copy summary"
          >
            {hasCopied ? <Check className="h-3 w-3 text-[#4D7C0F]" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Narrative Summary Body */}
      <div className="rounded-2xl bg-[#FAF9F5] p-3.5 border border-[#EDEDE5]">
        <p className="text-xs text-[#23272A] leading-relaxed">
          {summary.plainLanguage}
        </p>
      </div>

      {/* Key Takeaways */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-bold text-[#23272A] block px-1">
          Key Instructions:
        </span>
        <div className="space-y-1.5">
          {summary.keyTakeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 rounded-xl bg-white p-2 text-xs text-[#23272A] border border-[#EDEDE5]"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-[#4D7C0F] flex-shrink-0 mt-0.5" />
              <span className="text-[11px] leading-snug">{takeaway}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
