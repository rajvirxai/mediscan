'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppBottomNav } from '../../components/AppBottomNav';
import { RegionalConfigModal } from '../../components/RegionalConfigModal';
import { 
  User, 
  Globe, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Heart
} from 'lucide-react';

export default function ProfilePage() {
  const [isRegionalOpen, setIsRegionalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
            Profile
          </h1>

          <div className="h-7 w-7 rounded-full bg-white border border-[#EBEBE3] flex items-center justify-center text-[10px] font-bold text-[#79828B]">
            ✓
          </div>
        </header>

        {/* User Card (Pastel Sage) */}
        <div className="bg-[#DFEFB3] rounded-[28px] p-4.5 bento-shadow border border-[#BEDB76]/70 mb-4 flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-white text-[#2E4A13] flex items-center justify-center text-lg font-black bento-pill-shadow">
            JM
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1A2E05]">
              Jack Miller
            </h2>
            <p className="text-xs text-[#2E4A13]/80">
              jack.miller@mediscan.health
            </p>
            <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold text-[#2E4A13] bento-pill-shadow">
              <ShieldCheck className="h-2.5 w-2.5" /> Verified Profile
            </span>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-3 flex-1">
          
          {/* Section 1: Regional & Safety Database */}
          <div className="bg-white rounded-[26px] p-3.5 bento-shadow border border-[#EDEDE5] space-y-1">
            <span className="text-[10px] font-bold text-[#79828B] uppercase tracking-wider px-2 block mb-1">
              Regional Standards
            </span>

            <button
              type="button"
              onClick={() => setIsRegionalOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF9F5] transition-colors active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#D6E8FD] text-[#1E3A8A] flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#23272A]">Country & Pharmacopeia</div>
                  <div className="text-[10px] text-[#79828B]">United States (FDA / NLM) 🇺🇸</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#9AA2A9]" />
            </button>

            <div className="flex items-center justify-between p-2.5 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#FDE6AA] text-[#78350F] flex items-center justify-center">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#23272A]">Intake Push Reminders</div>
                  <div className="text-[10px] text-[#79828B]">Notify on scheduled dosage times</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="h-4 w-4 accent-[#23272A] rounded-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Privacy & Encryption */}
          <div className="bg-white rounded-[26px] p-3.5 bento-shadow border border-[#EDEDE5] space-y-1">
            <span className="text-[10px] font-bold text-[#79828B] uppercase tracking-wider px-2 block mb-1">
              Data & Privacy
            </span>

            <div className="flex items-center justify-between p-2.5 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-[#DED5FF] text-[#4C1D95] flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#23272A]">HIPAA Local Encryption</div>
                  <div className="text-[10px] text-[#79828B]">Prescription images processed in-memory</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#4D7C0F] bg-[#DFEFB3] px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          {/* Section 3: Logout Action */}
          <Link
            href="/login"
            className="w-full bg-white rounded-[24px] p-3.5 bento-shadow border border-[#EDEDE5] flex items-center justify-center gap-2 text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Link>

        </div>

        {/* Floating Pill Bottom Navigation */}
        <AppBottomNav hasAlert={false} />

      </div>

      {/* Regional Config Dialog */}
      <RegionalConfigModal
        isOpen={isRegionalOpen}
        onClose={() => setIsRegionalOpen(false)}
      />
    </div>
  );
}
