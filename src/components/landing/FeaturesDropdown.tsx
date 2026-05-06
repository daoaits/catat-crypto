import React from "react";
import { Activity, BookOpen, Calendar, Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FeaturesDropdownProps {
  handleNavigate: (page: string) => void;
}

export default function FeaturesDropdown({ handleNavigate }: FeaturesDropdownProps) {
  const { t } = useTranslation();

  return (
    <div className="relative group/nav h-full flex items-center">
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
        className="text-[13px] font-semibold text-neutral-400 group-hover/nav:text-white transition-colors flex items-center gap-1 cursor-pointer h-full"
      >
        {t('nav.features')}
      </a>

      {/* Mega Menu Modal */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[680px] bg-[#111111] border border-white/5 rounded-2xl opacity-0 translate-y-4 invisible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:visible transition-all duration-300 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] flex overflow-hidden">
        {/* Left Column */}
        <div className="w-[55%] p-6 bg-[#080808]">
          <div className="text-[10px] font-bold text-neutral-500 tracking-[0.1em] mb-4 uppercase">
            Core Ecosystem
          </div>

          <div className="space-y-3">
            {/* Dashboard */}
            <div 
              onClick={() => handleNavigate('home')}
              className="bg-[#1A1111]/80 hover:bg-[#2A1715] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group/item"
            >
              <div className="pr-4">
                <div className="text-white font-bold text-[14px] mb-1 leading-tight">
                  Dashboard
                </div>
                <div className="text-[#A37B75] text-[12px] leading-relaxed max-w-[180px]">
                  Track PnL, win rate, and performance at a glance
                </div>
              </div>
              <div className="w-[60px] h-[60px] relative transition-transform group-hover/item:scale-105 flex-shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full drop-shadow-md"
                >
                  <path
                    d="M 50 15 A 35 35 0 1 1 15 50 L 50 50 Z"
                    fill="#4B1B18"
                  />
                  <path
                    d="M 50 15 A 35 35 0 0 0 15 50 L 50 50 Z"
                    fill="#2E110F"
                  />
                  <path
                    d="M 90 50 A 40 40 0 0 1 65 87 L 57 70 A 20 20 0 0 0 75 50 Z"
                    fill="#FFB3A6"
                  />
                  <path
                    d="M 50 50 L 50 10 A 40 40 0 0 1 90 50 Z"
                    fill="#FFB3A6"
                  />
                </svg>
              </div>
            </div>

            {/* Reports */}
            <div 
              onClick={() => handleNavigate('home')}
              className="bg-[#1A1111]/80 hover:bg-[#2A1715] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group/item"
            >
              <div className="pr-4">
                <div className="text-white font-bold text-[14px] mb-1 leading-tight">
                  Reports
                </div>
                <div className="text-[#A37B75] text-[12px] leading-relaxed max-w-[180px]">
                  Deep dive into your trading stats and
                  <br />
                  patterns
                </div>
              </div>
              <div className="w-[60px] h-[60px] relative transition-transform group-hover/item:scale-105 flex-shrink-0 flex items-center justify-center">
                <div className="w-10 h-[50px] bg-[#4B1B18] rounded-md transform rotate-[15deg] relative border border-[#2E1D1B] shadow-md flex justify-center pt-2">
                  <div className="w-8 h-10 bg-[#FFB3A6] rounded-sm relative z-10" />
                  {/* Clip */}
                  <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 w-4 h-[6px] bg-[#FFB3A6] rounded-full z-20 border border-[#2E1D1B]" />
                  <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 w-5 h-2 bg-[#2E110F] rounded-t-sm z-10" />
                </div>
              </div>
            </div>

            {/* Trades */}
            <div 
              onClick={() => handleNavigate('home')}
              className="bg-[#1A1111]/80 hover:bg-[#2A1715] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group/item"
            >
              <div className="pr-4">
                <div className="text-white font-bold text-[14px] mb-1 leading-tight">
                  Trades
                </div>
                <div className="text-[#A37B75] text-[12px] leading-relaxed max-w-[200px]">
                  Full history of every trade you've ever made
                </div>
              </div>
              <div className="w-[60px] h-[60px] relative transition-transform group-hover/item:scale-105 flex-shrink-0 bg-[#4B1B18] rounded-xl border border-[#3A1412] flex items-center justify-center shadow-md transform rotate-[-5deg]">
                <div className="flex gap-1.5 items-center justify-center">
                  <div
                    className="w-4 h-8 bg-[#FFB3A6] rounded-sm transform translate-y-1 relative"
                    style={{
                      clipPath:
                        "polygon(50% 100%, 0 70%, 25% 70%, 25% 0, 75% 0, 75% 70%, 100% 70%)",
                    }}
                  ></div>
                  <div
                    className="w-4 h-8 bg-[#FFB3A6] rounded-sm transform -translate-y-1 relative"
                    style={{
                      clipPath:
                        "polygon(50% 0, 100% 30%, 75% 30%, 75% 100%, 25% 100%, 25% 30%, 0 30%)",
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Notebook */}
            <div 
              onClick={() => handleNavigate('home')}
              className="bg-[#1A1111]/80 hover:bg-[#2A1715] border border-white/5 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all group/item"
            >
              <div className="pr-4">
                <div className="text-white font-bold text-[14px] mb-1 leading-tight">
                  Notebook
                </div>
                <div className="text-[#A37B75] text-[12px] leading-relaxed max-w-[180px]">
                  Journal your thoughts, setups, and trade recaps
                </div>
              </div>
              <div className="w-[60px] h-[60px] relative transition-transform group-hover/item:scale-105 flex-shrink-0 flex items-center justify-center">
                <div className="relative transform rotate-[-10deg]">
                  <div className="w-12 h-9 bg-[#2E110F] rounded-md relative shadow-lg">
                    <div className="absolute top-0 right-[-3px] w-12 h-9 bg-[#4B1B18] rounded-md" />
                    <div className="absolute top-1 right-[-1px] w-10 h-7 bg-white/90 rounded-sm" />
                    {/* Glasses */}
                    <div className="absolute flex gap-0.5 top-2 right-1 z-10 w-9 items-center transform rotate-12">
                      <div className="w-4 h-4 rounded-full border-2 border-[#FFB3A6] rounded-bl-xl bg-white/20" />
                      <div className="w-1 h-0.5 bg-[#FFB3A6]" />
                      <div className="w-4 h-4 rounded-full border-2 border-[#FFB3A6] rounded-br-xl bg-white/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[45%] p-6 bg-[#121212] flex flex-col">
          <div className="text-[10px] font-bold text-neutral-500 tracking-[0.1em] mb-4 uppercase">
            Tools & Analysis
          </div>

          <div className="space-y-6 mb-auto pt-2">
            {/* Calendar */}
            <div 
              onClick={() => handleNavigate('home')}
              className="flex gap-4 cursor-pointer group/item items-start"
            >
              <div className="mt-0.5">
                <Calendar
                  className="w-5 h-5 text-[#E26A59]"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <div className="text-white font-bold text-[13px] mb-1">
                  Calendar
                </div>
                <div className="text-neutral-400 text-[11px] leading-relaxed">
                  Monthly view of your daily PnL and trade activity
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div 
              onClick={() => handleNavigate('home')}
              className="flex gap-4 cursor-pointer group/item items-start"
            >
              <div className="mt-0.5">
                <Bot className="w-5 h-5 text-[#E26A59]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-white font-bold text-[13px]">
                    A.I. Assistant
                  </div>
                  <span className="px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold bg-[#0A1A12] text-[#34D399] border border-[#163322]">
                    COMING SOON
                  </span>
                </div>
                <div className="text-neutral-400 text-[11px] leading-relaxed">
                  Get insights and pattern analysis powered by AI
                </div>
              </div>
            </div>
          </div>

          {/* Promo Box */}
          <div className="bg-gradient-to-br from-[#380E0B] to-[#1A0504] border border-[#4A1410] rounded-2xl p-6 mt-8">
            <h4 className="text-white font-bold text-[16px] mb-2">
              Trade Like a Pro
            </h4>
            <p className="text-[#E58C80] text-[12px] mb-5 leading-relaxed pr-4">
              Unlock advanced analytics and institutional-grade journaling tools
              today.
            </p>
            <button className="w-full py-3 bg-white hover:bg-neutral-200 text-[#050505] font-bold text-[13px] rounded-[10px] transition-colors">
              Compare Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
