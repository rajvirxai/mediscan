import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MediScan AI — Prescription & Safety Radar",
  description: "AI-powered prescription scanner, plain-language patient summary, and drug-to-drug interaction detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#E5FEEB]/40 text-[#3B3B3B]">
        {children}
      </body>
    </html>
  );
}
