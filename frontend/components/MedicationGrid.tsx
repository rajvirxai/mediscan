'use client';

import React from 'react';
import { Pill, Sun, Sunrise, Sunset, Moon, Utensils, Clock } from 'lucide-react';
import { MedicationItem } from '../types/analysis';

interface MedicationGridProps {
  medications: MedicationItem[];
}

export const MedicationGrid: React.FC<MedicationGridProps> = ({ medications }) => {
  const getTimingBadge = (time: 'morning' | 'noon' | 'evening' | 'bedtime') => {
    switch (time) {
      case 'morning':
        return (
          <span
            key="morning"
            className="inline-flex items-center gap-1 rounded-full bg-[#FDE6AA] border border-[#F5CA68]/60 px-2 py-0.5 text-[10px] font-bold text-[#78350F]"
          >
            <Sunrise className="h-3 w-3" /> Morning
          </span>
        );
      case 'noon':
        return (
          <span
            key="noon"
            className="inline-flex items-center gap-1 rounded-full bg-[#DFEFB3] border border-[#BEDB76]/60 px-2 py-0.5 text-[10px] font-bold text-[#2E4A13]"
          >
            <Sun className="h-3 w-3" /> Afternoon
          </span>
        );
      case 'evening':
        return (
          <span
            key="evening"
            className="inline-flex items-center gap-1 rounded-full bg-[#D6E8FD] border border-[#93C5FD]/60 px-2 py-0.5 text-[10px] font-bold text-[#1E3A8A]"
          >
            <Sunset className="h-3 w-3" /> Evening
          </span>
        );
      case 'bedtime':
        return (
          <span
            key="bedtime"
            className="inline-flex items-center gap-1 rounded-full bg-[#DED5FF] border border-[#BAA8F8]/60 px-2 py-0.5 text-[10px] font-bold text-[#4C1D95]"
          >
            <Moon className="h-3 w-3" /> Bedtime
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-xs font-bold text-[#23272A] flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-[#2E4A13]" />
            Prescribed Medications
          </h3>
          <p className="text-[10px] text-[#79828B]">
            {medications.length} active pharmaceutical items detected
          </p>
        </div>
        <span className="text-[10px] font-bold bg-[#FAF9F5] border border-[#EDEDE5] px-2 py-0.5 rounded-full text-[#79828B]">
          Daily Regimen
        </span>
      </div>

      <div className="space-y-3">
        {medications.map((med, index) => (
          <div
            key={index}
            className="rounded-[24px] border border-[#EDEDE5] bg-white p-4 bento-shadow space-y-2.5 transition-all hover:border-[#BEDB76]"
          >
            {/* Medication Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-[#23272A] flex items-center gap-1.5">
                  <span>{med.name}</span>
                  <span className="rounded-full bg-[#FAF9F5] border border-[#EDEDE5] px-2 py-0.5 text-[10px] font-mono font-bold text-[#23272A]">
                    {med.dosage}
                  </span>
                </h4>
                <p className="text-[11px] text-[#79828B] mt-0.5">
                  Purpose: <span className="font-medium text-[#23272A]">{med.purpose}</span>
                </p>
              </div>

              <span className="rounded-full bg-[#FAF9F5] border border-[#EDEDE5] px-2.5 py-1 text-[10px] font-bold text-[#23272A]">
                {med.frequency}
              </span>
            </div>

            {/* Timing Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {med.timing.map((t) => getTimingBadge(t))}
            </div>

            {/* Food Instruction & Duration */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#EDEDE5] text-[11px] text-[#79828B]">
              <div className="flex items-center gap-1">
                <Utensils className="h-3.5 w-3.5 text-[#79828B]" />
                <span>{med.instructionsWithFood}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#79828B]" />
                <span>Duration: {med.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
