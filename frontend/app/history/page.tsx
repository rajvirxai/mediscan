'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBottomNav } from '../../components/AppBottomNav';
import { 
  History, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  FileText
} from 'lucide-react';

export default function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'safe'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const historyItems = [
    {
      id: 'rx-9482',
      date: '18 Sep 2026, 10:45 AM',
      doctor: 'Dr. R. K. Sharma (Cardiology)',
      patient: 'Jack Miller',
      medications: ['Warfarin 5mg', 'Ibuprofen 400mg', 'Aspirin 75mg'],
      hasConflict: true,
      severity: 'High Risk Conflict',
      summary: 'Dangerous interaction: Warfarin + Ibuprofen severely increases the risk of upper gastrointestinal bleeding.',
    },
    {
      id: 'rx-8319',
      date: '12 Sep 2026, 04:15 PM',
      doctor: 'Dr. Ananya Patel (ENT)',
      patient: 'Jack Miller',
      medications: ['Amoxicillin 625mg', 'Levocetirizine 5mg', 'Probiotics'],
      hasConflict: false,
      severity: 'Safe Regimen',
      summary: '7-day antibacterial and allergy course. Zero adverse drug-to-drug interactions detected.',
    },
    {
      id: 'rx-7721',
      date: '28 Aug 2026, 09:30 AM',
      doctor: 'Dr. Carlos Mendoza (Endocrinology)',
      patient: 'Jack Miller',
      medications: ['Metformin 500mg', 'Glimepiride 1mg'],
      hasConflict: false,
      severity: 'Safe Regimen',
      summary: 'Glycemic management regimen with meal timing instructions and hydration reminders.',
    },
  ];

  const filteredItems = historyItems.filter((item) => {
    if (filter === 'flagged' && !item.hasConflict) return false;
    if (filter === 'safe' && item.hasConflict) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.doctor.toLowerCase().includes(q) ||
        item.patient.toLowerCase().includes(q) ||
        item.medications.some((m) => m.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F8F2] flex flex-col items-center justify-start text-[#23272A] selection:bg-[#D6E8FD]">
      <div className="w-full max-w-md min-h-screen bg-[#F8F8F2] flex flex-col relative pb-28 px-5 pt-6">
        
        {/* Top Header */}
        <header className="flex items-center justify-between pb-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#79828B] hover:text-[#23272A] transition-colors p-1 -ml-1 rounded-full active:scale-95"
          >
            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            <span>Dashboard</span>
          </Link>

          <h1 className="text-xl font-black text-[#23272A] tracking-tight">
            Prescription Records
          </h1>

          <div className="h-7 w-7 rounded-full bg-white border border-[#EBEBE3] flex items-center justify-center text-[10px] font-bold text-[#79828B]">
            {filteredItems.length}
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#79828B]" />
          <input
            type="text"
            placeholder="Search by doctor or medicine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-white border border-[#EDEDE5] py-2.5 pl-10 pr-4 text-xs text-[#23272A] placeholder-[#9AA2A9] focus:outline-hidden focus:border-[#BEDB76] bento-pill-shadow"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
              filter === 'all'
                ? 'bg-[#23272A] text-white shadow-xs'
                : 'bg-white text-[#79828B] border border-[#EDEDE5]'
            }`}
          >
            All Records
          </button>
          <button
            type="button"
            onClick={() => setFilter('flagged')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
              filter === 'flagged'
                ? 'bg-[#FDCBB8] text-[#7C2D12] border border-[#F99E7F]'
                : 'bg-white text-[#79828B] border border-[#EDEDE5]'
            }`}
          >
            ⚠️ Warnings Only
          </button>
          <button
            type="button"
            onClick={() => setFilter('safe')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
              filter === 'safe'
                ? 'bg-[#DFEFB3] text-[#2E4A13] border border-[#BEDB76]'
                : 'bg-white text-[#79828B] border border-[#EDEDE5]'
            }`}
          >
            ✓ Safe Regimens
          </button>
        </div>

        {/* Records List */}
        <div className="space-y-3 flex-1">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              href="/results"
              className={`block rounded-[24px] p-4 bento-shadow border transition-all active:scale-[0.99] ${
                item.hasConflict
                  ? 'bg-[#FDCBB8]/40 border-[#F99E7F]/60 hover:bg-[#FDCBB8]/60'
                  : 'bg-white border-[#EDEDE5] hover:border-[#BEDB76]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center ${
                      item.hasConflict
                        ? 'bg-[#FDCBB8] text-[#7C2D12]'
                        : 'bg-[#DFEFB3] text-[#2E4A13]'
                    }`}
                  >
                    {item.hasConflict ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : (
                      <ShieldCheck className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#23272A]">
                      {item.doctor}
                    </h4>
                    <p className="text-[10px] text-[#79828B]">{item.date}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    item.hasConflict
                      ? 'bg-[#EA580C] text-white'
                      : 'bg-[#DFEFB3] text-[#2E4A13]'
                  }`}
                >
                  {item.severity}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 my-2">
                {item.medications.map((m, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-[#FAF9F5] border border-[#EDEDE5] px-2 py-0.5 text-[10px] font-medium text-[#23272A]"
                  >
                    {m}
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-[#79828B] line-clamp-2">
                {item.summary}
              </p>
            </Link>
          ))}
        </div>

        {/* Floating Pill Bottom Navigation */}
        <AppBottomNav hasAlert={false} />
      </div>
    </div>
  );
}
