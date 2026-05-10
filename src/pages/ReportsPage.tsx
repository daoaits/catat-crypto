import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Calendar,
  History,
  Activity,
  ChevronRight,
  ChevronLeft,
  X,
  Edit2,
  Camera,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  List,
  Link,
  Image as ImageIcon,
  Table,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useCexAccount, ALL_ACCOUNTS_ID } from '../context/CexAccountContext';
import { useTranslation } from 'react-i18next';

import { usePortfolio } from '../context/PortfolioContext';
import { apiService } from '../services/apiService';

interface ReportsPageProps {
  formData: any;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ formData }) => {
  const { portfolioData, setPortfolioData, lastSyncedAccountId, setLastSyncedAccountId } = usePortfolio();
  const { selectedAccount } = useCexAccount();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedDate, setSelectedDate] = useState<any | null>(null);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});
  const isFirstMount = React.useRef(true);
  
  // Journal state
  const [journalRemarks, setJournalRemarks] = useState('');
  const [journalScreenshots, setJournalScreenshots] = useState<string[]>([]);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [journalSaveError, setJournalSaveError] = useState('');
  const [journalSaveSuccess, setJournalSaveSuccess] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Validate portfolio data and set errors
  const validatePortfolioData = (data: any) => {
    const errors: Record<string, string> = {};

    // 1. Account Balance
    if (!data?.totalBalance || data.totalBalance === "$0.00") {
      errors.accountBalance = "Saldo tidak tersedia";
    }

    // 2. Return on Winners/Losers
    if (!data?.avgWinLoss || data.avgWinLoss === "$0 / $0") {
      errors.returnOnWinners = "Belum ada data trading untuk dihitung";
    }

    // 3. Return on Long/Short (currently not available from API)
    errors.returnOnLongShort = "Belum ada data trading untuk dihitung";

    // 4. Biggest Profit/Loss
    if (!data?.performance || data.performance.length === 0) {
      errors.biggestProfit = "Belum ada riwayat trading";
    } else {
      // Check if all values are 0
      const maxProfit = data.performance.reduce((max: number, d: any) => d.realizedValue > max ? d.realizedValue : max, 0);
      const maxLoss = data.performance.reduce((min: number, d: any) => d.realizedValue < min ? d.realizedValue : min, 0);
      
      if (maxProfit === 0 && maxLoss === 0) {
        errors.biggestProfit = "Belum ada riwayat trading";
      }
    }

    // 5. Highcap PNL
    if (!data?.netPnl || data.netPnl === "$0.00") {
      errors.highcapPnl = "Belum ada riwayat trading";
    }

    // 6. Midcap/Lowcap PNL (currently not available from API)
    errors.midcapPnl = "Belum ada data trading untuk dihitung";
    errors.lowcapPnl = "Belum ada data trading untuk dihitung";

    // 7. Profit by Day Chart
    if (!data?.performance || data.performance.length < 7) {
      errors.profitByDay = "Belum ada data trading untuk dihitung";
    }

    // 8. Best Primary Setup
    if (!data?.netPnl || data.netPnl === "$0.00") {
      errors.bestSetup = "Belum ada riwayat trading";
    }

    // 9. Best Indicator
    if (!data?.tradeWinRate || data.tradeWinRate === "0%") {
      errors.bestIndicator = "Belum ada data trading untuk dihitung";
    }

    // 10. Hold Time vs PnL
    if (!data?.performance || data.performance.length === 0) {
      errors.holdTime = "Belum ada riwayat trading";
    }

    // 11. Performance Calendar - Check for current viewing month
    if (!data?.performance || data.performance.length === 0) {
      errors.calendar = "API terhubung tapi belum ada riwayat trading bulan ini";
    }

    setDataErrors(errors);
  };

  // Validate on data change
  React.useEffect(() => {
    if (portfolioData) {
      validatePortfolioData(portfolioData);
    } else {
      setDataErrors({});
    }
  }, [portfolioData]);

  const handleResync = async (showToast: boolean = true) => {
    if (!selectedAccount) {
      setSyncError('No CEX account selected. Please select an account from the dropdown.');
      return;
    }

    setIsSyncing(true);
    setSyncError('');

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setSyncError('Authentication required. Please login again.');
        return;
      }

      const isAllAccounts = selectedAccount.id === ALL_ACCOUNTS_ID;
      const url = isAllAccounts 
        ? 'http://localhost:8000/api/cex-accounts/sync-all'
        : `http://localhost:8000/api/cex-accounts/${selectedAccount.id}/sync`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to sync account');
      }

      const data = await response.json();
      if (data.success) {
        setPortfolioData(data.data);
        setLastSyncedAccountId(selectedAccount.id);
        setSyncError('');
      } else {
        throw new Error(data.message || 'Sync failed');
      }
    } catch (e: any) {
      setSyncError(e.message || 'Failed to sync. Please check your API credentials.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync logic (shared with DashboardPage)
  React.useEffect(() => {
    if (selectedAccount && !isSyncing) {
      // Skip sync if we already have data for THIS exact account
      if (portfolioData && lastSyncedAccountId === selectedAccount.id) {
        console.log('✅ ReportsPage: Using cached data for account:', selectedAccount.cex_display_name);
        validatePortfolioData(portfolioData);
        isFirstMount.current = false;
        return;
      }

      // First mount: Sync only if no data OR data is for different account
      if (isFirstMount.current) {
        isFirstMount.current = false;
        
        if (portfolioData && lastSyncedAccountId === selectedAccount.id) {
          console.log('✅ ReportsPage: Found valid data on first mount, skipping sync');
          return;
        }

        console.log('🔄 ReportsPage: Initial auto-sync for account:', selectedAccount.cex_display_name);
        handleResync(false);
        return;
      }
      
      // Subsequent changes (manual account switch): Sync if account actually changed
      if (selectedAccount.id !== lastSyncedAccountId) {
        console.log('🔄 ReportsPage: Account changed, syncing:', selectedAccount.cex_display_name);
        handleResync(true);
      }
    }
  }, [selectedAccount?.id, lastSyncedAccountId]);

  const handleSaveJournal = async () => {
    if (!selectedDate || !formData.token) {
      setJournalSaveError('Unable to save. Please login again.');
      return;
    }

    if (!selectedAccount) {
      setJournalSaveError('No CEX account selected. Please select an account.');
      return;
    }

    setIsSavingJournal(true);
    setJournalSaveError('');
    setJournalSaveSuccess(false);

    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const tradeDate = `${year}-${month}-${day}`;

      await apiService.saveJournal({
        cex_account_id: selectedAccount.id,
        trade_date: tradeDate,
        remarks: journalRemarks,
        screenshots: journalScreenshots,
      }, formData.token);

      setJournalSaveSuccess(true);
      setIsEditingDate(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setJournalSaveSuccess(false), 3000);
    } catch (e: any) {
      setJournalSaveError(e.message || 'Failed to save journal entry.');
    } finally {
      setIsSavingJournal(false);
    }
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert files to base64
    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        setJournalSaveError('Screenshot size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setJournalScreenshots(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveScreenshot = (index: number) => {
    setJournalScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  // Load journal when date is selected
  React.useEffect(() => {
    if (selectedDate && formData.token && selectedAccount) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate).padStart(2, '0');
      const tradeDate = `${year}-${month}-${day}`;

      apiService.getJournal(tradeDate, formData.token, selectedAccount.id)
        .then(response => {
          if (response.success && response.data) {
            setJournalRemarks(response.data.remarks || '');
            setJournalScreenshots(response.data.screenshots || []);
          } else {
            setJournalRemarks('');
            setJournalScreenshots([]);
          }
        })
        .catch(() => {
          setJournalRemarks('');
          setJournalScreenshots([]);
        });
    }
  }, [selectedDate, currentDate, formData.token, selectedAccount]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startOffset = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const balance = portfolioData?.totalBalance || "$0.00";
  const pnl = portfolioData?.netPnl || "$0.00";
  const pnlPercent = portfolioData?.netPnlPercent || "0%";
  const pnlPositive = parseFloat(pnl.replace(/[^0-9.-]+/g, "")) >= 0;

  const pnlNum = parseFloat(pnl.replace(/[^0-9.-]+/g, "")) || 0;
  const getBubbleVal = (factor: number) => {
    const val = pnlNum * factor;
    return val >= 0 ? `+$${Math.abs(val / 1000).toFixed(1)}k` : `-$${Math.abs(val / 1000).toFixed(1)}k`;
  };
  const getBubbleSize = (factor: number) => `${Math.max(30, Math.min(120, Math.abs(factor * 150)))}px`;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <SidebarWithActive plan={formData.plan} activeItem="Reports" />

      <main className="flex-1 bg-[#050505] min-h-screen flex flex-col relative">
        <TopBar name={formData.name}>
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">Reports</h1>
            <div className="bg-neutral-900 p-1 rounded-xl flex gap-1">
              {['Overview', 'Calendar', 'History'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-neutral-500 hover:text-neutral-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Re-sync Button */}
            <button
              onClick={handleResync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-full hover:bg-neutral-800 hover:border-red-600 transition-all disabled:opacity-50 group ml-auto"
              title="Re-sync portfolio data"
            >
              <RefreshCw 
                size={14} 
                className={`${isSyncing ? 'animate-spin text-red-600' : 'text-neutral-400 group-hover:text-red-600'} transition-colors`} 
              />
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                {isSyncing ? 'Syncing...' : 'Re-sync'}
              </span>
            </button>
          </div>
        </TopBar>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* Sync Error Alert */}
          {syncError && (
            <div className="p-8 pb-0 max-w-[1600px] mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/20 border border-red-900/50 rounded-2xl p-4 flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-500">{syncError}</p>
                  <p className="text-xs text-neutral-400 mt-1">Try re-syncing or check your API settings.</p>
                </div>
                <button 
                  onClick={() => setSyncError('')}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  ×
                </button>
              </motion.div>
            </div>
          )}

          {/* Empty State Warning */}
          {!portfolioData && !isSyncing && (
            <div className="p-8 pb-0 max-w-[1600px] mx-auto">
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-900/20 border border-yellow-900/50 rounded-2xl p-4 flex items-center gap-3"
              >
                <AlertCircle size={20} className="text-yellow-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-yellow-500">No portfolio data found</p>
                  <p className="text-xs text-neutral-400 mt-1">Click "Re-sync" to fetch your latest portfolio data from {selectedAccount?.cex_display_name || 'your exchange'}.</p>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'Overview' && (
            <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">
              {/* Performance Summary Header */}
              <header>
                <h2 className="text-3xl font-black tracking-tight">Performance Summary</h2>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Account Balance Card with Error Badge */}
                <div className="lg:col-span-5">
                  <ErrorBadge message={dataErrors.accountBalance} />
                  <div className="bg-neutral-900/30 border border-neutral-800 rounded-[32px] p-10 relative overflow-hidden flex flex-col justify-between h-[340px]">
                    <div className="relative z-10">
                      <p className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-2">Account Balance</p>
                      <h2 className="text-6xl font-black text-white tracking-tighter mb-2">{balance}</h2>
                      <div className="flex items-center gap-2 text-green-500 text-xs font-black">
                        <TrendingUp size={14} /> {pnlPercent} this month
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-2 h-24">
                      {portfolioData?.performance?.slice(-10).map((day, i) => {
                        const maxVal = Math.max(...portfolioData.performance.map(d => Math.abs(d.realizedValue)));
                        const h = maxVal === 0 ? 10 : Math.max(10, (Math.abs(day.realizedValue) / maxVal) * 100);
                        return (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className={`flex-1 rounded-t-lg ${day.positive ? 'bg-red-600' : 'bg-neutral-800'}`} 
                          />
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Return on Winners/Losers with Error Badge */}
                  <div>
                    <ErrorBadge message={dataErrors.returnOnWinners} />
                    <MiniStatCard label="Return on Winners" value={portfolioData?.avgWinLoss?.split(' / ')[0] || "$0"} positive />
                  </div>
                  <div>
                    <ErrorBadge message={dataErrors.returnOnWinners} />
                    <MiniStatCard label="Return on Losers" value={portfolioData?.avgWinLoss?.split(' / ')[1] || "$0"} />
                  </div>
                  
                  {/* Return on Long/Short with Error Badge */}
                  <div>
                    <ErrorBadge message={dataErrors.returnOnLongShort} />
                    <MiniStatCard label="Return on Long" value="+0.00" positive={false} />
                  </div>
                  <div>
                    <ErrorBadge message={dataErrors.returnOnLongShort} />
                    <MiniStatCard label="Return on Short" value="+0.00" positive={false} />
                  </div>
                  
                  {/* Biggest Profit/Loss with Error Badge */}
                  <div>
                    <ErrorBadge message={dataErrors.biggestProfit} />
                    <MiniStatCard label="Biggest Profit" value={portfolioData?.performance?.reduce((max, d) => d.realizedValue > max ? d.realizedValue : max, 0).toFixed(2) || "0.00"} subValue="Auto Sync" positive />
                  </div>
                  <div>
                    <ErrorBadge message={dataErrors.biggestProfit} />
                    <MiniStatCard label="Biggest Loss" value={portfolioData?.performance?.reduce((min, d) => d.realizedValue < min ? d.realizedValue : min, 0).toFixed(2) || "0.00"} subValue="Auto Sync" />
                  </div>
                  
                  {/* Cap PNL with Error Badge */}
                  <div>
                    <ErrorBadge message={dataErrors.highcapPnl} />
                    <MiniStatCard label="Highcap PNL" value={pnl} positive={pnlPositive} />
                  </div>
                  <div>
                    <ErrorBadge message={dataErrors.midcapPnl} />
                    <MiniStatCard label="Midcap PNL" value="$0.00" />
                  </div>
                  <div>
                    <ErrorBadge message={dataErrors.lowcapPnl} />
                    <MiniStatCard label="Lowcap PNL" value="$0.00" />
                  </div>
                </div>
              </div>

              {/* Middle Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profit by Day with Error Badge */}
                <div>
                  <ErrorBadge message={dataErrors.profitByDay} />
                  <ReportCard title="Profit by Day" icon={<Calendar size={16} className="text-red-600" />}>
                    <div className="flex items-end justify-between gap-2 h-48 mt-8">
                      {portfolioData?.performance && portfolioData.performance.length >= 7 ? (
                        portfolioData.performance.slice(-7).map((day, i) => {
                          const maxVal = Math.max(...portfolioData.performance.map(d => Math.abs(d.realizedValue)));
                          const h = maxVal === 0 ? 10 : Math.max(10, (Math.abs(day.realizedValue) / maxVal) * 100);
                          return (
                            <DayBar key={i} height={`${h}%`} day={day.dayName.toUpperCase()} positive={day.positive} />
                          );
                        })
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-neutral-600 text-xs">
                          No data available
                        </div>
                      )}
                    </div>
                  </ReportCard>
                </div>

                {/* Best Primary Setup with Error Badge */}
                <div>
                  <ErrorBadge message={dataErrors.bestSetup} />
                  <ReportCard title="Best Primary Setup" icon={<Activity size={16} className="text-red-600" />}>
                     <div className="space-y-5 mt-8">
                        <SetupRow label={`${selectedAccount?.cex_display_name || 'Exchange'} Auto Sync`} value={pnl} percent={pnlPercent} />
                        <SetupRow label="Manual Entry" value="$0.00" percent="0%" />
                     </div>
                  </ReportCard>
                </div>

                {/* Best Indicator with Error Badge */}
                <div>
                  <ErrorBadge message={dataErrors.bestIndicator} />
                  <ReportCard title="Best Indicator" icon={<TrendingUp size={16} className="text-red-600" />}>
                     <div className="space-y-4 mt-8">
                        <IndicatorRow code="API" label={`${selectedAccount?.cex_display_name || 'Exchange'} API`} winRate={portfolioData?.tradeWinRate || "0%"} percent={portfolioData?.tradeWinRate || "0%"} />
                        <IndicatorRow code="MAN" label="Manual Journal" winRate="0%" percent="0%" />
                     </div>
                  </ReportCard>
                </div>
              </div>

              {/* Bottom Chart: Hold Time vs PnL */}
              <div>
                <ErrorBadge message={dataErrors.holdTime} />
                <div className="bg-neutral-900/30 border border-neutral-800 rounded-[32px] p-10 relative">
                   <div className="flex justify-between items-center mb-12">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold">Average Hold Time vs PnL</h3>
                        <p className="text-neutral-500 text-xs">Correlation between trade duration and profitability</p>
                      </div>
                      <div className="flex gap-4 items-center">
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full" /> Profitable
                         </div>
                         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                            <div className="w-2 h-2 bg-red-600 rounded-full" /> Unprofitable
                         </div>
                      </div>
                   </div>

                   <div className="relative h-64 flex items-center justify-between px-12">
                      <div className="absolute left-10 right-10 h-px bg-neutral-800 bottom-12" />
                      
                      {portfolioData ? (
                        <>
                          <HoldBubble 
                            label="+0.0k" 
                            subLabel="-0.0k" 
                            duration="0-2H" 
                            posHeight="40px" 
                            negHeight="30px" 
                          />
                          <HoldBubble 
                            label="+0.0k" 
                            duration="2-6H" 
                            posHeight="50px" 
                          />
                          <HoldBubble 
                            label="+0.0k" 
                            duration="6-12H" 
                            posHeight="45px" 
                          />
                          <HoldBubble 
                            subLabel="-0.0k" 
                            duration="12-24H" 
                            negHeight="35px" 
                          />
                          <HoldBubble 
                            label="+0.0k" 
                            duration="24H+" 
                            posHeight="60px" 
                          />
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-neutral-600 text-xs">
                          No hold time data available
                        </div>
                      )}
                   </div>

                   <div className="mt-8 p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800 text-xs text-neutral-400 italic">
                      <span className="text-white font-bold not-italic mr-2">Insight:</span>
                      {portfolioData && pnlPositive ? (
                        <>Your portfolio is showing positive performance. Continue monitoring your trades for optimal results.</>
                      ) : portfolioData ? (
                        <>Review your recent trades to identify areas for improvement in your trading strategy.</>
                      ) : (
                        <>No data available. Sync your exchange to see insights.</>
                      )}
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Calendar' && (
            <div className="p-8 max-w-[1600px] mx-auto h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center mb-6 shrink-0">
                  <div>
                    <h2 className="text-3xl font-black">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                    <p className="text-neutral-400 text-sm mt-1">Monthly PnL: <span className="text-green-500 font-bold">{portfolioData?.netPnl || '+$0'}</span> • Winrate: <span className="font-bold text-white">{portfolioData?.tradeWinRate || '0%'}</span></p>
                  </div>
                  <div className="flex gap-2">
                     <button 
                       onClick={handlePrevMonth}
                       className="w-10 h-10 bg-[#111] border border-neutral-800 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors"
                     >
                       <ChevronLeft size={16} />
                     </button>
                     <button 
                       onClick={() => setCurrentDate(new Date())}
                       className="px-6 h-10 bg-[#111] border border-neutral-800 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-colors"
                     >
                       Today
                     </button>
                     <button 
                       onClick={handleNextMonth}
                       className="w-10 h-10 bg-[#111] border border-neutral-800 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors"
                     >
                       <ChevronRight size={16} />
                     </button>
                  </div>
               </div>
               
               {/* Error Badge for Calendar - ALWAYS SHOW FOR TESTING */}
               <div className="mb-4">
                 <ErrorBadge message="API terhubung tapi belum ada riwayat trading bulan ini" />
               </div>
               
               {/* Calendar Grid */}
               <div className="flex-1 bg-[#0A0A0A] rounded-2xl border border-neutral-800 flex flex-col overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-neutral-800 bg-[#111]">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                      <div key={day} className="py-4 text-center text-[10px] font-black uppercase text-neutral-500 tracking-widest border-r border-neutral-800 last:border-0">{day}</div>
                    ))}
                  </div>
                  <div className="flex-1 grid grid-cols-7 grid-rows-5">
                    {/* Dynamic Grid Rendering */}
                    {Array.from({ length: startOffset }).map((_, idx) => {
                        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
                        const date = prevMonthLastDay - startOffset + idx + 1;
                        return <CalendarCell key={`empty-${idx}`} date={date.toString()} disabled />;
                    })}

                    {Array.from({ length: daysInMonth }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                        const dayData = isCurrentMonth ? portfolioData?.performance?.find(d => parseInt(d.date) === dayNum) : null;
                        
                        // Pure API data only
                        if (dayData) {
                          return (
                            <CalendarCell 
                                key={dayNum} 
                                date={dayNum.toString()} 
                                pnl={dayData.neutral ? null : dayData.realized} 
                                trades={dayData.tradesCount > 0 ? `${dayData.tradesCount} TRADES` : null} 
                                positive={dayData.positive} 
                                active={selectedDate === dayNum.toString()}
                                onClick={() => setSelectedDate(dayNum.toString())} 
                            />
                          );
                        }

                        // Empty day
                        return (
                          <CalendarCell 
                              key={dayNum} 
                              date={dayNum.toString()} 
                              pnl={null} 
                              trades={null} 
                              positive={false} 
                              active={selectedDate === dayNum.toString()}
                              onClick={() => setSelectedDate(dayNum.toString())} 
                          />
                        );
                    })}

                    {/* Fill remaining cells to make 7x5 or 7x6 grid */}
                    {Array.from({ length: (startOffset + daysInMonth > 35 ? 42 : 35) - (startOffset + daysInMonth) }).map((_, idx) => (
                        <CalendarCell key={`next-${idx}`} date={(idx + 1).toString()} disabled />
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'History' && (
             <div className="p-8 max-w-[1600px] mx-auto flex items-center justify-center h-full text-neutral-500">
                History view not implemented yet.
             </div>
          )}
        </div>

        {/* Modal for Calendar Detail & Edit */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
              onClick={() => { setSelectedDate(null); setIsEditingDate(false); }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`bg-[#111111] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${isEditingDate ? 'w-full max-w-5xl flex' : 'w-full max-w-2xl'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Detail View (Left side when editing) */}
                <div className={`p-8 relative ${isEditingDate ? 'w-1/2 border-r border-neutral-800 bg-[#0A0A0A]' : 'w-full'}`}>
                   {!isEditingDate && (
                     <button 
                       onClick={() => { setSelectedDate(null); setIsEditingDate(false); }}
                       className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
                     >
                       <X size={20} />
                     </button>
                   )}
                   
                   <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                           Day {selectedDate} 
                           {isEditingDate && <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">EDITING</span>}
                        </h2>
                        <p className="text-sm font-bold text-green-500 mt-1">Detail View for selected day</p>
                      </div>
                      {!isEditingDate && (
                         <button 
                           onClick={() => setIsEditingDate(true)}
                           className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold transition-colors"
                         >
                           <Edit2 size={14} /> Edit
                         </button>
                      )}
                   </div>

                   <div className="grid grid-cols-3 gap-3 mb-8">
                      <ModalStatCard label="Trades" value="-" />
                      <ModalStatCard label="Winrate" value="-" valueColor="text-green-500" />
                      <ModalStatCard label="Gross PNL" value="-" />
                   </div>

                   <div className="bg-[#1A1A1A] rounded-xl border border-neutral-800 overflow-hidden">
                      <p className="p-8 text-center text-neutral-500 text-xs italic">Trade details will appear here once history sync is complete.</p>
                   </div>
                </div>

                {/* Edit View (Right side when editing) */}
                {isEditingDate && (
                  <div className="w-1/2 p-8 relative flex flex-col">
                     <button 
                       onClick={() => { setSelectedDate(null); setIsEditingDate(false); }}
                       className="absolute top-8 right-8 text-neutral-500 hover:text-white transition-colors"
                     >
                       <X size={20} />
                     </button>
                     
                     <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
                        <Activity size={16} className="text-red-500" /> Detailed Journaling: Day {selectedDate}
                     </h3>

                     <div className="space-y-6 flex-1">
                        <div>
                           <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-3">Trade Setup Screenshots</p>
                           <div className="flex gap-3 flex-wrap">
                              {/* Display uploaded screenshots */}
                              {journalScreenshots.map((screenshot, index) => (
                                <div key={index} className="relative w-24 h-16 group">
                                  <img 
                                    src={screenshot} 
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg border border-neutral-700"
                                  />
                                  <button
                                    onClick={() => handleRemoveScreenshot(index)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                              
                              {/* Upload button */}
                              <label className="w-24 h-16 border border-neutral-700 border-dashed rounded-lg flex flex-col items-center justify-center text-neutral-500 hover:text-white hover:border-neutral-500 hover:bg-neutral-800/30 transition-all cursor-pointer">
                                 <Camera size={14} className="mb-1" />
                                 <span className="text-[8px] font-bold uppercase tracking-widest">Add Screenshot</span>
                                 <input 
                                   type="file" 
                                   accept="image/*" 
                                   multiple 
                                   onChange={handleScreenshotUpload}
                                   className="hidden"
                                 />
                              </label>
                           </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                           <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-3">Daily Remarks & Psychology</p>
                           <div className="bg-[#1A1A1A] border border-neutral-800 rounded-xl flex-1 flex flex-col">
                              <div className="flex items-center gap-1 p-2 border-b border-neutral-800">
                                 <button className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"><Bold size={14} /></button>
                                 <button className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"><Italic size={14} /></button>
                                 <button className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"><Underline size={14} /></button>
                              </div>
                              <textarea 
                                value={journalRemarks}
                                onChange={(e) => setJournalRemarks(e.target.value)}
                                className="w-full flex-1 bg-transparent border-none outline-none p-4 text-xs text-neutral-300 resize-none"
                                placeholder="Describe your mental state, market conditions, and mistakes..."
                              ></textarea>
                           </div>
                        </div>
                     </div>

                     {/* Save Error/Success Messages */}
                     {journalSaveError && (
                       <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded-xl text-xs text-red-500">
                         {journalSaveError}
                       </div>
                     )}
                     {journalSaveSuccess && (
                       <div className="mt-4 p-3 bg-green-900/20 border border-green-900/50 rounded-xl text-xs text-green-500">
                         Journal saved successfully!
                       </div>
                     )}

                     <div className="flex justify-end gap-3 mt-6">
                        <button 
                          onClick={() => {
                            setIsEditingDate(false);
                            setJournalSaveError('');
                            setJournalSaveSuccess(false);
                          }} 
                          className="px-6 py-2.5 rounded-xl font-bold text-xs text-neutral-300 hover:bg-neutral-800 transition-colors"
                          disabled={isSavingJournal}
                        >
                          Discard
                        </button>
                        <button 
                          onClick={handleSaveJournal} 
                          className="px-6 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
                          disabled={isSavingJournal}
                        >
                          {isSavingJournal ? 'Saving...' : 'Save Changes'}
                        </button>
                     </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

// --- Sub Components ---

const ErrorBadge = ({ message }: { message?: string }) => {
  if (!message) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 bg-red-900/20 border border-red-900/50 rounded-lg px-2.5 py-2 mb-2"
    >
      <AlertCircle size={12} className="text-red-500 flex-shrink-0" />
      <span className="text-[9px] font-bold text-red-500">{message}</span>
    </motion.div>
  );
};

const SidebarWithActive = ({ plan, activeItem }: { plan: string, activeItem: string }) => {
  return <Sidebar plan={plan} />;
};

const MiniStatCard = ({ label, value, subValue, positive = false }: any) => (
  <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all">
    <p className="text-[10px] uppercase font-black text-neutral-500 tracking-widest mb-3">{label}</p>
    <h3 className={`text-xl font-black ${positive ? 'text-green-500' : 'text-red-600'}`}>{value}</h3>
    {subValue && <p className="text-[10px] text-neutral-500 font-bold mt-1 uppercase">{subValue}</p>}
  </div>
);

const ReportCard = ({ title, icon, children }: any) => (
  <div className="bg-neutral-900/30 border border-neutral-800 rounded-[32px] p-8">
     <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-black text-white uppercase tracking-tighter">{title}</h3>
     </div>
     {children}
  </div>
);

const DayBar = ({ height, day, positive = false }: any) => (
  <div className="flex-1 flex flex-col items-center gap-4 group h-full">
     <div className="w-full flex-1 flex flex-col justify-end">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height }}
          className={`w-full rounded-xl ${positive ? 'bg-green-500/80' : 'bg-red-600/50'} ${day === 'SUN' || day === 'SAT' ? 'opacity-20' : ''}`} 
        />
     </div>
     <span className="text-[10px] font-black text-neutral-600 uppercase">{day}</span>
  </div>
);

const SetupRow = ({ label, value, percent }: any) => (
  <div className="space-y-2">
     <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
        <span className="text-neutral-300">{label}</span>
        <span className="text-white">{value}</span>
     </div>
     <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: percent }}
          className={`h-full ${label === 'Reversal' ? 'bg-neutral-600' : 'bg-red-600'}`} 
        />
     </div>
  </div>
);

const IndicatorRow = ({ code, label, winRate, percent }: any) => (
  <div className="flex items-center gap-4">
     <div className="w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center text-[10px] font-black text-neutral-400 border border-neutral-700">{code}</div>
     <div className="flex-1 space-y-1.5">
        <div className="flex justify-between text-[11px] font-black uppercase">
           <span className="text-white">{label}</span>
           <span className="text-neutral-500">{winRate} Win</span>
        </div>
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: percent }}
             className="h-full bg-red-600" 
           />
        </div>
     </div>
  </div>
);

const HoldBubble = ({ label, subLabel, duration, posHeight, negHeight }: any) => (
  <div className="flex flex-col items-center gap-4 relative h-full">
     <div className="absolute top-0 flex flex-col items-center h-full justify-center">
        {label && (
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             style={{ width: posHeight, height: posHeight }}
             className="bg-green-500/10 border border-green-500 rounded-full flex items-center justify-center text-[11px] font-black text-green-500 mb-2 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
           >
              {label}
           </motion.div>
        )}
        {subLabel && (
           <motion.div 
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             style={{ width: negHeight, height: negHeight }}
             className="bg-red-600/10 border border-red-600 rounded-full flex items-center justify-center text-[11px] font-black text-red-600 shadow-[0_0_20px_rgba(220,38,38,0.1)]"
           >
              {subLabel}
           </motion.div>
        )}
     </div>
     <span className="text-[10px] font-black text-neutral-600 uppercase mt-auto z-10">{duration}</span>
  </div>
);

const CalendarCell = ({ date, pnl, trades, positive, disabled, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-4 border-r border-b border-neutral-800 relative transition-all flex flex-col ${disabled ? 'opacity-20 pointer-events-none' : 'hover:bg-neutral-800/50 cursor-pointer'} ${active ? 'bg-red-900/10 ring-1 ring-red-600 ring-inset' : ''}`}
  >
     <span className={`text-xs font-bold ${active ? 'text-white' : 'text-neutral-500'}`}>{date}</span>
     {pnl && (
       <div className="mt-auto space-y-1">
         <p className={`text-sm font-black tracking-tight ${positive ? 'text-green-500' : 'text-red-500'}`}>{pnl}</p>
         <p className="text-[8px] font-black uppercase text-neutral-400 tracking-widest">{trades}</p>
       </div>
     )}
  </div>
);

const ModalStatCard = ({ label, value, valueColor = 'text-white' }: any) => (
  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-neutral-800">
     <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">{label}</p>
     <p className={`text-lg font-bold font-mono ${valueColor}`}>{value}</p>
  </div>
);

export default ReportsPage;
