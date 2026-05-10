import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  LayoutGrid,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/apiService';
import { useTranslation } from 'react-i18next';
import { CexAccount } from '../constants';
import { useCexAccount, ALL_ACCOUNTS_ID } from '../context/CexAccountContext';
import AddCexAccountModal from '../components/AddCexAccountModal';
import SyncLoadingModal from '../components/SyncLoadingModal';
import SuccessToast from '../components/SuccessToast';

interface DashboardPageProps {
  formData: any;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ formData }) => {
  const { portfolioData, setPortfolioData, lastSyncedAccountId, setLastSyncedAccountId } = usePortfolio();
  const { selectedAccount, setSelectedAccount: setSelectedAccountContext } = useCexAccount();
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const isFirstMount = React.useRef(true);
  const [accountRefreshKey, setAccountRefreshKey] = useState(0);

  // Wrapper for setSelectedAccount that also saves to localStorage
  const handleAccountChange = (account: CexAccount) => {
    setSelectedAccountContext(account);
  };

  const monthNames = [
    t('dashboard.january') || "January",
    t('dashboard.february') || "February", 
    t('dashboard.march') || "March",
    t('dashboard.april') || "April",
    t('dashboard.may') || "May",
    t('dashboard.june') || "June",
    t('dashboard.july') || "July",
    t('dashboard.august') || "August",
    t('dashboard.september') || "September",
    t('dashboard.october') || "October",
    t('dashboard.november') || "November",
    t('dashboard.december') || "December"
  ];

  const handleResync = async (showToast: boolean = true, fastMode: boolean = false) => {
    // Check if user has CEX account selected
    if (!selectedAccount) {
      setSyncError('No CEX account selected. Please add an account first.');
      setIsAddModalOpen(true);
      return;
    }

    setIsSyncing(true);
    setSyncError('');
    setDataErrors({});

    try {
      const token = localStorage.getItem('auth_token');
      const isAllAccounts = selectedAccount.id === ALL_ACCOUNTS_ID;
      
      let url = isAllAccounts 
        ? 'http://localhost:8000/api/cex-accounts/sync-all'
        : `http://localhost:8000/api/cex-accounts/${selectedAccount.id}/sync`;

      // Add fast_mode parameter if requested
      if (fastMode) {
        url += (url.includes('?') ? '&' : '?') + 'fast_mode=1';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to sync');
      }

      setPortfolioData(data.data);
      setSyncError('');
      validatePortfolioData(data.data);
      
      setLastSyncedAccountId(selectedAccount.id);
      
      // Show success toast only if requested (not on initial load)
      if (showToast) {
        setShowSuccessToast(true);
      }
    } catch (e: any) {
      setSyncError(e.message || 'Failed to sync. Please check your API credentials.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAccountAdded = async () => {
    // Fetch latest accounts
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/cex-accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data.length > 0) {
        // API returns DESC order (newest first), so first item is the newest account
        const newestAccount = data.data[0]; // ✅ Fixed: was data.data[data.data.length - 1]
        
        // Select it
        handleAccountChange(newestAccount);
        
        // Trigger refresh in TopBar
        setAccountRefreshKey(prev => prev + 1);
        
        // The useEffect will handle the sync automatically
      }
    } catch (error) {
      console.error('Failed to fetch accounts after creation:', error);
    }
    
    setIsAddModalOpen(false);
  };

  // Validate each data section and set specific errors
  const validatePortfolioData = (data: any) => {
    const errors: Record<string, string> = {};

    if (!data) {
      errors.global = t('dashboard.noDataFromApi') || 'Tidak ada data dari API';
      setDataErrors(errors);
      return;
    }

    // Check Net P&L
    if (!data.netPnl || data.netPnl === '$0.00') {
      errors.netPnl = t('dashboard.noTradingHistory');
    }

    // Check Day Win Rate
    if (!data.dayWinRate || data.dayWinRate === '0%') {
      errors.dayWinRate = t('dashboard.noTradingHistory');
    }

    // Check Trade Win Rate
    if (!data.tradeWinRate || data.tradeWinRate === '0%') {
      errors.tradeWinRate = t('dashboard.noTradingHistory');
    }

    // Check Avg Win/Loss
    if (!data.avgWinLoss || data.avgWinLoss === '$0 / $0') {
      errors.avgWinLoss = t('dashboard.noTradingHistory');
    }

    // Check Catat Crypto Score (derived from trade win rate)
    if (!data.tradeWinRate || parseFloat(data.tradeWinRate) === 0) {
      errors.score = t('dashboard.noDataToCalculate');
    }

    // Check Cumulative Equity Curve
    if (!data.totalBalance || data.totalBalance === '$0.00') {
      errors.equity = t('dashboard.balanceNotAvailable');
    }

    // Check Daily Performance
    if (!data.performance || data.performance.length === 0) {
      errors.performance = t('dashboard.noTradingHistory');
    }

    // Check Active Deployments
    if (!data.activeDeployments || data.activeDeployments.length === 0) {
      errors.deployments = t('dashboard.noOpenPositions');
    }

    setDataErrors(errors);
  };

  // Auto-sync when account changes OR on first mount
  useEffect(() => {
    if (selectedAccount) {
      const isAllAccounts = selectedAccount.id === ALL_ACCOUNTS_ID;

      // Skip sync if we already have data for THIS exact account
      if (portfolioData && lastSyncedAccountId === selectedAccount.id) {
        console.log('✅ Using cached data for account:', selectedAccount.cex_display_name);
        validatePortfolioData(portfolioData);
        isFirstMount.current = false; 
        return;
      }

      // First mount: Sync only if no data OR data is for different account
      if (isFirstMount.current) {
        isFirstMount.current = false;
        
        if (portfolioData && lastSyncedAccountId === selectedAccount.id) {
          console.log('✅ Found valid data on first mount, skipping sync');
          return;
        }

        console.log('🔄 Initial auto-sync for account:', selectedAccount.cex_display_name);
        handleResync(false, isAllAccounts);
        return;
      }
      
      // Subsequent changes (manual account switch): Sync if account actually changed
      if (selectedAccount.id !== lastSyncedAccountId) {
        console.log('🔄 Account changed, syncing:', selectedAccount.cex_display_name);
        handleResync(true, isAllAccounts);
      }
    }
  }, [selectedAccount?.id, lastSyncedAccountId]); // Stable dependencies

  // Run validation on mount if data exists
  React.useEffect(() => {
    if (portfolioData) {
      validatePortfolioData(portfolioData);
    }
  }, [portfolioData, t]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  const balance = portfolioData?.totalBalance || "$0.00";
  const pnl = portfolioData?.netPnl || "$0.00";
  const pnlPercent = portfolioData?.netPnlPercent || "0%";
  const pnlPositive = portfolioData?.netPnlPositive ?? true;

  const dayWinRate = portfolioData?.dayWinRate || "0%";
  const dayWinRateSub = portfolioData?.dayWinRateSub || "0/0 Days";
  const tradeWinRate = portfolioData?.tradeWinRate || "0%";
  const tradeWinRateSub = portfolioData?.tradeWinRateSub || "0/0 Trades";
  const avgWinLoss = portfolioData?.avgWinLoss || "$0 / $0";
  const rrRatio = portfolioData?.rrRatio || "RR: 0";

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar 
        plan={formData.plan} 
        onNewTradeClick={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 bg-[#050505] min-h-screen">
        <TopBar 
          name={formData.name}
          selectedAccount={selectedAccount}
          onAccountChange={handleAccountChange}
          refreshKey={accountRefreshKey}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-red-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={t('dashboard.quickSearch')}
                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-neutral-700 transition-all"
              />
            </div>
            
            {/* Re-sync Button */}
            <button
              onClick={() => handleResync(true)}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:border-red-600 transition-all disabled:opacity-50 group"
              title={t('dashboard.resync')}
            >
              <RefreshCw 
                size={16} 
                className={`${isSyncing ? 'animate-spin text-red-600' : 'text-neutral-400 group-hover:text-red-600'} transition-colors`} 
              />
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                {isSyncing ? t('dashboard.syncing') : t('dashboard.resync')}
              </span>
            </button>
          </div>
        </TopBar>

        <div className="p-8 max-w-[1600px] mx-auto space-y-8">
          {/* Sync Error Alert */}
          {syncError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-900/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-red-500">{syncError}</p>
                <p className="text-xs text-neutral-400 mt-1">{t('dashboard.syncErrorAction')}</p>
              </div>
              <button 
                onClick={() => setSyncError('')}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                ×
              </button>
            </motion.div>
          )}

          {/* Empty State Warning */}
          {!portfolioData && !isSyncing && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-900/20 border border-yellow-900/50 rounded-2xl p-4 flex items-center gap-3"
            >
              <AlertCircle size={20} className="text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-500">{t('dashboard.noData')}</p>
                <p className="text-xs text-neutral-400 mt-1">{t('dashboard.noDataAction')} {selectedAccount?.cex_display_name || t('dashboard.yourExchange')}.</p>
              </div>
            </motion.div>
          )}

          {/* Header */}
          <header className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-neutral-500 text-sm">{t('dashboard.subtitle')}</p>
              </div>
              {selectedAccount && (
                <div className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-neutral-400">
                    {t('dashboard.connectedTo')} <span className="text-white uppercase">{selectedAccount.cex_display_name}</span>
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              label={t('dashboard.netPnl')}
              value={pnl} 
              subValue={pnlPercent} 
              positive={pnlPositive} 
              error={dataErrors.netPnl}
            />
            <StatCard 
              label={t('dashboard.dayWinRate')}
              value={dayWinRate} 
              subValue={dayWinRateSub} 
              error={dataErrors.dayWinRate}
            />
            <StatCard 
              label={t('dashboard.tradeWinRate')}
              value={tradeWinRate} 
              subValue={tradeWinRateSub} 
              error={dataErrors.tradeWinRate}
            />
            <StatCard 
              label={t('dashboard.avgWinLoss')}
              value={avgWinLoss} 
              subValue={rrRatio} 
              custom 
              error={dataErrors.avgWinLoss}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Score Radar Chart */}
            <div className="lg:col-span-4">
              <ErrorBadge message={dataErrors.score} />
              <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 relative overflow-hidden">
                <h3 className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-8">{t('dashboard.catatCryptoScore')}</h3>
              <div className="aspect-square relative flex items-center justify-center">
                {/* Mock Radar Chart SVG */}
                <svg className="w-full h-full max-w-[280px]" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
                  <path d="M100 20 L180 100 L100 180 L20 100 Z" fill="none" stroke="#262626" strokeWidth="1" />
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    d="M100 40 L160 100 L100 150 L50 100 Z"
                    fill="rgba(185, 28, 28, 0.2)"
                    stroke="#B91C1C"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white">{Math.round(parseFloat(portfolioData?.tradeWinRate || "0") * 1.2)}</span>
                  <span className="text-xs font-black text-red-600 tracking-widest mt-1">
                    {parseFloat(portfolioData?.tradeWinRate || "0") > 60 ? 'A+ TIER' : (parseFloat(portfolioData?.tradeWinRate || "0") > 40 ? 'B TIER' : 'C TIER')}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-neutral-800/40 p-3 rounded-2xl border border-neutral-700/50 text-center">
                  <p className="text-[10px] text-neutral-500 uppercase font-black mb-1">{t('dashboard.riskRating')}</p>
                  <p className="text-sm font-bold text-white uppercase">{parseFloat(portfolioData?.rrRatio?.split(': ')[1] || "0") > 1.5 ? t('dashboard.excellent') : t('dashboard.moderate')}</p>
                </div>
                <div className="bg-neutral-800/40 p-3 rounded-2xl border border-neutral-700/50 text-center">
                  <p className="text-[10px] text-neutral-500 uppercase font-black mb-1">{t('dashboard.consistency')}</p>
                  <p className="text-sm font-bold text-white uppercase">{parseFloat(portfolioData?.dayWinRate || "0") > 50 ? t('dashboard.top5Percent') : t('dashboard.developing')}</p>
                </div>
              </div>
            </div>
            </div>

            {/* Equity Curve + Daily Realized Bar Chart */}
            <div className="lg:col-span-8 space-y-6">
              {/* Equity Line Chart */}
              <div>
                <ErrorBadge message={dataErrors.equity} />
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 h-[300px] relative">
                  <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[10px] uppercase font-black text-neutral-500 tracking-widest">{t('dashboard.cumulativeEquityCurve')}</h3>
                  <div className="text-right">
                    <p className="text-[8px] text-neutral-500 uppercase font-black mb-1 tracking-wider">{t('dashboard.yAxisLabel')}</p>
                    <p className="text-2xl font-bold text-white tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>{balance}</p>
                  </div>
                </div>
                <div className="absolute bottom-12 left-8 right-8 top-24">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="equityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(185, 28, 28, 0.4)" />
                        <stop offset="100%" stopColor="rgba(185, 28, 28, 0)" />
                      </linearGradient>
                    </defs>
                    {(() => {
                      if (!portfolioData?.performance || portfolioData.performance.length === 0) return null;

                      // We need cumulative balance points. 
                      // Start from current balance and work backwards using realizedValue.
                      let currentBal = parseFloat(balance.replace(/[^0-9.-]+/g, ""));
                      if (isNaN(currentBal) || currentBal === 0) currentBal = 10000;

                      const points: number[] = [];
                      points.unshift(currentBal); // today

                      for (let i = portfolioData.performance.length - 1; i >= 1; i--) {
                        currentBal -= portfolioData.performance[i].realizedValue;
                        points.unshift(currentBal);
                      }

                      const maxBal = Math.max(...points) * 1.05;
                      const minBal = Math.min(...points) * 0.95;
                      const range = maxBal - minBal === 0 ? 1 : maxBal - minBal;

                      // Generate path string "M x y L x y"
                      const stepX = 100 / (points.length - 1 || 1);
                      let pathD = "";
                      points.forEach((pt, idx) => {
                        const x = idx * stepX;
                        // Y is inverted (0 is top, 100 is bottom)
                        const y = 100 - ((pt - minBal) / range) * 100;
                        if (idx === 0) pathD += `M${x} ${y}`;
                        else pathD += ` L${x} ${y}`;
                      });

                      const lastX = 100;
                      const lastY = 100 - ((points[points.length - 1] - minBal) / range) * 100;

                      return (
                        <>
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2 }}
                            d={pathD}
                            fill="none"
                            stroke="#B91C1C"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                          <motion.path
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            d={`${pathD} L100 100 L0 100 Z`}
                            fill="url(#equityGradient)"
                          />
                          <circle cx={lastX} cy={lastY} r="2" fill="#B91C1C" />
                        </>
                      );
                    })()}
                  </svg>
                  {/* Balance label as HTML overlay to prevent stretching */}
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-8">
                    <span className="text-sm font-semibold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap">
                      {balance}
                    </span>
                  </div>
                </div>
              </div>
              </div>

              {/* Bar Chart */}
              <div>
                <ErrorBadge message={dataErrors.performance} />
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 h-[240px] relative overflow-hidden">
                  <h3 className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-6">{t('dashboard.netDailyRealized')} ({monthNames[currentDate.getMonth()].substring(0,3)})</h3>
                <div className="flex items-end justify-between gap-4 h-24 mt-4">
                  {portfolioData?.performance && portfolioData.performance.length > 0 ? (
                    portfolioData.performance.slice(0, 6).map((day, i) => {
                      const maxVal = Math.max(...portfolioData.performance.map(d => Math.abs(d.realizedValue)));
                      const h = maxVal === 0 ? 10 : Math.max(10, (Math.abs(day.realizedValue) / maxVal) * 100);
                      return (
                        <Bar key={i} height={`${h}%`} label={day.realized} date={day.date} positive={day.positive} />
                      );
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-2 py-4">
                      <AlertCircle size={24} className="text-red-500/50" />
                      <p className="text-xs font-bold text-red-500">
                        {dataErrors.performance || 'Belum ada data performa harian'}
                      </p>
                      <p className="text-[10px] text-neutral-600">
                        {t('dashboard.apiConnectedNoHistory')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Performance Calendar */}
          <div>
            <ErrorBadge message={dataErrors.performance} />
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-8 relative">
              <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()} {t('dashboard.monthPerformance')}</h3>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-800">
              {[
                t('dashboard.mon'),
                t('dashboard.tue'),
                t('dashboard.wed'),
                t('dashboard.thu'),
                t('dashboard.fri'),
                t('dashboard.sat'),
                t('dashboard.sun')
              ].map(day => (
                <div key={day} className="bg-neutral-900/50 p-4 text-[10px] uppercase font-black text-neutral-500 text-center tracking-widest">{day}</div>
              ))}

              {Array.from({ length: startOffset }).map((_, idx) => (
                <CalendarEmpty key={`empty-${idx}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                const dayData = isCurrentMonth ? portfolioData?.performance?.find(d => parseInt(d.date) === dayNum) : null;
                
                // Pure API data - no fallbacks
                if (dayData) {
                  return (
                    <CalendarDay
                      key={dayNum}
                      day={dayNum < 10 ? `0${dayNum}` : dayNum.toString()}
                      value={dayData.realized}
                      trades={dayData.tradesCount ? `${dayData.tradesCount} ${t('dashboard.trades')}` : '-'}
                      positive={dayData.positive}
                      neutral={dayData.neutral}
                    />
                  );
                }

                // Empty day - no data from API
                return (
                  <CalendarDay
                    key={dayNum}
                    day={dayNum < 10 ? `0${dayNum}` : dayNum.toString()}
                    value="-"
                    trades="-"
                  />
                );
              })}
            </div>
          </div>
          </div>

          {/* Active Deployments Table */}
          <div>
            <ErrorBadge message={dataErrors.deployments} />
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl overflow-hidden mb-12 relative">
              <div className="p-8 border-b border-neutral-800 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">{t('dashboard.activeDeployments')}</h3>
                <p className="text-neutral-500 text-xs">{t('dashboard.realTimeTelemetry')}</p>
              </div>
              <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/30">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">{t('dashboard.liveData')}</span>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-900/40 text-[10px] uppercase font-black text-neutral-500 tracking-widest border-b border-neutral-800">
                <tr>
                  <th className="px-8 py-4">{t('dashboard.asset')}</th>
                  <th className="px-8 py-4">{t('dashboard.entryMatrix')}</th>
                  <th className="px-8 py-4">{t('dashboard.positionSize')}</th>
                  <th className="px-8 py-4">{t('dashboard.pnlUnrealized')}</th>
                  <th className="px-8 py-4">{t('dashboard.duration')}</th>
                  <th className="px-8 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {portfolioData?.activeDeployments && portfolioData.activeDeployments.length > 0 ? (
                  portfolioData.activeDeployments.map((trade: any) => (
                    <TableRow
                      key={trade.id}
                      asset={trade.asset}
                      type={trade.type}
                      entry={trade.entry}
                      size={trade.size}
                      pnl={trade.pnl}
                      percent={trade.percent}
                      duration={trade.duration}
                      positive={trade.positive}
                      exchange={trade.exchange}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-8">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <AlertCircle size={32} className="text-red-500/50" />
                        <div className="text-center">
                          <p className="text-sm font-bold text-red-500 mb-1">
                            {dataErrors.deployments || t('dashboard.noActivePositions')}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {dataErrors.deployments 
                              ? `${t('dashboard.connectedTo')} ${formData.broker?.toUpperCase() || 'exchange'} ${t('dashboard.apiConnectedNoPositions').toLowerCase()}.`
                              : t('dashboard.connectApiOrManual')
                            }
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="p-4 bg-neutral-900/40 text-center">
              <button className="text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">{t('dashboard.viewDeepAuditLog')}</button>
            </div>
          </div>
          </div>
        </div>
      </main>

      {/* Add CEX Account Modal */}
      <AddCexAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAccountAdded}
      />

      {/* Sync Loading Modal */}
      <SyncLoadingModal
        isOpen={isSyncing}
        cexName={selectedAccount?.cex_display_name || 'Exchange'}
        message="Fetching your latest trading data and portfolio balance..."
      />

      {/* Success Toast */}
      <SuccessToast
        isOpen={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        cexName={selectedAccount?.cex_display_name || 'Exchange'}
      />
    </div>
  );
};

// --- Sub Components ---

const ErrorBadge = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="mb-2">
      <div className="bg-red-900/80 border border-red-800/50 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
        <AlertCircle size={12} className="text-red-400 flex-shrink-0" />
        <span className="text-[9px] font-bold text-red-300 uppercase tracking-wider leading-tight">{message}</span>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, positive = false, custom = false, error }: any) => (
  <div>
    <ErrorBadge message={error} />
    <div className="bg-neutral-900/30 border border-neutral-800 rounded-3xl p-6 hover:border-neutral-700 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <LayoutGrid size={12} className="text-neutral-700" />
      </div>
      <p className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-2">{label}</p>
      <div className="flex items-baseline gap-2 mb-1">
        <h2 className="text-3xl font-black text-white tracking-tight">{value}</h2>
        {positive && !custom && <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">{subValue}</span>}
      </div>
      {!positive && !custom && <p className="text-[10px] font-black text-neutral-600 tracking-tighter">{subValue}</p>}
      {custom && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{subValue}</span>
        </div>
      )}
    </div>
  </div>
);

const Bar = ({ height, label, date, positive = false }: any) => (
  <div className="flex-1 flex flex-col items-center gap-3 group">
    <div className="w-full relative flex flex-col justify-end h-full min-h-[100px]">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`w-full rounded-t-xl relative group-hover:brightness-125 transition-all ${positive ? 'bg-green-700/80 shadow-[0_0_15px_rgba(22,163,74,0.2)]' : 'bg-red-700/80 shadow-[0_0_15px_rgba(220,38,38,0.2)]'}`}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          <span className={`text-[10px] font-black ${positive ? 'text-green-500' : 'text-red-500'}`}>{label}</span>
        </div>
      </motion.div>
    </div>
    <span className="text-[10px] font-black text-neutral-700">{date}</span>
  </div>
);

const CalendarDay = ({ day, value, trades, positive = false, neutral = false }: any) => (
  <div className="bg-neutral-950 p-4 h-32 flex flex-col group hover:bg-neutral-900 transition-all cursor-pointer relative overflow-hidden">
    {positive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600/50" />}
    {!positive && !neutral && <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600/50" />}

    <div className="flex justify-between items-start mb-auto">
      <span className="text-xs font-black text-neutral-600 group-hover:text-neutral-400 transition-colors">{day}</span>
      {trades !== '-' && <span className="text-[8px] font-black bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded-full border border-neutral-800 uppercase tracking-widest">{trades}</span>}
    </div>
    <div className="space-y-1">
      <p className={`text-sm font-black tracking-tight ${positive ? 'text-green-500' : neutral ? 'text-neutral-600' : 'text-red-500'}`}>{value}</p>
      <div className={`h-1 w-full rounded-full ${positive ? 'bg-green-500/20' : neutral ? 'bg-neutral-800' : 'bg-red-500/20'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: positive ? '60%' : neutral ? '0%' : '40%' }}
          className={`h-full rounded-full ${positive ? 'bg-green-500' : 'bg-red-500'}`}
        />
      </div>
    </div>
  </div>
);

const CalendarEmpty = () => (
  <div className="bg-neutral-900/30 p-4 h-32 opacity-20 border-r border-b border-neutral-800"></div>
);

const TableRow = ({ asset, type, entry, size, pnl, percent, duration, positive = false, exchange }: any) => (
  <tr className="hover:bg-neutral-800/30 transition-colors group cursor-pointer">
    <td className="px-8 py-5">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${asset.includes('BTC') ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
          {asset[0]}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-black text-white mb-0.5 tracking-tight">{asset}</p>
            {exchange && (
              <span className="text-[8px] font-black bg-neutral-800 text-neutral-500 px-1.5 py-0.5 rounded-md border border-neutral-700 uppercase tracking-tighter">
                {exchange}
              </span>
            )}
          </div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${positive ? 'text-green-600' : 'text-red-600'}`}>{type}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-5 text-xs font-bold text-neutral-300 font-mono tracking-tighter">{entry}</td>
    <td className="px-8 py-5 text-xs font-bold text-neutral-300 font-mono tracking-tighter">{size}</td>
    <td className="px-8 py-5">
      <p className={`text-xs font-black ${positive ? 'text-green-500' : 'text-red-500'} mb-0.5 font-mono tracking-tighter`}>{pnl}</p>
      <p className={`text-[9px] font-black ${positive ? 'text-green-600/60' : 'text-red-600/60'} tracking-widest`}>{percent}</p>
    </td>
    <td className="px-8 py-5 text-xs font-bold text-neutral-500 font-mono tracking-tighter">{duration}</td>
    <td className="px-8 py-5 text-right">
      <button className="text-neutral-700 hover:text-white transition-colors"><MoreHorizontal size={18} /></button>
    </td>
  </tr>
);

export default DashboardPage;
