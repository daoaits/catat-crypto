import React from 'react';
import { Lock, Clock, BarChart } from 'lucide-react';

const HeroSection = () => (
  <div className="hidden lg:flex flex-col justify-center p-12 bg-neutral-950 relative overflow-hidden border-r border-neutral-800 lg:w-[55%] xl:w-[58%]">
    {/* Abstract Background Accents */}
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-red-900 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-blue-900 rounded-full blur-[100px] opacity-30" />
    </div>

    <div className="relative z-10">
      <h1 className="text-6xl font-black text-white/10 mb-2 leading-none uppercase select-none">Catat Crypto</h1>
      <h2 className="text-4xl font-medium text-white mb-6 tracking-tight">The Opportunity is You</h2>
      
      {/* Visual Accent - Mocking the screenshots */}
      <div className="flex gap-4 mt-12 relative">
        {/* Glow shapes behind cards */}
        <div className="absolute -top-12 left-8 w-32 h-32 bg-red-500 rounded-full blur-[80px] opacity-40 pointer-events-none" />
        <div className="absolute -top-8 right-16 w-24 h-24 bg-pink-500 rounded-full blur-[60px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-16 left-16 w-40 h-40 bg-pink-600 rounded-full blur-[100px] opacity-35 pointer-events-none" />
        <div className="absolute -bottom-12 right-8 w-32 h-32 bg-red-600 rounded-full blur-[80px] opacity-40 pointer-events-none" />
        
        <div className="w-48 h-64 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-end relative overflow-visible shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5),0_10px_30px_-10px_rgba(236,72,153,0.3)]">
          <div className="absolute top-6 left-6 w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <div className="w-6 h-6 bg-blue-500 rounded-full" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold opacity-80 uppercase text-xs tracking-widest">Ethereum</p>
            <p className="text-white text-xl font-black">ETH <span className="text-xs opacity-40">USD</span></p>
            <div className="h-[1px] w-full bg-white/10 my-2" />
            <p className="text-white font-mono text-lg">******</p>
            <p className="text-green-400 text-xs font-bold">5.23% (***)</p>
          </div>
        </div>
        
        <div className="w-48 h-64 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-end translate-y-8 relative overflow-visible shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5),0_10px_30px_-10px_rgba(236,72,153,0.3)]">
           <div className="absolute top-6 left-6 w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30">
            <div className="w-8 h-8 flex items-center justify-center text-amber-500 font-bold">₿</div>
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold opacity-80 uppercase text-xs tracking-widest">Bitcoin</p>
            <p className="text-white text-xl font-black">BTC <span className="text-xs opacity-40">USD</span></p>
            <div className="h-[1px] w-full bg-white/10 my-2" />
            <p className="text-white font-mono text-lg">******</p>
            <p className="text-green-400 text-xs font-bold">7.68% (***)</p>
          </div>
        </div>

        <div className="w-48 h-64 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-end translate-y-4 relative overflow-visible shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5),0_10px_30px_-10px_rgba(236,72,153,0.3)]">
           <div className="absolute top-6 left-6 w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
            <div className="w-6 h-6 bg-purple-500 rounded-full" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold opacity-80 uppercase text-xs tracking-widest">Solana</p>
            <p className="text-white text-xl font-black">SOL <span className="text-xs opacity-40">USD</span></p>
            <div className="h-[1px] w-full bg-white/10 my-2" />
            <p className="text-white font-mono text-lg">******</p>
            <p className="text-green-400 text-xs font-bold">12.45% (***)</p>
          </div>
        </div>

        <div className="w-48 h-64 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-end translate-y-12 relative overflow-visible shadow-[0_20px_60px_-15px_rgba(239,68,68,0.5),0_10px_30px_-10px_rgba(236,72,153,0.3)]">
           <div className="absolute top-6 left-6 w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30">
            <div className="w-6 h-6 bg-cyan-500 rounded-full" />
          </div>
          <div className="space-y-1">
            <p className="text-white font-bold opacity-80 uppercase text-xs tracking-widest">Cardano</p>
            <p className="text-white text-xl font-black">ADA <span className="text-xs opacity-40">USD</span></p>
            <div className="h-[1px] w-full bg-white/10 my-2" />
            <p className="text-white font-mono text-lg">******</p>
            <p className="text-red-400 text-xs font-bold">-2.15% (***)</p>
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-12 left-12 flex gap-8">
       <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
         <Lock size={12} className="text-red-600" /> Secure
       </div>
       <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
         <Clock size={12} className="text-red-600" /> Fast
       </div>
       <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest font-bold">
         <BarChart size={12} className="text-red-600" /> Analysis
       </div>
    </div>
  </div>
);

export default HeroSection;
