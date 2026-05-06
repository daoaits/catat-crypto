import React, { createContext, useState, useContext, ReactNode } from 'react';
import { PortfolioData } from '../services/apiService';

interface PortfolioContextType {
  portfolioData: PortfolioData | null;
  setPortfolioData: (data: PortfolioData | null) => void;
  userName: string;
  setUserName: (name: string) => void;
  isSynced: boolean;
  logout: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(() => {
    const saved = localStorage.getItem('portfolio_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('trader_name') || '');

  const handleSetPortfolioData = (data: PortfolioData | null) => {
    setPortfolioData(data);
    if (data) {
      localStorage.setItem('portfolio_data', JSON.stringify(data));
    } else {
      localStorage.removeItem('portfolio_data');
    }
  };

  const handleSetUserName = (name: string) => {
    setUserName(name);
    localStorage.setItem('trader_name', name);
  };

  const logout = () => {
    setPortfolioData(null);
    setUserName('');
    localStorage.removeItem('portfolio_data');
    localStorage.removeItem('trader_name');
    localStorage.removeItem('user_form_data');
    localStorage.removeItem('app_step');
    localStorage.removeItem('app_substep');
    window.location.href = '/register';
  };

  return (
    <PortfolioContext.Provider 
      value={{ 
        portfolioData, 
        setPortfolioData: handleSetPortfolioData,
        userName,
        setUserName: handleSetUserName,
        isSynced: portfolioData !== null,
        logout
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
