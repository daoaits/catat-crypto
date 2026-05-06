import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ChevronRight, Filter, X,
  MessageSquare, Camera, Check, ChevronLeft, MoreHorizontal, RefreshCw, AlertCircle, Edit
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import EditTradeModal from '../components/EditTradeModal';
import { usePortfolio } from '../context/PortfolioContext';
import { useCexAccount } from '../context/CexAccountContext';
import { apiService } from '../services/apiService';

interface TradesPageProps {
  formData: any;
}

const TradesPage: React.FC<TradesPageProps> = ({ formData }) => {
  const { portfolioData, setPortfolioData } = usePortfolio();
  const { selectedAccount } = useCexAccount();
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [editingTrade, setEditingTrade] = useState<any | null>(null);
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [filterDate, setFilterDate] = useState('All Time');
  const [filterSide, setFilterSide] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [dataErrors, setDataErrors] = useState<Record<string, string>>({});
  const [isSavingToDb, setIsSavingToDb] = useState(false);

  // Validate portfolio data and set errors
  const validatePortfolioData = (data: any) => {
    const errors: Record<string, string> = {};

    // 1. Net PNL
    if (!data?.netPnl || data.netPnl === "$0.00") {
      errors.netPnl = "Belum ada riwayat trading";
    }

    // 2. Win Rate
    if (!data?.tradeWinRate || data.tradeWinRate === "0%") {
      errors.winRate = "Belum ada data trading untuk dihitung";
    }

    // 3. Total Trades
    if (!data?.activeDeployments || data.activeDeployments.length === 0) {
      errors.totalTrades = "Tidak ada posisi terbuka";
    }

    // 4. Profit Factor
    if (!data?.rrRatio || data.rrRatio === "RR: 0.00") {
      errors.profitFactor = "Belum ada data trading untuk dihitung";
    }

    // 5. Trades Table
    if (!data?.activeDeployments || data.activeDeployments.length === 0) {
      errors.tradesTable = "API terhubung tapi belum ada posisi terbuka";
    }

    setDataErrors(errors);
  };

  // Fetch trades from API
  const fetchTrades = async () => {
    setIsLoadingTrades(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const params = new URLSearchParams();
      if (selectedAccount) {
        params.append('cex_account_id', selectedAccount.id.toString());
      }

      const response = await fetch(`http://localhost:8000/api/trades?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTrades(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error);
    } finally {
      setIsLoadingTrades(false);
    }
  };

  // Save trade manual fields
  const handleSaveTrade = async (tradeId: number, data: any) => {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Not authenticated');

    // Check if this is an API-sourced trade (not in database yet)
    const trade = combinedTrades.find((t: any) => t.id === tradeId);
    if (trade?._source === 'api') {
      alert('This trade is from API and not yet saved to database. Please sync your account first to save trades to database.');
      return;
    }

    const response = await fetch(`http://localhost:8000/api/trades/${tradeId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save trade');
    }

    // Refresh trades list
    await fetchTrades();
  };

  // Fetch trades when component mounts or selected account changes
  useEffect(() => {
    fetchTrades();
  }, [selectedAccount]);

  // Validate on data change
  React.useEffect(() => {
    if (portfolioData) {
      validatePortfolioData(portfolioData);
    } else {
      setDataErrors({});
    }
  }, [portfolioData]);

  // Save API trades to database
  const handleSaveToDatabase = async () => {
    if (!selectedAccount) {
      alert('No CEX account selected');
      return;
    }

    setIsSavingToDb(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Not authenticated. Please login again.');
        return;
      }

      const apiTrades = portfolioData?.activeDeployments || [];
      
      if (apiTrades.length === 0) {
        alert('No trades to save');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/cex-accounts/${selectedAccount.id}/sync-trades`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trades: apiTrades
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save trades');
      }

      const data = await response.json();
      if (data.success) {
        alert(`Successfully synced ${data.data.total} trades (${data.data.saved} new, ${data.data.updated} updated)!`);
        // Refresh trades list
        await fetchTrades();
      } else {
        throw new Error(data.message || 'Failed to save trades');
      }
      
    } catch (error: any) {
      console.error('Failed to save trades:', error);
      alert('Failed to save trades to database. Please try again.');
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleResync = async () => {
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

      // Step 1: Sync account from exchange API
      const response = await fetch(`http://localhost:8000/api/cex-accounts/${selectedAccount.id}/sync`, {
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
        setSyncError('');
        
        // Step 2: Auto-save trades to database
        if (data.data.activeDeployments && data.data.activeDeployments.length > 0) {
          try {
            const syncTradesResponse = await fetch(`http://localhost:8000/api/cex-accounts/${selectedAccount.id}/sync-trades`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                trades: data.data.activeDeployments
              }),
            });

            if (syncTradesResponse.ok) {
              const syncData = await syncTradesResponse.json();
              console.log(`Trades synced: ${syncData.data.saved} new, ${syncData.data.updated} updated`);
            }
          } catch (syncError) {
            console.error('Failed to sync trades to database:', syncError);
            // Don't show error to user, just log it
          }
        }
        
        // Step 3: Fetch trades from database
        await fetchTrades();
      } else {
        throw new Error(data.message || 'Sync failed');
      }
    } catch (e: any) {
      setSyncError(e.message || 'Failed to sync. Please check your API credentials.');
    } finally {
      setIsSyncing(false);
    }
  };

  const balance = portfolioData?.totalBalance || "$0.00";
  const pnl = portfolioData?.netPnl || "$0.00";
  const pnlPercent = portfolioData?.netPnlPercent || "0%";
  const pnlPositive = portfolioData?.netPnlPositive ?? true;
  const winRate = portfolioData?.tradeWinRate || "0%";

  // Combine trades from database and activeDeployments
  // Priority: database trades (with manual fields) > activeDeployments (API data)
  const combinedTrades = React.useMemo(() => {
    const dbTrades = trades || [];
    const apiTrades = portfolioData?.activeDeployments || [];
    
    // Convert activeDeployments to trade format
    const apiTradesFormatted = apiTrades.map((deployment: any) => ({
      id: deployment.id,
      pairs: deployment.asset,
      direction: deployment.type.includes('LONG') ? 'LONG' : deployment.type.includes('SHORT') ? 'SHORT' : 'BUY',
      entry_price: deployment.entry !== 'N/A' ? parseFloat(deployment.entry.replace('$', '')) : 0,
      exit_price: null,
      position_size: deployment.size,
      pnl_amount: deployment.pnl.replace('+', '').replace('$', ''),
      pnl_percentage: deployment.percent !== '-' ? deployment.percent : null,
      status: deployment.positive ? 'WIN' : 'LOSS',
      trade_date: new Date().toISOString(),
      leverage: deployment.type.match(/\d+x/) ? parseFloat(deployment.type.match(/\d+x/)?.[0] || '1') : null,
      // No manual fields from API
      session: null,
      primary_setup_type: null,
      remarks: null,
      _source: 'api' // Mark as API source
    }));
    
    // If we have database trades, use them; otherwise use API trades
    return dbTrades.length > 0 ? dbTrades : apiTradesFormatted;
  }, [trades, portfolioData]);

  // Filter trades
  const filteredTrades = combinedTrades.filter((t: any) => {
    const matchSide = filterSide === 'All' || t.direction === filterSide.toUpperCase();
    const matchStatus = filterStatus === 'All' || t.status === filterStatus.toUpperCase();
    return matchSide && matchStatus;
  });

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar plan={formData.plan} />

      <main className="flex-1 bg-[#0A0A0A] min-h-screen relative overflow-hidden">
        <TopBar name={formData.name}>
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold">Trades</h1>
            <div className="relative w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search assets, trades, or setups..." 
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 pl-12 pr-4 text-xs focus:outline-none focus:border-neutral-600 transition-all text-white placeholder-neutral-600"
              />
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

        <div className="p-8 max-w-[1600px] mx-auto">
          {/* Sync Error Alert */}
          {syncError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-900/50 rounded-2xl p-4 flex items-center gap-3 mb-6"
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
          )}

          {/* Empty State Warning */}
          {!portfolioData && !isSyncing && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-900/20 border border-yellow-900/50 rounded-2xl p-4 flex items-center gap-3 mb-6"
            >
              <AlertCircle size={20} className="text-yellow-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-yellow-500">No portfolio data found</p>
                <p className="text-xs text-neutral-400 mt-1">Click "Re-sync" to fetch your latest trades from {selectedAccount?.cex_display_name || 'your exchange'}.</p>
              </div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
             <div>
               <ErrorBadge message={dataErrors.netPnl} />
               <StatCard 
                 title="NET PNL" value={pnl} percent={pnlPercent} positive={pnlPositive} 
                 chart={
                   <svg className="w-24 h-12" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d="M0 35 L20 25 L40 30 L60 10 L80 15 L100 5" fill="none" stroke={pnlPositive ? "#22c55e" : "#ef4444"} strokeWidth="2" />
                      <path d="M0 35 L20 25 L40 30 L60 10 L80 15 L100 5 L100 40 L0 40 Z" fill={`url(#${pnlPositive ? 'greenGrad' : 'redGrad'})`} opacity="0.2" />
                      <defs>
                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22c55e"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                        <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                      </defs>
                   </svg>
                 }
               />
             </div>
             <div>
               <ErrorBadge message={dataErrors.winRate} />
               <StatCard 
                 title="WIN RATE %" value={winRate}
                 chart={
                   <div className="relative w-12 h-12">
                     <svg className="w-full h-full" viewBox="0 0 36 36">
                       <circle cx="18" cy="18" r="16" fill="none" stroke="#262626" strokeWidth="3" />
                       <circle 
                         cx="18" cy="18" r="16" fill="none" stroke="#22c55e" strokeWidth="3" 
                         strokeDasharray={`${parseFloat(winRate) || 0}, 100`} 
                         strokeLinecap="round" 
                       />
                     </svg>
                   </div>
                 }
               />
             </div>
             <div>
               {/* Placeholder to maintain alignment when no error badge */}
               {!dataErrors.totalTrades && <div className="h-[34px] mb-2"></div>}
               <ErrorBadge message={dataErrors.totalTrades} />
               <StatCard title="TOTAL TRADES" value={filteredTrades.length.toString()} sub="Synced via API" />
             </div>
             <div>
               <ErrorBadge message={dataErrors.profitFactor} />
               <StatCard title="PROFIT FACTOR" value={portfolioData?.rrRatio?.split(': ')[1] || "0.00"} sub={`Health: ${parseFloat(portfolioData?.rrRatio?.split(': ')[1] || "0") > 1 ? 'Optimal' : 'Needs Improvement'}`} />
             </div>
          </div>

          {/* Filters Area */}
          <div className="flex items-center justify-between mb-6">
             <div className="flex gap-2">
                <FilterButton label="Date" value={filterDate} />
                <FilterButton label="Side" value={filterSide} />
                <FilterButton label="Status" value={filterStatus} />
             </div>
             <button className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">Reset All Filters</button>
          </div>

          {/* Trades Table */}
          {dataErrors.tradesTable && (
            <div className="mb-4">
              <ErrorBadge message={dataErrors.tradesTable} />
            </div>
          )}
          
          {/* Info: Trades from API */}
          {combinedTrades.length > 0 && combinedTrades[0]?._source === 'api' && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-900/20 border border-blue-900/50 rounded-2xl p-4 flex items-center gap-3 mb-4"
            >
              <AlertCircle size={20} className="text-blue-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-blue-500">Showing live data from API</p>
                <p className="text-xs text-neutral-400 mt-1">
                  These trades are not yet saved to database. Click "Save to Database" to enable editing and manual fields.
                </p>
              </div>
              <button
                onClick={handleSaveToDatabase}
                disabled={isSavingToDb}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSavingToDb ? 'Saving...' : 'Save to Database'}
              </button>
            </motion.div>
          )}
          
          <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#0A0A0A] text-[10px] uppercase font-black text-neutral-500 tracking-widest border-b border-neutral-800">
                   <tr>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date / Time</th>
                      <th className="px-6 py-4">Asset</th>
                      <th className="px-6 py-4 text-right">Entry / Exit</th>
                      <th className="px-6 py-4 text-right">Size</th>
                      <th className="px-6 py-4 text-right">Return</th>
                      <th className="px-6 py-4">Side</th>
                      <th className="px-6 py-4">Setup</th>
                      <th className="px-6 py-4"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                   {filteredTrades.length > 0 ? (
                     filteredTrades.map((trade: any) => (
                      <tr 
                        key={trade.id} 
                        className="hover:bg-neutral-800/30 transition-all group"
                      >
                         <td className="px-6 py-4">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${trade.status === 'WIN' ? 'bg-green-500/10 text-green-500' : trade.status === 'LOSS' ? 'bg-red-500/10 text-red-500' : 'bg-neutral-800 text-neutral-400'}`}>
                               {trade.status}
                            </span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="text-xs font-bold text-white">
                              {new Date(trade.trade_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div className="text-[10px] text-neutral-500 mt-0.5">
                              {new Date(trade.trade_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-xs font-black text-white">{trade.pairs}</td>
                         <td className="px-6 py-4 text-right">
                            <div className="text-xs font-bold text-neutral-300 font-mono">${trade.entry_price}</div>
                            <div className="text-[10px] text-neutral-500 mt-0.5 font-mono">
                              {trade.exit_price ? `$${trade.exit_price}` : '--'}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right text-xs font-bold text-neutral-400 font-mono">
                           {trade.position_size || 'N/A'}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className={`text-xs font-black font-mono ${trade.status === 'WIN' ? 'text-green-500' : 'text-red-500'}`}>
                              ${trade.pnl_amount}
                            </div>
                            <div className={`text-[9px] font-black font-mono mt-0.5 ${trade.status === 'WIN' ? 'text-green-600/60' : 'text-red-600/60'}`}>
                              {trade.pnl_percentage ? `${trade.pnl_percentage}%` : '-'}
                            </div>
                         </td>
                         <td className="px-6 py-4">
                            <span className={`text-[9px] font-black tracking-widest uppercase ${trade.direction === 'LONG' ? 'text-blue-500' : 'text-amber-500'}`}>
                              {trade.direction}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-[10px] font-bold text-neutral-500 uppercase">
                           {trade.primary_setup_type || 'Auto Sync'}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                               {trade.remarks && <MessageSquare size={14} className="text-neutral-600" />}
                               {trade._source === 'api' ? (
                                 <button
                                   disabled
                                   className="p-1.5 rounded-lg opacity-30 cursor-not-allowed"
                                   title="Trade from API - Sync account to save to database first"
                                 >
                                   <Edit size={14} className="text-neutral-600" />
                                 </button>
                               ) : (
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setEditingTrade(trade);
                                   }}
                                   className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                   title="Edit trade details"
                                 >
                                   <Edit size={14} className="text-neutral-400 hover:text-white" />
                                 </button>
                               )}
                               <button
                                 onClick={() => setSelectedTrade(trade)}
                                 className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
                               >
                                 <ChevronRight size={16} className="text-neutral-800 group-hover:text-white transition-colors" />
                               </button>
                            </div>
                         </td>
                      </tr>
                     ))
                   ) : (
                     <tr>
                       <td colSpan={9} className="px-6 py-12 text-center">
                         <div className="flex flex-col items-center gap-3 text-neutral-600">
                           <AlertCircle size={32} className="opacity-20" />
                           <p className="text-sm font-bold">
                             {isLoadingTrades ? 'Loading trades...' : 'No trades found'}
                           </p>
                           <p className="text-xs">
                             {isLoadingTrades ? 'Please wait...' : 'Sync your exchange or adjust filters to see trades'}
                           </p>
                         </div>
                       </td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Trade Detail Drawer */}
        <AnimatePresence>
           {selectedTrade && (
              <>
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   onClick={() => setSelectedTrade(null)}
                   className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                 />
                 <motion.div 
                   initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                   transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                   className="absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[#111] border-l border-neutral-800 z-50 shadow-2xl flex flex-col"
                 >
                    <div className="p-8 border-b border-neutral-800 flex justify-between items-center bg-[#0A0A0A]">
                       <div className="flex items-center gap-4">
                          <button onClick={() => setSelectedTrade(null)} className="text-neutral-500 hover:text-white"><ChevronLeft size={20}/></button>
                          <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                               {selectedTrade.pairs} 
                               <span className={`text-[10px] font-black px-2 py-0.5 rounded ${selectedTrade.status === 'WIN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                  {selectedTrade.status}
                               </span>
                            </h2>
                            <p className="text-xs text-neutral-500 mt-1">
                              {new Date(selectedTrade.trade_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                       </div>
                       <button className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"><MoreHorizontal size={20}/></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                       <div className="grid grid-cols-2 gap-4">
                          <DetailCard label="Entry Price" value={`$${selectedTrade.entry_price}`} />
                          <DetailCard label="Exit Price" value={selectedTrade.exit_price ? `$${selectedTrade.exit_price}` : 'N/A'} />
                          <DetailCard label="Position Size" value={selectedTrade.position_size || 'N/A'} />
                          <DetailCard label="Realized Return" value={`$${selectedTrade.pnl_amount}`} sub={selectedTrade.pnl_percentage ? `${selectedTrade.pnl_percentage}%` : '-'} positive={selectedTrade.status === 'WIN'} />
                       </div>

                       {/* Manual Fields Display */}
                       {(selectedTrade.session || selectedTrade.market_cap || selectedTrade.primary_setup_type || 
                         selectedTrade.key_indicators || selectedTrade.timeframe_analysis || selectedTrade.risk_percentage ||
                         selectedTrade.mid_trade_changes || selectedTrade.entry_window || selectedTrade.pre_trade_confidence || 
                         selectedTrade.emotional_load || selectedTrade.remarks) && (
                         <div className="space-y-4">
                           <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500">Trade Analysis (Manual)</h3>
                           <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-6 space-y-4">
                             
                             {/* Row 1: Session & Market Cap */}
                             <div className="grid grid-cols-2 gap-4">
                               {selectedTrade.session && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Session</p>
                                   <p className="text-sm text-white">{selectedTrade.session}</p>
                                 </div>
                               )}
                               {selectedTrade.market_cap && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Market Cap</p>
                                   <p className="text-sm text-white">{selectedTrade.market_cap}</p>
                                 </div>
                               )}
                             </div>

                             {/* Row 2: Setup Type & Key Indicators */}
                             <div className="grid grid-cols-2 gap-4">
                               {selectedTrade.primary_setup_type && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Setup Type</p>
                                   <p className="text-sm text-white">{selectedTrade.primary_setup_type}</p>
                                 </div>
                               )}
                               {selectedTrade.key_indicators && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Key Indicators</p>
                                   <p className="text-sm text-white">{selectedTrade.key_indicators}</p>
                                 </div>
                               )}
                             </div>

                             {/* Row 3: Timeframe & Risk % */}
                             <div className="grid grid-cols-2 gap-4">
                               {selectedTrade.timeframe_analysis && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Timeframe Analysis</p>
                                   <p className="text-sm text-white">{selectedTrade.timeframe_analysis}</p>
                                 </div>
                               )}
                               {selectedTrade.risk_percentage && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Risk %</p>
                                   <p className="text-sm text-white">{selectedTrade.risk_percentage}%</p>
                                 </div>
                               )}
                             </div>

                             {/* Row 4: Mid Trade Changes & Entry Window */}
                             <div className="grid grid-cols-2 gap-4">
                               {selectedTrade.mid_trade_changes !== undefined && selectedTrade.mid_trade_changes !== null && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Mid Trade Changes</p>
                                   <p className="text-sm text-white">{selectedTrade.mid_trade_changes} times</p>
                                 </div>
                               )}
                               {selectedTrade.entry_window && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Entry Window</p>
                                   <p className="text-sm text-white">{selectedTrade.entry_window} minutes</p>
                                 </div>
                               )}
                             </div>

                             {/* Row 5: Confidence & Emotional Load */}
                             <div className="grid grid-cols-2 gap-4">
                               {selectedTrade.pre_trade_confidence && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Pre-Trade Confidence</p>
                                   <div className="flex items-center gap-2">
                                     <p className="text-sm text-white font-bold">{selectedTrade.pre_trade_confidence}/10</p>
                                     <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                       <div 
                                         className="h-full bg-blue-500 rounded-full transition-all"
                                         style={{ width: `${(selectedTrade.pre_trade_confidence / 10) * 100}%` }}
                                       />
                                     </div>
                                   </div>
                                 </div>
                               )}
                               {selectedTrade.emotional_load && (
                                 <div>
                                   <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">Emotional Load</p>
                                   <div className="flex items-center gap-2">
                                     <p className="text-sm text-white font-bold">{selectedTrade.emotional_load}/10</p>
                                     <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                                       <div 
                                         className={`h-full rounded-full transition-all ${
                                           selectedTrade.emotional_load <= 3 ? 'bg-green-500' : 
                                           selectedTrade.emotional_load <= 6 ? 'bg-yellow-500' : 
                                           'bg-red-500'
                                         }`}
                                         style={{ width: `${(selectedTrade.emotional_load / 10) * 100}%` }}
                                       />
                                     </div>
                                   </div>
                                 </div>
                               )}
                             </div>

                             {/* Remarks (Full Width) */}
                             {selectedTrade.remarks && (
                               <div className="pt-2 border-t border-neutral-800">
                                 <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-2">Remarks</p>
                                 <p className="text-sm text-neutral-300 leading-relaxed">{selectedTrade.remarks}</p>
                               </div>
                             )}
                           </div>
                         </div>
                       )}

                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500">Visual Evidence</h3>
                          <div className="aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 border-dashed flex flex-col items-center justify-center text-neutral-600 hover:text-neutral-400 hover:border-neutral-600 transition-all cursor-pointer">
                             <Camera size={32} className="mb-2 opacity-20" />
                             <p className="text-xs font-bold uppercase tracking-tight">Upload Trade Execution Chart</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </>
           )}
        </AnimatePresence>

        {/* Edit Trade Modal */}
        <AnimatePresence>
          {editingTrade && (
            <EditTradeModal
              trade={editingTrade}
              onClose={() => setEditingTrade(null)}
              onSave={handleSaveTrade}
            />
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

const StatCard = ({ title, value, percent, positive, sub, chart }: any) => (
  <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-all group">
     <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">{title}</p>
        {chart}
     </div>
     <div>
        <h3 className="text-2xl font-black text-white tracking-tighter">{value}</h3>
        {percent && <p className={`text-[10px] font-black mt-1 ${positive ? 'text-green-500' : 'text-red-500'}`}>{percent} since last week</p>}
        {sub && <p className="text-[10px] font-bold text-neutral-600 mt-1 uppercase tracking-tight">{sub}</p>}
     </div>
  </div>
);

const FilterButton = ({ label, value }: any) => (
  <button className="px-4 py-2 bg-[#111] border border-neutral-800 rounded-xl text-xs font-bold text-neutral-400 hover:bg-neutral-800 hover:text-white transition-all flex items-center gap-2">
     <span className="text-neutral-600 font-normal">{label}:</span> {value}
  </button>
);

const DetailCard = ({ label, value, sub, positive }: any) => (
  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-neutral-800">
     <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">{label}</p>
     <div className="flex items-baseline gap-2">
        <p className={`text-lg font-bold font-mono ${positive === true ? 'text-green-500' : positive === false ? 'text-red-500' : 'text-white'}`}>{value}</p>
        {sub && <span className="text-[10px] font-bold text-neutral-500 font-mono">{sub}</span>}
     </div>
  </div>
);

export default TradesPage;
