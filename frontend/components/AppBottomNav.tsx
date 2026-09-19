'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ScanLine, FileText, History, User } from 'lucide-react';

interface AppBottomNavProps {
  hasAlert?: boolean;
}

export const AppBottomNav: React.FC<AppBottomNavProps> = ({ hasAlert = false }) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Scan Rx', icon: ScanLine },
    { href: '/results', label: 'Results', icon: FileText, badge: hasAlert },
    { href: '/history', label: 'History', icon: History },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex flex-col items-center pointer-events-none">
      {/* Floating Pill Dock in Reference Pastel/Cream Style */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-xl px-5 py-2 rounded-full shadow-[0_12px_32px_rgba(35,39,42,0.08)] border border-[#EDEDE5] flex items-center justify-between gap-4 sm:gap-7">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center px-2.5 py-1 transition-all active:scale-90 ${
                isActive ? 'text-[#23272A] font-bold' : 'text-[#79828B] hover:text-[#23272A]'
              }`}
            >
              <div className="relative flex flex-col items-center">
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F99E7F] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EA580C]"></span>
                  </span>
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute -bottom-1 h-[2.5px] w-3.5 rounded-full bg-[#23272A]" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* iOS Home Indicator Bar */}
      <div className="mt-2 h-1 w-28 rounded-full bg-[#23272A]/20" />
    </div>
  );
};
