import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, RefreshCw, Layers } from 'lucide-react';
import { CexAccount, SUPPORTED_CEX } from '../constants';
import { ALL_ACCOUNTS_ID, ALL_ACCOUNTS_OBJECT } from '../context/CexAccountContext';

interface CexAccountSwitcherProps {
  selectedAccount: CexAccount | null;
  onAccountChange: (account: CexAccount) => void;
  onAddAccount: () => void;
  refreshTrigger?: number; // Add refresh trigger prop
}

const CexAccountSwitcher: React.FC<CexAccountSwitcherProps> = ({
  selectedAccount,
  onAccountChange,
  onAddAccount,
  refreshTrigger,
}) => {
  const [accounts, setAccounts] = useState<CexAccount[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAccounts();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/cex-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log('📋 Fetched accounts:', data.data);
        
        // Check if we have new accounts (account count increased)
        const hadAccounts = accounts.length > 0;
        const accountCountIncreased = data.data.length > accounts.length;
        
        setAccounts(data.data);
        
        // Auto-select logic
        if (data.data.length > 0) {
          // Priority 1: Check localStorage for saved account ID (might be newly added or All Accounts)
          const savedAccountId = localStorage.getItem('selectedAccountId');
          if (savedAccountId) {
            const parsedId = parseInt(savedAccountId);
            
            // Handle All Accounts mode
            if (parsedId === ALL_ACCOUNTS_ID) {
              if (!selectedAccount || selectedAccount.id !== ALL_ACCOUNTS_ID) {
                console.log('🆕 Restoring All Accounts mode from localStorage');
                onAccountChange(ALL_ACCOUNTS_OBJECT);
              }
              return;
            }

            const savedAccount = data.data.find((acc: any) => acc.id === parsedId);
            if (savedAccount) {
              // If this is a new account (not currently selected), switch to it
              if (!selectedAccount || selectedAccount.id !== savedAccount.id) {
                console.log('🆕 Switching to saved account:', savedAccount.cex_display_name);
                onAccountChange(savedAccount);
                return;
              }
              // If already selected, keep it
              console.log('✅ Keeping current selected account:', selectedAccount.cex_display_name);
              return;
            }
          }
          
          // Priority 2: If account count increased (new account added), select the newest one
          if (hadAccounts && accountCountIncreased) {
            const newestAccount = data.data[data.data.length - 1];
            console.log('🆕 New account detected! Auto-selecting:', newestAccount.cex_display_name);
            localStorage.setItem('selectedAccountId', newestAccount.id.toString());
            onAccountChange(newestAccount);
            return;
          }
          
          // Priority 3: If we already have a selected account, verify it still exists
          if (selectedAccount) {
            const stillExists = data.data.find((acc: any) => acc.id === selectedAccount.id);
            if (stillExists) {
              console.log('✅ Keeping current selected account:', selectedAccount.cex_display_name);
              return;
            }
          }
          
          // Fallback: select most recent account
          const mostRecentAccount = data.data[data.data.length - 1];
          console.log('📌 Auto-selecting most recent account:', mostRecentAccount.cex_display_name);
          localStorage.setItem('selectedAccountId', mostRecentAccount.id.toString());
          onAccountChange(mostRecentAccount);
        }
      }
    } catch (error) {
      console.error('Failed to fetch CEX accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCexIcon = (cexName: string) => {
    const cex = SUPPORTED_CEX.find(c => c.value === cexName);
    return cex?.icon;
  };

  const getCexColor = (cexName: string) => {
    const cex = SUPPORTED_CEX.find(c => c.value === cexName);
    return cex?.color || '#666';
  };

  const handleAccountSelect = (account: CexAccount) => {
    console.log('🔄 Switching to account:', account.cex_display_name);
    localStorage.setItem('selectedAccountId', account.id.toString());
    onAccountChange(account);
    setIsOpen(false);
  };

  const handleAllAccountsSelect = () => {
    console.log('🔄 Switching to All Accounts mode');
    localStorage.setItem('selectedAccountId', ALL_ACCOUNTS_ID.toString());
    onAccountChange(ALL_ACCOUNTS_OBJECT);
    setIsOpen(false);
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    fetchAccounts();
  };

  if (isLoading && accounts.length === 0) {
    return (
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
        <RefreshCw size={16} className="animate-spin text-neutral-500" />
        <span className="text-sm text-neutral-400">Loading...</span>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2">
        <span className="text-sm text-neutral-400">No accounts</span>
        <button
          onClick={onAddAccount}
          className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
        >
          Add one
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Account Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-lg px-4 py-2 transition-colors min-w-[200px]"
      >
        {selectedAccount && (
          <>
            {/* CEX Icon */}
            <div 
              className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ 
                backgroundColor: selectedAccount.id === ALL_ACCOUNTS_ID 
                  ? '#ef444420' 
                  : `${getCexColor(selectedAccount.cex_name)}20` 
              }}
            >
              {selectedAccount.id === ALL_ACCOUNTS_ID ? (
                <Layers size={18} className="text-red-500" />
              ) : getCexIcon(selectedAccount.cex_name) ? (
                <img 
                  src={getCexIcon(selectedAccount.cex_name)} 
                  alt={selectedAccount.cex_display_name}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <span className="text-xs font-bold" style={{ color: getCexColor(selectedAccount.cex_name) }}>
                  {selectedAccount.cex_display_name[0]}
                </span>
              )}
            </div>

            {/* Account Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {selectedAccount.cex_display_name}
              </p>
              <p className="text-xs text-neutral-500 truncate">
                {selectedAccount.account_label}
              </p>
            </div>

            {/* Chevron */}
            <ChevronDown 
              size={16} 
              className={`text-neutral-400 transition-transform flex-shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-[100] overflow-hidden">
          <div className="p-2 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400">Switch Account</span>
            <button 
              onClick={handleRefresh}
              className="p-1 hover:bg-neutral-800 rounded-md transition-colors"
              title="Refresh accounts"
            >
              <RefreshCw size={14} className={`text-neutral-500 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {/* All Accounts Option */}
            <button
              onClick={handleAllAccountsSelect}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left ${
                selectedAccount?.id === ALL_ACCOUNTS_ID ? 'bg-neutral-800/50' : ''
              }`}
            >
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center bg-red-500/10 flex-shrink-0"
              >
                <Layers size={18} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">All Accounts</p>
                <p className="text-xs text-neutral-500">Unified View</p>
              </div>
              {selectedAccount?.id === ALL_ACCOUNTS_ID && (
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>

            {accounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleAccountSelect(account)}
                className={`w-full flex items-center gap-3 p-3 hover:bg-neutral-800 transition-colors ${
                  selectedAccount?.id === account.id ? 'bg-neutral-800/50' : ''
                }`}
              >
                {/* CEX Icon */}
                <div 
                  className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getCexColor(account.cex_name)}20` }}
                >
                  {getCexIcon(account.cex_name) ? (
                    <img 
                      src={getCexIcon(account.cex_name)} 
                      alt={account.cex_display_name}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold" style={{ color: getCexColor(account.cex_name) }}>
                      {account.cex_display_name[0]}
                    </span>
                  )}
                </div>

                {/* Account Info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {account.full_display_name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {account.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>

                {/* Selected Indicator */}
                {selectedAccount?.id === account.id && (
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Add Account Button */}
          <div className="border-t border-neutral-800 p-3">
            <button
              onClick={() => {
                setIsOpen(false);
                onAddAccount();
              }}
              className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add New Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CexAccountSwitcher;
