import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, RefreshCw } from 'lucide-react';
import { CexAccount, SUPPORTED_CEX } from '../constants';

interface CexAccountSwitcherProps {
  selectedAccount: CexAccount | null;
  onAccountChange: (account: CexAccount) => void;
  onAddAccount: () => void;
}

const CexAccountSwitcher: React.FC<CexAccountSwitcherProps> = ({
  selectedAccount,
  onAccountChange,
  onAddAccount,
}) => {
  const [accounts, setAccounts] = useState<CexAccount[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

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
      const token = localStorage.getItem('auth_token'); // Fixed: use 'auth_token'
      const response = await fetch('http://localhost:8000/api/cex-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log('📋 Fetched accounts:', data.data); // Debug log
        setAccounts(data.data);
        
        // Auto-select account based on priority:
        // 1. If parent already has selectedAccount, keep it
        // 2. If localStorage has saved account ID, restore it
        // 3. Otherwise, select first account
        if (data.data.length > 0 && !selectedAccount) {
          const savedAccountId = localStorage.getItem('selectedAccountId');
          
          if (savedAccountId) {
            // Try to find saved account
            const savedAccount = data.data.find((acc: any) => acc.id === parseInt(savedAccountId));
            if (savedAccount) {
              console.log('✅ Restored saved account:', savedAccount.cex_display_name);
              onAccountChange(savedAccount);
              return;
            }
          }
          
          // Fallback: select first account
          console.log('📌 Auto-selecting first account:', data.data[0].cex_display_name);
          onAccountChange(data.data[0]);
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
    onAccountChange(account);
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
              style={{ backgroundColor: `${getCexColor(selectedAccount.cex_name)}20` }}
            >
              {getCexIcon(selectedAccount.cex_name) ? (
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
        <div className="absolute top-full right-0 mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-neutral-800">
            <span className="text-sm font-medium text-white">Switch Account</span>
            <button
              onClick={handleRefresh}
              className="p-1 hover:bg-neutral-800 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} className={`text-neutral-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Account List */}
          <div className="max-h-64 overflow-y-auto">
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
