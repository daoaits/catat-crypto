import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, TrendingUp, Infinity, Search, Music2, Instagram, Twitter, Youtube, Users, MoreHorizontal, 
  CheckCircle2, ArrowLeft, RefreshCcw, PenLine, ChevronRight, Settings 
} from 'lucide-react';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';
import { TRADER_TYPES, SOURCES, PLANS, EXCHANGES } from '../constants';

interface OnboardingPageProps {
  step: number;
  subStep: number;
  formData: any;
  updateFormData: (data: any) => void;
  updateTradeData: (data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleConnect: () => void;
  isConnecting: boolean;
  connectionError: string;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({
  step, subStep, formData, updateFormData, updateTradeData, nextStep, prevStep, handleConnect, isConnecting, connectionError
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 15 - i);

  return (
    <div className="min-h-screen bg-black text-white flex select-none">
      <HeroSection />
      <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-md mx-auto w-full relative">
        <Logo size="lg" centered />
        <AnimatePresence mode="wait">
          {(step === 2 || step === 3 || step === 4) && (
            <motion.div 
               key="onboarding-steps"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-5"
            >
              {step === 2 && (
                <>
                  <header>
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome!</h1>
                    <p className="text-neutral-400 text-sm">Help us personalize your experience</p>
                  </header>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-red-600">What type of trader are you?</label>
                      <div className="grid gap-2">
                        {TRADER_TYPES.map(type => (
                          <button
                            key={type.id}
                            onClick={() => updateFormData({ traderType: type.id })}
                            className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${formData.traderType === type.id ? 'bg-red-700/10 border-red-600' : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'}`}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`p-2 rounded-lg ${formData.traderType === type.id ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                                {type.id === 'day' && <Clock size={18} />}
                                {type.id === 'swing' && <TrendingUp size={18} />}
                                {type.id === 'long' && <Infinity size={18} />}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{type.label}</p>
                                <p className="text-xs text-neutral-500">{type.description}</p>
                              </div>
                            </div>
                            {formData.traderType === type.id && <CheckCircle2 size={14} className="text-red-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-red-600">What is your gender?</label>
                      <div className="flex gap-3">
                        {['Male', 'Female'].map(g => (
                          <button
                            key={g}
                            onClick={() => updateFormData({ gender: g })}
                            className={`px-6 py-2.5 rounded-full border transition-all flex items-center gap-2 text-sm ${formData.gender === g ? 'bg-white text-black border-white' : 'bg-transparent border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}
                          >
                            {g === 'Male' ? '♂️' : '♀️'} {g}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-black text-red-600">What year did you born?</label>
                      <select 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-red-600 appearance-none"
                        value={formData.birthYear}
                        onChange={(e) => updateFormData({ birthYear: e.target.value })}
                      >
                        <option value="">DD / MM / YY</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <header>
                    <h1 className="text-[10px] uppercase tracking-[0.2em] font-black text-red-600 mb-2">Where did you hear about us?</h1>
                  </header>
                  <div className="grid gap-2">
                    {SOURCES.map(source => (
                      <button
                        key={source.id}
                        onClick={() => {
                          const current = formData.sources;
                          const next = current.includes(source.id) 
                            ? current.filter((s: string) => s !== source.id) 
                            : [...current, source.id];
                          updateFormData({ sources: next });
                        }}
                        className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${formData.sources.includes(source.id) ? 'bg-red-700/10 border-red-600' : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'}`}
                      >
                        <div className="flex gap-3 items-center">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${formData.sources.includes(source.id) ? 'bg-red-600 text-white' : 'bg-neutral-800 text-neutral-500'}`}>
                            {source.id === 'google' && <Search size={18} />}
                            {source.id === 'tiktok' && <Music2 size={18} />}
                            {source.id === 'instagram' && <Instagram size={18} />}
                            {source.id === 'twitter' && <Twitter size={18} />}
                            {source.id === 'youtube' && <Youtube size={18} />}
                            {source.id === 'community' && <Users size={18} />}
                            {source.id === 'other' && <MoreHorizontal size={18} />}
                          </div>
                          <p className="font-bold text-neutral-300 text-sm">{source.label}</p>
                        </div>
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.sources.includes(source.id) ? 'bg-red-600 border-red-600' : 'bg-transparent border-neutral-700'}`}>
                          {formData.sources.includes(source.id) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <header className="text-center max-w-md mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-1 leading-tight">Elevate Your Strategy</h1>
                    <p className="text-neutral-400 text-xs">Choose the plan that fits your trading style.</p>
                  </header>
                  <div className="grid gap-3">
                    {PLANS.map(plan => (
                      <div 
                        key={plan.id}
                        className={`relative p-4 rounded-2xl border transition-all ${plan.mostPopular ? 'bg-neutral-900 border-red-600 ring-1 ring-red-600' : 'bg-neutral-900/40 border-neutral-800 opacity-60'}`}
                      >
                        {plan.mostPopular && <span className="absolute -top-2.5 right-4 bg-red-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">Most Popular</span>}
                        <div className="flex justify-between items-start mb-3">
                          <div><h3 className="text-lg font-bold">{plan.name}</h3><p className="text-xs text-neutral-500">{plan.subtitle}</p></div>
                          <div className="text-right"><p className="text-lg font-black">{plan.price}</p><p className="text-[9px] text-neutral-500 uppercase">/ mo</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {plan.features.slice(0, 4).map(f => (
                            <div key={f} className="flex items-center gap-1.5 text-[10px] text-neutral-300">
                               <CheckCircle2 size={9} className="text-red-500 flex-shrink-0" /> <span className="leading-tight">{f}</span>
                            </div>
                          ))}
                        </div>
                        <button onClick={nextStep} className={`w-full py-2.5 rounded-xl font-bold text-xs ${plan.mostPopular ? 'bg-red-700 text-white' : 'bg-neutral-800 text-white'}`}>
                          {plan.cta}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={prevStep} className="px-5 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"><ArrowLeft size={18} /></button>
                {step < 4 && (
                  <button onClick={nextStep} disabled={step === 2 && (!formData.traderType || !formData.gender || !formData.birthYear)} className="flex-1 py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm">Continue</button>
                )}
              </div>
            </motion.div>
          )}
          {step === 5 && (
            <motion.div 
               key="step5"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-6 -mx-6 px-6 lg:-mx-20 lg:px-20"
            >
              {subStep === 1 ? (
                <>
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Add Trades</h1>
                    <span className="text-[9px] uppercase font-black text-neutral-600 tracking-widest">Step 1 of 2</span>
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black">Which broker do you use?</h2>
                    <p className="text-neutral-500 text-xs">Select your crypto exchange to get started</p>
                  </div>
                  <div className="grid grid-cols-6 gap-2.5 max-h-[350px] overflow-y-auto p-1 scrollbar-hide">
                    {EXCHANGES.map(ex => (
                      <button
                        key={ex.id}
                        onClick={() => updateFormData({ broker: ex.id })}
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all group ${formData.broker === ex.id ? 'bg-neutral-800 border-red-600 ring-1 ring-red-600' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}
                      >
                        <div className={`w-10 h-10 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform p-1.5`}>
                          {ex.icon && (
                            <img 
                              src={ex.icon} 
                              alt={ex.name} 
                              className="w-full h-full object-contain" 
                              referrerPolicy="no-referrer"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                          {(!ex.icon || !ex.icon.trim()) && (
                            <span className="font-bold text-white opacity-50 text-xs">{ex.name[0]}</span>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-neutral-400 group-hover:text-white transition-colors">{ex.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={prevStep} className="px-5 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"><ArrowLeft size={18} /></button>
                    <button onClick={nextStep} disabled={!formData.broker} className="flex-1 py-3 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all text-sm">Continue</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Add Trades</h1>
                    <span className="text-[9px] uppercase font-black text-neutral-600 tracking-widest">Step 2 of 2</span>
                  </div>
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-black">How would you like to add your trades?</h2>
                    <p className="text-neutral-500 text-xs">You can always change this later</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => updateFormData({ method: 'auto' })} className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${formData.method === 'auto' ? 'bg-red-700/10 border-red-600' : 'bg-neutral-900 border-neutral-800'}`}>
                      <div className={`p-3 rounded-xl ${formData.method === 'auto' ? 'bg-red-600' : 'bg-neutral-800'}`}>
                        <RefreshCcw size={20} className={formData.method === 'auto' ? 'animate-spin-slow' : ''} />
                      </div>
                      <div><p className="font-bold mb-1">Auto Sync (API)</p><p className="text-[10px] text-neutral-500 leading-relaxed">Real-time tracking of your portfolio via secure connections.</p></div>
                    </button>
                    <button onClick={() => updateFormData({ method: 'manual' })} className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all group relative ${formData.method === 'manual' ? 'bg-red-700/10 border-red-600' : 'bg-neutral-900 border-neutral-800'}`}>
                      <div className={`p-3 rounded-xl border border-transparent transition-all ${formData.method === 'manual' ? 'bg-red-700/20 border-red-600' : 'bg-neutral-800 border-neutral-700 group-hover:border-neutral-500'}`}>
                        <PenLine className={`${formData.method === 'manual' ? 'text-red-500' : 'text-neutral-500'}`} size={20} />
                      </div>
                      <div><p className="font-bold mb-1">Add Manually</p><p className="text-[10px] text-neutral-500 leading-relaxed">Complete control over your data. Perfect for cold storage.</p></div>
                      {formData.method === 'manual' && <div className="absolute top-2 right-2"><CheckCircle2 size={16} className="text-red-600" /></div>}
                    </button>
                  </div>
                  {formData.method === 'auto' ? (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       <h3 className="text-red-600 font-bold text-lg border-l-4 border-red-600 pl-4">How to connect your API</h3>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-neutral-800 rounded flex items-center justify-center">
                               <img src={EXCHANGES.find(e => e.id === formData.broker)?.icon} className="w-5 h-5 object-contain" alt="" onError={(e) => { (e.target as HTMLImageElement).src = 'https://www.google.com/favicon.ico'; }} />
                             </div>
                             <span className="font-bold text-neutral-300 capitalize">{formData.broker} Portfolio</span>
                           </div>
                           <ChevronRight className="text-neutral-600" />
                         </div>
                         <div className="space-y-4">
                            <div className="grid gap-2">
                              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">API Key</label>
                              <input type="text" placeholder="Enter your API Key" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-sm focus:border-red-600 outline-none transition-colors" value={formData.apiKey} onChange={(e) => updateFormData({ apiKey: e.target.value })} />
                            </div>
                            <div className="grid gap-2">
                              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Secret Key</label>
                              <input type="password" placeholder="Enter your Secret Key" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-sm focus:border-red-600 outline-none transition-colors" value={formData.apiSecret} onChange={(e) => updateFormData({ apiSecret: e.target.value })} />
                            </div>
                            {formData.broker === 'bitget' && (
                              <div className="grid gap-2">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Passphrase</label>
                                <input type="password" placeholder="Enter your API Passphrase" className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 px-4 text-sm focus:border-red-600 outline-none transition-colors" value={formData.apiPassphrase || ''} onChange={(e) => updateFormData({ apiPassphrase: e.target.value })} />
                              </div>
                            )}
                            {connectionError && <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-xl flex items-center gap-3 text-red-500 text-xs animate-in shake-1"><Settings size={14} className="animate-spin" />{connectionError}</div>}
                            <button onClick={handleConnect} disabled={isConnecting} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-all relative overflow-hidden active:scale-[0.98] disabled:opacity-70">{isConnecting ? (<div className="flex items-center justify-center gap-3"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying Credentials...</div>) : 'Connect & Go to Dashboard'}</button>
                         </div>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                       <h3 className="text-red-600 font-bold text-lg border-l-4 border-red-600 pl-4">Add Your First Trade</h3>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1 relative"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Symbol</label><div className="relative"><input type="text" placeholder="BTCUSDT" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none pr-10" value={formData.trade.symbol} onChange={(e) => updateTradeData({ symbol: e.target.value })} /><Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600" /></div></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Direction</label><div className="relative"><select className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none appearance-none" value={formData.trade.direction} onChange={(e) => updateTradeData({ direction: e.target.value })}><option>Long</option><option>Short</option></select><ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 rotate-90" /></div></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Date</label><div className="relative"><input type="date" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none" value={formData.trade.date} onChange={(e) => updateTradeData({ date: e.target.value })} /></div></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Time</label><input type="time" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none" value={formData.trade.time} onChange={(e) => updateTradeData({ time: e.target.value })} /></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Shares / Quantity</label><input type="number" placeholder="0.00" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none" value={formData.trade.quantity} onChange={(e) => updateTradeData({ quantity: e.target.value })} /></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Price</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-600">IDR</span><input type="number" placeholder="0.00" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 pl-12 pr-4 text-sm focus:border-red-600 outline-none text-right" value={formData.trade.price} onChange={(e) => updateTradeData({ price: e.target.value })} /></div></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Commissions</label><input type="number" placeholder="0.00" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none" value={formData.trade.commissions} onChange={(e) => updateTradeData({ commissions: e.target.value })} /></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest pl-1">Fees</label><input type="number" placeholder="0.00" className="w-full bg-neutral-900/40 border border-neutral-800 rounded-xl py-2.5 px-4 text-sm focus:border-red-600 outline-none" value={formData.trade.fees} onChange={(e) => updateTradeData({ fees: e.target.value })} /></div>
                       </div>
                       <button onClick={handleConnect} className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-all mt-4 hover:shadow-[0_0_20px_rgba(185,28,28,0.3)] active:scale-[0.98]">Connect & Go to Dashboard</button>
                    </div>
                  )}
                  <div className="flex gap-4 pt-4"><button onClick={prevStep} className="px-6 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"><ArrowLeft size={20} /></button></div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        <footer className="mt-auto py-4 text-center border-t border-neutral-900">
           <p className="text-[9px] uppercase tracking-widest text-neutral-700 font-black">© 2026 Catat Crypto. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingPage;
