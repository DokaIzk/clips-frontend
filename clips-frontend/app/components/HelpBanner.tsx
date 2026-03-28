"use client";

import React from "react";
import { ArrowUpRight, HelpCircle } from "lucide-react";
import Link from "next/link";

export const HelpBanner: React.FC = () => {
  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00FF9D] to-[#050505] p-6 sm:p-8 md:p-10 border border-white/5 shadow-2xl group transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,157,0.1)]">
      {/* Decorative background pattern - creates a visual bridge between green and black */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_top_right,rgba(0,255,157,0.15),transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 py-2">
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/10 border border-black/5 w-fit">
            <HelpCircle size={14} className="text-black/60" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">
              Support Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight leading-[1.1]">
            Need help connecting?
          </h2>
          <p className="text-black/70 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
            Our support team is available{" "}
            <span className="text-black font-bold">24/7</span> to assist you
            with any wallet connection or account sync issues.
          </p>
        </div>

        <Link
          href="/support"
          className="group/link inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-black text-[#00FF9D] rounded-xl font-bold transition-all duration-300 hover:bg-[#00FF9D] hover:text-black hover:scale-[1.02] shadow-[0_10px_30px_rgba(0,0,0,0.3)] w-full md:w-auto"
        >
          Contact Support
          <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
        </Link>
      </div>

      {/* Subtle border accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-black/5 via-black/20 to-transparent opacity-30"></div>
    </div>
  );
};
