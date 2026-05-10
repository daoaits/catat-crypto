import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CexAccount } from '../constants';

interface CexAccountContextType {
  selectedAccount: CexAccount | null;
  setSelectedAccount: (account: CexAccount | null) => void;
  accounts: CexAccount[];
  fetchAccounts: () => Promise<void>;
  isLoading: boolean;
}

const CexAccountContext = createContext<CexAccountContextType | undefined>(undefined);

interface CexAccountProviderProps {
  children: ReactNode;
}

export const ALL_ACCOUNTS_ID = -1;

export const ALL_ACCOUNTS_OBJECT: CexAccount = {
  id: ALL_ACCOUNTS_ID,
  cex_name: 'all',
  cex_display_name: 'All Accounts',
  account_label: 'Unified View',
  full_display_name: 'All Accounts - Unified View',
  is_active: true,
  last_synced_at: null,
  created_at: new Date().toISOString(),
};

export const CexAccountProvider: React.FC<CexAccountProviderProps> = ({ children }) => {
  const [selectedAccount, setSelectedAccountState] = useState<CexAccount | null>(null);
  const [accounts, setAccounts] = useState<CexAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.warn('No auth token found');
        return;
      }

      const response = await fetch('http://localhost:8000/api/cex-accounts', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      if (data.success) {
        console.log('📋 CexAccountContext: Fetched accounts:', data.data);
        setAccounts(data.data);

        // Restore selected account from localStorage
        const savedId = localStorage.getItem('selectedAccountId');
        if (savedId) {
          if (parseInt(savedId) === ALL_ACCOUNTS_ID) {
            console.log('✅ CexAccountContext: Restored All Accounts mode');
            setSelectedAccountState(ALL_ACCOUNTS_OBJECT);
            return;
          }
          const saved = data.data.find((acc: CexAccount) => acc.id === parseInt(savedId));
          if (saved) {
            console.log('✅ CexAccountContext: Restored saved account:', saved.cex_display_name);
            setSelectedAccountState(saved);
            return;
          }
        }

        // Auto-select first account if none selected
        if (data.data.length > 0 && !selectedAccount) {
          console.log('📌 CexAccountContext: Auto-selecting first account:', data.data[0].cex_display_name);
          setSelectedAccountState(data.data[0]);
          localStorage.setItem('selectedAccountId', data.data[0].id.toString());
        }
      }
    } catch (error) {
      console.error('Failed to fetch CEX accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedAccount = (account: CexAccount | null) => {
    console.log('🔄 CexAccountContext: Setting selected account:', account?.cex_display_name || 'null');
    setSelectedAccountState(account);
    if (account) {
      localStorage.setItem('selectedAccountId', account.id.toString());
    } else {
      localStorage.removeItem('selectedAccountId');
    }
  };

  // Fetch accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <CexAccountContext.Provider
      value={{
        selectedAccount,
        setSelectedAccount,
        accounts,
        fetchAccounts,
        isLoading,
      }}
    >
      {children}
    </CexAccountContext.Provider>
  );
};

export const useCexAccount = () => {
  const context = useContext(CexAccountContext);
  if (!context) {
    throw new Error('useCexAccount must be used within CexAccountProvider');
  }
  return context;
};
