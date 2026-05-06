import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setIsOpen(false);
  };

  const currentLanguage = i18n.language || 'id';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-500 hover:text-white transition-colors flex items-center gap-2"
        title="Change Language"
      >
        <Globe size={20} />
        <span className="text-xs font-bold uppercase">{currentLanguage}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[160px]">
            <button
              onClick={() => changeLanguage('id')}
              className={`w-full px-4 py-3 text-left text-sm font-bold hover:bg-neutral-800 transition-colors flex items-center gap-3 ${
                currentLanguage === 'id' ? 'text-red-500 bg-neutral-800/50' : 'text-neutral-300'
              }`}
            >
              <span className="text-lg">🇮🇩</span>
              <span>Bahasa Indonesia</span>
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`w-full px-4 py-3 text-left text-sm font-bold hover:bg-neutral-800 transition-colors flex items-center gap-3 ${
                currentLanguage === 'en' ? 'text-red-500 bg-neutral-800/50' : 'text-neutral-300'
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
