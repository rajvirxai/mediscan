'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Globe, User, ArrowRight } from 'lucide-react';
import { RegionalConfigModal } from '../../components/RegionalConfigModal';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('pragya.verma@mediscan.ai');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegionalOpen, setIsRegionalOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F2] flex flex-col items-center justify-start p-0 sm:py-6 text-[#23272A] selection:bg-[#D6E8FD]">
      {/* Mobile Screen Shell */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-[#F8F8F2] sm:rounded-[32px] shadow-xl border border-[#EDEDE5] flex flex-col justify-between overflow-hidden relative">
        
        {/* Top Cream & Sage Banner with Logo */}
        <div className="bg-white pt-10 pb-8 px-6 text-center border-b border-[#EDEDE5] rounded-b-[32px] bento-shadow space-y-3">
          <div className="flex justify-center">
            {/* Transparent shield logo - NO white background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mediscan-logo.png"
              alt="MediScan Shield Logo"
              className="h-20 w-auto object-contain"
            />
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#23272A]">
              Medi<span className="text-[#3A752B]">Scan</span>
            </h1>
            <p className="text-xs text-[#79828B] font-medium mt-0.5">
              Prescription Radar & Drug Interaction Shield
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="px-6 py-6 space-y-5 bg-[#F8F8F2] flex-1 flex flex-col justify-between">
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="text-center mb-4">
              <span className="text-xs font-bold text-[#3A752B] uppercase tracking-wider">
                Welcome Back
              </span>
              <h2 className="text-xl font-black text-[#23272A]">
                Sign In to Your Account
              </h2>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#79828B]">
                Username / Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl bg-white border border-[#EDEDE5] px-4 py-3 text-sm text-[#23272A] font-medium placeholder-[#79828B] focus:border-[#BEDB76] focus:outline-hidden bento-shadow"
                  required
                />
                <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#79828B]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#79828B]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-white border border-[#EDEDE5] px-4 py-3 text-sm text-[#23272A] font-medium placeholder-[#79828B] focus:border-[#BEDB76] focus:outline-hidden bento-shadow"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#79828B] hover:text-[#23272A]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#23272A] py-3.5 px-4 text-sm font-bold text-white shadow-md active:scale-[0.98] transition-all hover:bg-black"
              >
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

          {/* Bottom Settings Link */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EDEDE5] text-xs text-[#79828B]">
            <button
              type="button"
              onClick={() => setIsRegionalOpen(true)}
              className="flex items-center gap-1 hover:text-[#23272A] transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              <span>US Pharmacopeia (FDA)</span>
            </button>

            <span className="text-[10px] text-[#79828B]">
              v2.0 • HIPAA Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Regional Dialog */}
      <RegionalConfigModal
        isOpen={isRegionalOpen}
        onClose={() => setIsRegionalOpen(false)}
      />
    </div>
  );
}
