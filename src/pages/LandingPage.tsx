import React, { useState, useEffect } from "react";
import {
  Play,
  Shield,
  Zap,
  Lock,
  Eye,
  Network,
  ChevronRight,
  Activity,
  ArrowRight,
  CheckCircle2,
  Star,
  Menu,
  X,
  LineChart,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Bot,
  Twitter,
  Instagram,
  Linkedin,
  Users,
  BarChart2,
  Wallet,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import Navbar from "../components/landing/Navbar";
import AboutUs from "../components/landing/AboutUs";
import Contact from "../components/landing/Contact";
import Privacy from "../components/landing/Privacy";
import Terms from "../components/landing/Terms";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const isId = i18n.language === 'id';
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    setCurrentPage(path);
  }, [location]);

  useEffect(() => {
    // Attempt scroll immediately
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    // And also after a short delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLogin = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-red-500/30 flex flex-col">
      {/* NAVBAR */}
      <Navbar 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onLogin={handleLogin}
        onGetStarted={handleGetStarted}
      />

      {currentPage === 'home' ? (
        <main className="flex-1">
          {/* HERO SECTION */}
      <section className="relative overflow-hidden flex flex-col pt-32">
        {/* Background glow & circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center mt-[-100px]">
          <div className="absolute top-0 w-[800px] h-[500px] bg-[#4a0404] blur-[150px] mix-blend-screen opacity-60" />
          {/* Concentric Circles */}
          <div className="absolute top-[-300px] w-[800px] h-[800px] border border-[#3b1212] rounded-full" />
          <div className="absolute top-[-400px] w-[1100px] h-[1100px] border border-[#3b1212] rounded-full" />
          <div className="absolute top-[-500px] w-[1400px] h-[1400px] border border-[#3b1212] rounded-full" />
          <div className="absolute top-[-600px] w-[1700px] h-[1700px] border border-[#3b1212] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-10 pb-20 flex-1 flex flex-col justify-center">
          <div className="inline-block px-5 py-2 rounded-full border border-red-800/80 mb-8 mx-auto">
            <span className="text-[11px] font-bold tracking-[0.1em] text-[#FF4D4D] uppercase">
              {t('hero.badge')}
            </span>
          </div>

          <h1 className="text-[3.5rem] md:text-[5.5rem] font-bold text-white mb-6 tracking-tighter leading-none">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-[#A30000] hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(163,0,0,0.6)] text-[15px]"
            >
              {t('hero.startBtn')}
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#1A1A1A] hover:bg-[#252525] text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-colors border border-white/5 text-[15px]">
              <Play className="w-5 h-5" /> {t('hero.demoBtn')}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="w-full bg-[#181212] border-t border-[#2A1A1A] py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8">
            <div className="flex items-center gap-6 md:gap-10">
              <div>
                <div className="flex items-center gap-2 text-[#FF3B3B] font-bold text-2xl md:text-3xl mb-1 tracking-tight">
                  <Users className="w-5 h-5 md:w-6 md:h-6" /> 3,000+
                </div>
                <div className="text-neutral-500 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                  {t('stats.activeTraders')}
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="flex items-center gap-2 text-[#FF3B3B] font-bold text-2xl md:text-3xl mb-1 tracking-tight">
                  <BarChart2 className="w-5 h-5 md:w-6 md:h-6" /> 45,000+
                </div>
                <div className="text-neutral-500 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                  {t('stats.volumeTracked')}
                </div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="flex items-center gap-2 text-[#FF3B3B] font-bold text-2xl md:text-3xl mb-1 tracking-tight">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" /> Rp 0
                </div>
                <div className="text-neutral-500 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                  {t('stats.toStart')}
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-10 bg-white/10" />

            <div className="flex items-center gap-8 justify-between lg:justify-end flex-1">
              <div className="flex flex-col items-center lg:items-end text-right">
                <div className="text-neutral-500 text-[10px] font-semibold tracking-widest uppercase mb-1">
                  {t('stats.trustedBy')}
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-lg">
                  <MapPin className="w-5 h-5 text-neutral-400" /> {t('stats.across')}
                </div>
              </div>

              <div className="bg-[#120B0B] border border-white/5 rounded-[30px] p-2 pr-6 flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-[#120B0B] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=11" alt="user" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-[#120B0B] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=12" alt="user" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-[#120B0B] overflow-hidden">
                    <img src="https://i.pravatar.cc/100?img=13" alt="user" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FF3B3B] border-2 border-[#120B0B] flex items-center justify-center text-white text-xs font-bold">
                    +2k
                  </div>
                </div>
                <div>
                  <div className="text-white text-xs font-bold mb-0.5">
                    {t('stats.join')}
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-[#FACC15] text-[#FACC15]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID (FEATURES) */}
      <section className="py-24 max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="lg:col-span-2 bg-[#1C0808] rounded-[32px] pt-10 px-10 pb-0 overflow-hidden flex flex-col md:flex-row group">
            <div className="w-full md:w-[55%] flex flex-col justify-between z-10">
              <div className="mb-10">
                <div className="text-[11px] font-bold tracking-[0.15em] text-[#E58C80] uppercase mb-4">
                  {t('bento.institutional')}
                </div>
                <h3 className="text-3xl lg:text-[40px] font-bold text-white mb-5 leading-tight tracking-tight">
                  {t('bento.master')}
                </h3>
                <p className="text-[#E58C80] text-base leading-relaxed mb-8 w-[95%]">
                  {t('bento.masterDesc')}
                </p>
              </div>

              <div className="bg-[#3D1E1B] rounded-t-[20px] p-6 pb-0 relative overflow-hidden w-[95%]">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[10px] font-bold text-[#BDA29F] tracking-[0.1em] uppercase">
                    {t('bento.weekly')}
                  </div>
                  <div className="text-sm font-bold text-white">+12.4%</div>
                </div>
                {/* Fake bar chart at bottom */}
                <div className="flex items-end gap-2.5 h-[70px] w-full">
                  <div className="flex-1 h-[20%] bg-[#6E332A] rounded-t-[4px]" />
                  <div className="flex-1 h-[10%] bg-[#6E332A] rounded-t-[4px]" />
                  <div className="flex-1 h-[40%] bg-[#A8726A] rounded-t-[4px]" />
                  <div className="flex-1 h-[15%] bg-[#6E332A] rounded-t-[4px]" />
                  <div className="flex-1 h-[100%] bg-[#FFB3A6] rounded-t-[4px]" />
                  <div className="flex-1 h-[30%] bg-[#A8726A] rounded-t-[4px]" />
                </div>
              </div>
            </div>

            <div className="w-full md:w-[45%] flex items-center justify-center p-6 relative z-10 pb-10">
              <div className="w-full aspect-square max-w-[280px] bg-[#220D0A] rounded-[32px] flex items-center justify-center relative shadow-2xl">
                <svg
                  viewBox="0 0 100 100"
                  className="w-[75%] h-[75%] opacity-90 drop-shadow-xl transform -rotate-[15deg]"
                >
                  <path
                    d="M 50 10 A 40 40 0 1 1 10 50 L 30 50 A 20 20 0 1 0 50 30 Z"
                    fill="#6E2623"
                  />
                  <path
                    d="M 50 10 A 40 40 0 0 0 10 50 L 30 50 A 20 20 0 0 1 50 30 Z"
                    fill="#9C3A33"
                  />
                  <path
                    d="M 90 50 A 40 40 0 0 1 65 87 L 57 70 A 20 20 0 0 0 70 50 Z"
                    fill="#FF6B55"
                  />
                </svg>
                <Star className="absolute top-10 left-6 w-10 h-10 fill-[#C5F3CB] text-[#C5F3CB] transform -rotate-[15deg]" />
                <Star className="absolute top-20 left-16 w-5 h-5 fill-[#FF6B55] text-[#FF6B55]" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 bg-[#231514] rounded-[32px] p-10 flex flex-col group justify-between">
            <div>
              <div className="text-[#E26A59] mb-8">
                <Network className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-5">
                {t('bento.community')}
              </h3>
              <p className="text-[#E58C80] text-base leading-relaxed mb-8">
                {t('bento.communityDesc')}
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center text-base font-bold text-white hover:text-[#E26A59] group-hover:gap-2 transition-all mt-6"
            >
              {t('bento.explore')} <ArrowRight className="w-5 h-5 ml-1" />
            </a>
          </div>

          {/* Card 3 (Green) */}
          <div className="col-span-1 bg-gradient-to-b from-[#0C1F15] to-[#050D08] rounded-[32px] p-10 flex flex-col items-center justify-center text-center">
            <div className="mb-8">
              <Zap className="w-12 h-12 text-[#34D399] fill-[#34D399]" />
            </div>
            <h3 className="text-3xl font-bold text-[#34D399] mb-5 leading-tight whitespace-pre-wrap">
              {t('bento.accurate')}
            </h3>
            <p className="text-[#89B39B] text-base leading-relaxed">
              {t('bento.accurateDesc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="lg:col-span-2 bg-[#330B08] rounded-[32px] p-10 relative overflow-hidden flex items-center">
            <div className="relative z-10 w-full md:w-[65%]">
              <h3 className="text-3xl lg:text-[40px] font-bold text-white mb-4">
                {t('bento.security')}
              </h3>
              <p className="text-[#E58C80] text-base mb-10 leading-relaxed max-w-lg">
                {t('bento.securityDesc')}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {[
                  t('bento.points.readonly'),
                  t('bento.points.nocustody'),
                  t('bento.points.secure'),
                  t('bento.points.privacy'),
                  t('bento.points.soc2')
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-base text-white"
                  >
                    <div className="w-5 h-5 rounded-full border border-[#E26A59] flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E26A59]" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute right-0 top-0 w-[45%] h-full hidden md:flex items-center justify-center p-8 pointer-events-none">
              <div className="w-[85%] aspect-square bg-[#45120E] rounded-[32px] flex items-center justify-center shadow-2xl">
                <Shield className="w-28 h-28 text-[#8C2B22] fill-[#C7483B]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON - THE COST OF BLIND TRADING */}
      <section className="relative flex flex-col w-full min-h-[800px] overflow-hidden bg-[#050505]">
        {/* Split Backgrounds */}
        <div className="absolute inset-0 flex flex-col md:flex-row w-full h-full">
          <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#1A0605] border-b md:border-b-0 md:border-r border-[#2A0D0B]" />
          <div className="w-full h-1/2 md:w-1/2 md:h-full bg-[#0A1A12] border-t md:border-t-0 md:border-l border-[#123322]" />
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center w-full h-full pt-24 pb-32">
          <div className="text-[10px] font-bold tracking-widest text-[#E26A59] uppercase mb-4 text-center">
            {t('comparison.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight text-center">
            {t('comparison.title')}
          </h2>
          <p className="text-[#8C8C8C] text-sm md:text-base text-center mb-16 md:mb-24 px-6">
            {t('comparison.subtitle')}
          </p>

          <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto px-6 gap-16 md:gap-0">
            {/* Left Box (Red) */}
            <div className="w-full md:w-1/2 flex flex-col items-center text-center px-4 md:pr-12 md:pl-0">
              <div className="inline-block px-5 py-1.5 rounded-full border border-[#4A1410] text-[#E26A59] text-[10px] font-bold tracking-widest uppercase mb-12">
                {t('comparison.without')}
              </div>

              <div className="mb-16">
                <div className="text-[11px] font-bold text-[#A37B75] uppercase tracking-wider mb-4">
                  {t('comparison.tradeAccuracy')}
                </div>
                <div className="text-[80px] md:text-[140px] leading-none font-bold text-[#C7483B] mb-4 tracking-tighter">
                  42%
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#A37B75] uppercase">
                  {t('comparison.inconsistent')}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#A37B75] uppercase tracking-wider mb-4">
                  {t('comparison.emotionalImpact')}
                </div>
                <div className="text-[60px] md:text-[110px] leading-none font-bold text-[#C7483B] mb-4 tracking-tighter">
                  {t('comparison.high')}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#A37B75] uppercase">
                  {t('comparison.reactionary')}
                </div>
              </div>
            </div>

            {/* Right Box (Green) */}
            <div className="w-full md:w-1/2 flex flex-col items-center text-center px-4 md:pl-12 md:pr-0">
              <div className="inline-block px-5 py-1.5 rounded-full border border-[#163322] text-[#34D399] text-[10px] font-bold tracking-widest uppercase mb-12 mt-16 md:mt-0">
                {t('comparison.with')}
              </div>

              <div className="mb-16">
                <div className="text-[11px] font-bold text-[#34D399] uppercase tracking-wider mb-4">
                  {t('comparison.tradeAccuracy')}
                </div>
                <div className="text-[80px] md:text-[140px] leading-none font-bold text-[#34D399] mb-4 tracking-tighter">
                  89%
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#34D399] uppercase">
                  {t('comparison.datadriven')}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-[#34D399] uppercase tracking-wider mb-4">
                  {t('comparison.emotionalImpact')}
                </div>
                <div className="text-[60px] md:text-[110px] leading-none font-bold text-[#34D399] mb-4 tracking-tighter">
                  {t('comparison.low')}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#34D399] uppercase">
                  {t('comparison.systematic')}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-[#FF6B55] hover:bg-[#ff7a66] text-[#240C0A] rounded-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_-5px_rgba(255,107,85,0.4)]"
            >
              {t('comparison.bridge')} <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* APP MOCKUP. ONE APP. TOTAL CONTROL. */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 text-center mb-16">
          <div className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-4">
            {t('appMockup.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight whitespace-pre-wrap">
            {t('appMockup.title')}
          </h2>
          <p className="text-lg text-neutral-400">
            {t('appMockup.desc')}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex bg-[#101014] p-1 inline-flex rounded-full border border-white/5">
            {[
              { icon: LayoutDashboard, name: t('appMockup.tabs.dashboard') },
              { icon: LineChart, name: t('appMockup.tabs.reports') },
              { icon: Calendar, name: t('appMockup.tabs.calendar') },
              { icon: Activity, name: t('appMockup.tabs.trades') },
              { icon: BookOpen, name: t('appMockup.tabs.notebook') },
              { icon: Bot, name: t('appMockup.tabs.ai') },
            ].map((tab, idx) => (
              <button
                key={idx}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  idx === 0
                    ? "bg-red-600 text-white shadow-lg"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden md:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MOCKUP VISUAL */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="w-full min-h-[400px] md:aspect-[16/9] bg-[#0A0A0C] border border-[#1F1F26] rounded-t-3xl shadow-[0_-20px_60px_-15px_rgba(220,38,38,0.15)] flex flex-col overflow-hidden relative">
            {/* Window controls */}
            <div className="h-10 border-b border-[#1F1F26] flex items-center px-4 bg-[#08080A]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
                <div className="w-3 h-3 rounded-full bg-[#333]" />
              </div>
              <div className="mx-auto text-[10px] font-mono text-neutral-500 bg-[#15151A] px-4 py-1 rounded-md max-w-[150px] md:max-w-none truncate">
                catatcrypto.app/dashboard
              </div>
            </div>

            {/* App Layout */}
            <div className="flex-1 flex p-4 md:p-6 gap-6 relative overflow-x-auto overflow-y-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
              {/* Sidebar placeholder */}
              <div className="hidden md:flex flex-col w-48 gap-4 border-r border-[#1F1F26] pr-6">
                <div className="h-8 bg-[#1F1F26]/50 rounded mb-4" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-8 rounded ${i === 1 ? "bg-red-600/20 text-red-500" : "bg-[#15151A]"}`}
                  />
                ))}
              </div>

              {/* Main content placeholder min-w ensures it doesn't squish too much on mobile scroll */}
              <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-[300px]">
                {/* Top Stats */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] md:text-xs text-neutral-500 mb-1 font-semibold uppercase tracking-wider">
                      {t('appMockup.accountBal')}
                    </div>
                    <div className="text-2xl md:text-4xl font-bold text-white">
                      $142,508.42
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-[#15151A] px-3 py-1.5 md:px-4 md:py-2 border border-[#1F1F26] rounded-xl flex items-center gap-2 md:gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500" />
                      <div className="text-xs md:text-sm font-semibold text-emerald-400">
                        +$42,120.00
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`bg-[#15151A] border border-[#1F1F26] rounded-2xl p-4 md:p-5 h-24 md:h-32 flex flex-col justify-between ${i === 3 ? 'hidden md:flex' : ''}`}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#1F1F26]" />
                      <div className="h-2 w-1/2 bg-[#2A2A35] rounded-full" />
                      <div className="h-3 md:h-4 w-3/4 bg-[#333340] rounded-full mt-2" />
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 bg-[#15151A] border border-[#1F1F26] rounded-2xl relative overflow-hidden min-h-[150px]">
                  {/* Overlay Graphic representing 'Advanced Analytics' */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent z-10" />
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[8px] md:text-[10px] font-bold text-red-500 tracking-wider uppercase">
                        {t('appMockup.liveIntel')}
                      </span>
                    </div>
                    <div className="text-xl md:text-3xl font-bold text-white shadow-sm max-w-[200px] md:max-w-none">
                      {t('appMockup.advAnalytics')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATAT CRYPTO HUB - BROKERS */}
      <section className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
          <div className="text-[10px] font-bold tracking-widest text-[#E26A59] uppercase mb-4">
            {t('hub.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('hub.title')}
          </h2>
          <p className="text-[#8C8C8C] text-sm md:text-base whitespace-pre-wrap">
            {t('hub.desc')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto relative h-[500px] flex items-center justify-center">
          {/* Subtle Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4a0404] blur-[150px] opacity-30 pointer-events-none" />

          {/* Connecting lines - visual simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line
              x1="20%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="15%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="20%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="80%"
              y1="20%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="85%"
              y1="50%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
            <line
              x1="80%"
              y1="80%"
              x2="50%"
              y2="50%"
              stroke="white"
              strokeWidth="1"
            />
          </svg>

          {/* Center Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-32 h-32 bg-[#1A0605] border border-[#3A1410] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(227,47,47,0.2)]">
              <div className="text-2xl font-bold text-white tracking-tight flex items-center gap-1">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[#1A0605] rounded-full" />
                </div>
                Catat
                <br />
                Crypto
              </div>
            </div>
          </div>

          {/* Orbiting Icons */}
          {/* Left Side */}
          <div className="absolute top-[20%] left-[15%] md:left-[20%] flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <img
                src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=029"
                alt="Binance"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              Binance
            </span>
          </div>
          <div className="absolute top-[50%] left-[5%] md:left-[10%] flex flex-col items-center gap-2 -translate-y-1/2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <img
                src="https://cryptologos.cc/logos/okb-okb-logo.png?v=029"
                alt="OKX"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              OKX
            </span>
          </div>
          <div className="absolute bottom-[20%] left-[15%] md:left-[20%] flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <img
                src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=029"
                alt="Bybit"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              Bybit
            </span>
          </div>

          {/* Right Side */}
          <div className="absolute top-[20%] right-[15%] md:right-[20%] flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <img
                src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=029"
                alt="MEXC"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              MEXC
            </span>
          </div>
          <div className="absolute top-[50%] right-[5%] md:right-[10%] flex flex-col items-center gap-2 -translate-y-1/2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <img
                src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=029"
                alt="Pintu"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              Pintu
            </span>
          </div>
          <div className="absolute bottom-[20%] right-[15%] md:right-[20%] flex flex-col items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#000] border border-white/5 rounded-2xl flex items-center justify-center p-2.5 md:p-3">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#1A56F6] border-4 border-white/20" />
            </div>
            <span className="text-[9px] md:text-[10px] uppercase font-semibold text-neutral-500">
              Coinbase
            </span>
          </div>
        </div>

        <div className="text-center mt-12 text-[#8C8C8C] text-sm relative z-10">
          {t('hub.missingUrl')}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 bg-[#0A0A0C]">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-neutral-400">
            {t('pricing.desc')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 items-center">
          {/* Free Tier */}
          <div className="bg-[#12121A] border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">{t('pricing.free')}</h3>
              <span className="text-xs font-semibold text-neutral-500">
                {t('pricing.freeDesc')}
              </span>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">IDR 0</span>
              <span className="text-neutral-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-neutral-600" />{t('pricing.freeLimit')}
              </li>
            </ul>
            <button 
              onClick={handleGetStarted}
              className="w-full py-4 rounded-full border border-white/10 font-medium hover:bg-white/5 transition-colors"
            >
              {t('pricing.freeBtn')}
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="bg-[#151218] border-2 border-red-600/50 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-[0_0_40px_-10px_rgba(220,38,38,0.15)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-red-500/50">
              {t('pricing.proBadge')}
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">{t('pricing.pro')}</h3>
              <span className="text-xs font-semibold text-red-400">
                {t('pricing.proDesc')}
              </span>
            </div>

            <div className="flex items-center justify-center p-1 bg-black/40 rounded-full w-max mb-6 border border-white/5 text-xs">
              <button className="px-3 py-1 rounded-full text-white bg-white/10">
                {t('pricing.monthly')}
              </button>
              <button className="px-3 py-1 rounded-full text-neutral-500 hover:text-white flex items-center gap-1">
                {t('pricing.yearly')} <span className="text-red-500">{t('pricing.save')}</span>
              </button>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-white">IDR 99.000</span>
              <span className="text-neutral-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {[
                { key: 'auto', text: t('pricing.features.auto') },
                { key: 'multi', text: t('pricing.features.multi') },
                { key: 'cal', text: t('pricing.features.cal') },
                { key: 'port', text: t('pricing.features.port') },
                { key: 'add', text: t('pricing.features.add') },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-red-500" />
                  {item.text}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleGetStarted}
              className="w-full py-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition-colors shadow-lg shadow-red-900/30"
            >
              {t('pricing.proBtn')}
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-[#12121A] border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">{t('pricing.premium')}</h3>
              <span className="text-xs font-semibold text-neutral-500">
                {t('pricing.premiumDesc')}
              </span>
            </div>
            <div className="flex items-center p-1 bg-black/40 rounded-full w-max mb-6 border border-white/5 text-xs">
              <button className="px-3 py-1 rounded-full text-white bg-white/10">
                {t('pricing.monthly')}
              </button>
              <button className="px-3 py-1 rounded-full text-neutral-500 hover:text-white">
                {t('pricing.yearly')}
              </button>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">IDR 149.000</span>
              <span className="text-neutral-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              {(isId ? [
                "Semua Fitur Pro",
                "Asisten A.I Pribadi (Beta)",
                "Skor Catat Crypto",
                "Akses Awal Fitur Baru",
              ] : [
                "All Pro Features",
                "Personalize A.I Assistant (Beta)",
                "Dashboard Catat Crypto Score",
                "Early Access for New Features",
              ]).map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <CheckCircle2 className="w-5 h-5 text-neutral-400" />
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleGetStarted}
              className="w-full py-4 rounded-full border border-white/10 font-medium hover:bg-white/5 transition-colors"
            >
              {t('pricing.premiumBtn')}
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[#050505] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <div className="text-xs font-semibold tracking-widest text-red-500 uppercase mb-4">
              {isId ? "Bukti Sosial" : "Wall of Social Proof"}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isId ? "Trader Nyata." : "Real Traders."}
              <br />
              {isId ? "Hasil Nyata." : "Real Results."}
            </h2>
            <p className="text-lg text-neutral-400 max-w-sm mb-8">
              {isId ? "Bergabunglah dengan ribuan analis profesional Indonesia yang membuat jurnal lebih cerdas dan trading lebih presisi dengan Catat Crypto." : "Join thousands of professional Indonesian analysts who journal smarter and trade with confidence using Catat Crypto."}
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-400">
              <div className="flex -space-x-2">
                {["AJ", "MK", "SL"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#050505] bg-neutral-800 flex items-center justify-center text-xs font-bold"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span>{isId ? "+12k bergabung minggu ini" : "+12k joined this week"}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Dynamic Masonry-ish grid layout. We will use simple CSS grid here for speed */}
            {[
              {
                name: "Rizky A.",
                role: "DAY TRADER, BYBIT",
                quote:
                  "Sejak pakai Catat Crypto, aku bisa lihat pola trading aku jauh lebih jelas. Win rate aku naik 15% dalam sebulan pertama.",
                platform: "BYBIT",
                verified: true,
              },
              {
                name: "Budi Santoso",
                role: "DAY TRADER, TOKOCRYPTO",
                quote:
                  "Catat Crypto adalah investasi terbaik tahun ini. Fitur analitiknya benar-benar membuka mata tentang risiko manajemen yang saya remehkan selama 2 tahun terakhir.",
                platform: "TOKOCRYPTO",
                verified: true,
              },
              {
                name: "Dian Anggraini",
                role: "ACTIVE TRADER, BINANCE",
                quote:
                  "UI-nya sangat intuitif. Gak perlu pusing lagi rekap manual di Excel. Sangat membantu untuk evaluasi psikologi trading yang selama ini terabaikan.",
                platform: "BINANCE",
                verified: true,
              },
              {
                name: "Yuda P.",
                role: "ADVANCE TRADER, JAKARTA",
                quote:
                  "Dashboardnya sangat clean. Membantu saya tetap fokus pada data, bukan emosi.",
                platform: "JAKARTA",
                verified: true,
              },
              {
                name: "Kevin M.",
                role: "DAY TRADER, INDODAX PRO",
                quote: "Sangat krusial untuk manajemen resiko.",
                platform: "INDODAX",
                verified: true,
              },
              {
                name: "Adi S.",
                role: "BASIC TRADER",
                quote:
                  "Gak ada kata terlambat buat mulai journaling. Ini game changer buat portfolio management saya.",
                platform: "BASIC",
                verified: true,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-[#12121A] border border-white/5 p-8 text-neutral-300 rounded-2xl flex flex-col justify-between"
              >
                <div className="mb-6">
                  <div className="text-red-500 mb-2">" "</div>
                  <p className="text-sm leading-relaxed">"{review.quote}"</p>
                  <div className="flex items-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3 h-3 fill-red-500 text-red-500"
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm">
                    {review.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {review.name}
                      </span>
                      {review.verified && (
                        <span className="bg-red-500/20 text-red-500 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                          {isId ? "Terverifikasi" : "Verified"}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                      {review.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-sm font-medium tracking-widest uppercase text-neutral-500">
              {isId ? "Dipercaya & Diulas Pada" : "Trusted & Reviewed On"}
            </span>
            <div className="flex items-center gap-8 text-white font-bold text-lg">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-600 rounded-full" /> Google
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-emerald-500 text-emerald-500" />{" "}
                Trustpilot
              </span>
              <span className="flex items-center gap-2 text-orange-500">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                  P
                </div>{" "}
                Product Hunt
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER PROGRAM */}
      <section className="py-32 px-6 max-w-[1200px] mx-auto bg-[#050505]">
        <div className="bg-[#3D0A0A] border border-[#521313] rounded-[32px] p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden">
          {/* Abstract watermark/pattern in background */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_right_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50 mix-blend-screen pointer-events-none" />

          <div className="flex-1 relative z-10 w-full lg:w-auto mb-16 lg:mb-0">
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center text-white font-bold text-xl drop-shadow-sm">
                <div className="flex -space-x-1.5 mr-2">
                  <div className="w-5 h-5 rounded-full bg-white opacity-80" />
                  <div className="w-5 h-5 rounded-full border-2 border-[#3D0A0A] bg-white opacity-60" />
                </div>
                Catat
                <br />
                <span className="text-[#FF6B55]">Crypto</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 mx-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B38C8C]">
                {t('partnership.badge')}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight whitespace-pre-wrap">
              {t('partnership.title')}
              <span className="text-[#FF6B55]">{t('partnership.soon')}</span>
            </h2>

            <ul className="space-y-4 my-10">
              {[
                t('partnership.f1'),
                t('partnership.f2'),
                t('partnership.f3'),
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-[#E6CDCD] text-lg"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#FF6B55]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#FF6B55] hover:bg-[#ff7a66] text-[#240C0A] rounded-xl font-bold transition-all">
                {t('partnership.btn')}
              </button>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B38C8C] mb-1">
                  {t('partnership.payout')}
                </span>
                <span className="text-white font-bold text-xl">$1,450.00+</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] relative z-10">
            <div className="bg-[#2A0707] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="text-white font-bold">{isId ? "Komisi Anda" : "Your Commission"}</div>
                <div className="text-[#FF6B55] font-bold">35%</div>
              </div>
              <div className="space-y-6">
                {[
                  { label: isId ? "Referral Aktif" : "Active Referrals", val: "124" },
                  { label: isId ? "Total Pendapatan" : "Total Earnings", val: "$4,210.50" },
                  { label: isId ? "Pembayaran Berikutnya" : "Next Payout", val: "May 15" },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-neutral-400 text-sm">{stat.label}</span>
                    <span className="text-white font-semibold">{stat.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-[#FF6B55] rounded-full" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold uppercase text-neutral-500">
                  <span>{isId ? "Level Perak" : "Silver Level"}</span>
                  <span>{isId ? "Level Emas" : "Gold Level"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight whitespace-pre-wrap">
            {t('cta.title1')}
            <span className="text-red-600">{t('cta.title2')}</span>
          </h2>
          <p className="text-lg text-neutral-400 mb-12 max-w-2xl mx-auto">
            {t('cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)]"
            >
              {t('cta.btn1')}
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-lg transition-all border border-white/10">
              {t('cta.btn2')}
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {[t('cta.f1'), t('cta.f2'), t('cta.f3')].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white">
                <CheckCircle2 className="w-4 h-4 text-red-500" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>
        </main>
      ) : currentPage === 'about' ? (
        <AboutUs />
      ) : currentPage === 'contact' ? (
        <Contact />
      ) : currentPage === 'privacy' ? (
        <Privacy />
      ) : currentPage === 'terms' ? (
        <Terms />
      ) : null}

      {/* FOOTER */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
