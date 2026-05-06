import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import CexAccountSwitcher from './CexAccountSwitcher';
import AddCexAccountModal from './AddCexAccountModal';
import { CexAccount } from '../constants';

interface TopBarProps {
  name?: string;
  avatarInitials?: string;
  children?: React.ReactNode;
  selectedAccount?: CexAccount | null;
  onAccountChange?: (account: CexAccount) => void;
  refreshKey?: number;
}

const TopBar: React.FC<TopBarProps> = ({ name, avatarInitials, children, selectedAccount, onAccountChange, refreshKey: externalRefreshKey }) => {
  const { userName } = usePortfolio();
  const { t } = useTranslation();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const displayName = name || userName || 'User Account';
  const displayInitials = avatarInitials || (displayName !== 'User Account' ? displayName[0].toUpperCase() : 'U');

  const handleModalSuccess = () => {
    setIsAddModalOpen(false);
    setRefreshKey(prev => prev + 1); // Force refresh CexAccountSwitcher
  };

  // Use external refresh key if provided, otherwise use internal
  const effectiveRefreshKey = externalRefreshKey !== undefined ? externalRefreshKey : refreshKey;

  return (
    <>
      <div className="h-20 border-b border-neutral-900 flex items-center justify-between px-8 sticky top-0 bg-black/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-8">
          {children}
        </div>
        
        <div className="flex items-center gap-6">
          {/* CEX Account Switcher */}
          {onAccountChange && (
            <CexAccountSwitcher
              key={effectiveRefreshKey}
              selectedAccount={selectedAccount}
              onAccountChange={onAccountChange}
              onAddAccount={() => setIsAddModalOpen(true)}
            />
          )}
          
          <div className="flex items-center gap-4 border-r border-neutral-800 pr-6">
            <LanguageSwitcher />
            <button className="text-neutral-500 hover:text-white transition-colors"><Moon size={20} /></button>
          </div>
          <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white">{displayName}</p>
                <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">{t('topbar.verifiedTrader')}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center font-bold text-sm border border-red-500/30">
                {displayInitials}
              </div>
          </div>
        </div>
      </div>

      {/* Add CEX Account Modal */}
      <AddCexAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default TopBar;
