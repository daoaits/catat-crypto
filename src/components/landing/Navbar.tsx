import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import FeaturesDropdown from "./FeaturesDropdown";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onLogin?: () => void;
  onGetStarted?: () => void;
}

export default function Navbar({ isMenuOpen, setIsMenuOpen, currentPage, setCurrentPage, onLogin, onGetStarted }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}>
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-[#050505] rounded-full" />
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-[70%] -translate-y-1/2 mix-blend-difference" />
            </div>
          </div>
          <div className="text-white font-bold leading-none">
            Catat
            <br />
            <span className="text-neutral-400">Crypto</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 h-full">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
            className={`text-[13px] font-semibold h-full flex items-center transition-colors ${currentPage === 'home' ? 'text-[#E26A59] border-b-2 border-[#E26A59]' : 'text-neutral-400 hover:text-white border-b-2 border-transparent'}`}
          >
            {t('nav.home')}
          </a>
          <FeaturesDropdown handleNavigate={handleNavigate} />
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
            className={`text-[13px] font-semibold h-full flex items-center transition-colors ${currentPage === 'contact' ? 'text-[#E26A59] border-b-2 border-[#E26A59]' : 'text-neutral-400 hover:text-white border-b-2 border-transparent'}`}
          >
            {t('nav.contact')}
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('about'); }}
            className={`text-[13px] font-semibold h-full flex items-center transition-colors ${currentPage === 'about' ? 'text-[#E26A59] border-b-2 border-[#E26A59]' : 'text-neutral-400 hover:text-white border-b-2 border-transparent'}`}
          >
            {t('nav.about')}
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="relative flex items-center w-[56px] h-[30px] bg-[#121214] border border-white/10 rounded-full cursor-pointer p-[3px] transition-colors hover:border-white/20"
            aria-label="Toggle Language"
          >
            <div 
              className={`absolute top-[3px] left-[3px] w-[22px] h-[22px] bg-[#2E3136] rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                i18n.language === 'en' ? 'translate-x-0' : 'translate-x-[26px]'
              }`}
            />
            <div className="relative z-10 flex items-center justify-between w-full px-0.5 pointer-events-none">
              <span className={`text-[10px] font-bold w-[22px] text-center transition-colors ${i18n.language === 'en' ? 'text-white' : 'text-neutral-500'}`}>EN</span>
              <span className={`text-[10px] font-bold w-[22px] text-center transition-colors ${i18n.language === 'id' ? 'text-white' : 'text-neutral-500'}`}>ID</span>
            </div>
          </button>
          <button 
            onClick={onLogin}
            className="text-[13px] font-semibold text-white px-5 py-2 hover:bg-white/5 rounded-full border border-white/10 transition-colors"
          >
            {t('nav.login')}
          </button>
          <button 
            onClick={onGetStarted}
            className="px-5 py-2 bg-[#CC1010] hover:bg-[#E22222] text-white text-[13px] font-bold rounded-lg transition-all shadow-lg"
          >
            {t('nav.getStarted')}
          </button>
        </div>

        <button
          className="md:hidden text-neutral-400 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#050505] border-b border-white/5 flex flex-col items-center py-6 gap-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
           <button 
              onClick={toggleLanguage}
              className="relative flex items-center w-[120px] h-[36px] bg-[#121214] border border-white/10 rounded-full cursor-pointer p-[4px] transition-colors hover:border-white/20"
              aria-label="Toggle Language"
            >
              <div 
                className={`absolute top-[4px] left-[4px] w-[54px] h-[26px] bg-[#2E3136] rounded-full shadow-sm transition-transform duration-300 ease-in-out ${
                  i18n.language === 'en' ? 'translate-x-0' : 'translate-x-[56px]'
                }`}
              />
              <div className="relative z-10 flex items-center justify-between w-full px-2 pointer-events-none">
                <span className={`text-[11px] font-bold w-[50px] text-center transition-colors ${i18n.language === 'en' ? 'text-white' : 'text-neutral-500'}`}>EN</span>
                <span className={`text-[11px] font-bold w-[50px] text-center transition-colors ${i18n.language === 'id' ? 'text-white' : 'text-neutral-500'}`}>ID</span>
              </div>
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
            className={`text-sm font-semibold transition-colors ${currentPage === 'home' ? 'text-[#E26A59]' : 'text-neutral-400 hover:text-white'}`}
          >
            {t('nav.home')}
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('home'); }}
            className={`text-sm font-semibold transition-colors text-neutral-400 hover:text-white`}
          >
            {t('nav.features')}
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
            className={`text-sm font-semibold transition-colors ${currentPage === 'contact' ? 'text-[#E26A59]' : 'text-neutral-400 hover:text-white'}`}
          >
            {t('nav.contact')}
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handleNavigate('about'); }}
            className={`text-sm font-semibold transition-colors ${currentPage === 'about' ? 'text-[#E26A59]' : 'text-neutral-400 hover:text-white'}`}
          >
            {t('nav.about')}
          </a>
          <div className="flex flex-col items-center gap-4 mt-2 w-full px-6">
            <button 
              onClick={onLogin}
              className="w-full text-[13px] font-semibold text-white px-5 py-3 rounded-full border border-white/10 transition-colors"
            >
              {t('nav.login')}
            </button>
            <button 
              onClick={onGetStarted}
              className="w-full px-5 py-3 bg-[#CC1010] hover:bg-[#E22222] text-white text-[13px] font-bold rounded-lg transition-all shadow-lg"
            >
              {t('nav.getStarted')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
