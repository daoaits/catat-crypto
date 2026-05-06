import React from 'react';
import { Share2, Globe, MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#120505] border-t border-[#2A0D0B] pt-20 pb-8 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-20 gap-12">
          {/* Logo & Description */}
          <div className="w-full md:w-1/3 text-left">
            <div className="flex items-center gap-3 mb-6 mix-blend-screen overflow-hidden">
               <div className="w-8 h-8 relative shrink-0">
                 <div className="absolute inset-0 bg-white rounded-full flex items-center justify-center">
                   <div className="w-4 h-4 bg-[#120505] rounded-full" />
                   <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-[70%] -translate-y-1/2 mix-blend-difference" />
                 </div>
               </div>
               <div className="text-white font-bold leading-none text-xl translate-y-[-1px]">
                 Catat<br/><span className="text-[#FF6B55]">Crypto</span>
               </div>
            </div>
            <p className="text-[#8C8C8C] text-sm leading-relaxed mb-8 pr-8">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-4">
               <button className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#2F0B0B] flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#2F0B0B] flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
               </button>
               <button className="w-10 h-10 rounded-full bg-[#1A0A0A] border border-[#2F0B0B] flex items-center justify-center text-[#8C8C8C] hover:text-white transition-colors">
                  <MessageSquare className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 text-left">
             <div>
               <h4 className="text-white font-bold mb-6">{t('footer.product')}</h4>
               <ul className="space-y-4">
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.dashboard')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.reports')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.calendar')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.trades')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.notebook')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('appMockup.tabs.ai')}</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-bold mb-6">{t('footer.company')}</h4>
               <ul className="space-y-4">
                 <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('about'); }} className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('nav.about')}</a></li>
                 <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="text-[#8C8C8C] hover:text-white text-sm transition-colors">{t('nav.contact')}</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">Wall of Love</a></li>
                 <li><a href="#" className="text-[#8C8C8C] hover:text-white text-sm transition-colors">Become A Partner</a></li>
               </ul>
             </div>
             <div>
               <h4 className="text-white font-bold mb-6">{t('footer.legal')}</h4>
               <ul className="space-y-4">
                 <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('privacy'); }} className="text-[#E26A59] hover:text-[#ff7a66] text-sm transition-colors font-medium">Privacy Policy</a></li>
                 <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigate('terms'); }} className="text-[#8C8C8C] hover:text-white text-sm transition-colors">Terms &amp; Conditions</a></li>
               </ul>
             </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-[#2A0D0B] flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-[#666666] text-sm">{t('footer.rights')}</p>
           <div className="flex gap-6">
             <button onClick={() => i18n.changeLanguage('en')} className={`text-sm transition-colors font-medium ${i18n.language === 'en' ? 'text-[#E26A59]' : 'text-[#666666] hover:text-white'}`}>English</button>
             <button onClick={() => i18n.changeLanguage('id')} className={`text-sm transition-colors font-medium ${i18n.language === 'id' ? 'text-[#E26A59]' : 'text-[#666666] hover:text-white'}`}>Indonesia</button>
           </div>
        </div>
      </div>
    </footer>
  );
}
