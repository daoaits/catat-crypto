import React, { useState, useEffect } from 'react';
import { 
  FileText, BarChart2, Calendar, Share2, 
  Trash2, Clock, Calendar as CalendarIcon, FilePlus, Tag, Check, Search, Save, X
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import RichTextEditor from '../components/RichTextEditor';
import { usePortfolio } from '../context/PortfolioContext';
import { useCexAccount } from '../context/CexAccountContext';
import { apiService } from '../services/apiService';

interface NotebookPageProps {
  formData: any;
}

interface JournalEntry {
  id: number;
  trade_date: string;
  remarks: string;
  screenshots: string[];
  mood?: string;
  pnl?: number;
  trades_count?: number;
  created_at: string;
  updated_at: string;
}

const NotebookPage: React.FC<NotebookPageProps> = ({ formData }) => {
  const { portfolioData } = usePortfolio();
  const { selectedAccount } = useCexAccount();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [activeJournal, setActiveJournal] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState('');
  const [pnl, setPnl] = useState<number | undefined>();
  const [tradesCount, setTradesCount] = useState<number | undefined>();
  
  // Filter state
  const [activeFolder, setActiveFolder] = useState<'all' | 'trade' | 'daily'>('all');
  
  // Current month/year for filtering
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('auth_token') || '';
  };

  // Load journals for current month
  const loadJournals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login first');
        return;
      }

      if (!selectedAccount) {
        setError('No CEX account selected');
        return;
      }
      
      const response = await apiService.getJournals(currentYear, currentMonth, token, selectedAccount.id);
      if (response.success) {
        setJournals(response.data);
        
        // If no active journal, select the first one
        if (response.data.length > 0 && !activeJournal) {
          selectJournal(response.data[0]);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load journals');
      console.error('Error loading journals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load journals on mount and when month changes or account changes
  useEffect(() => {
    loadJournals();
  }, [currentYear, currentMonth, selectedAccount]);

  // Select a journal to view/edit
  const selectJournal = (journal: JournalEntry) => {
    setActiveJournal(journal);
    setTitle(formatJournalTitle(journal));
    setContent(journal.remarks || '');
    setSelectedDate(journal.trade_date);
    setMood(journal.mood || '');
    setPnl(journal.pnl);
    setTradesCount(journal.trades_count);
    setIsEditing(false);
  };

  // Format journal title from date
  const formatJournalTitle = (journal: JournalEntry) => {
    const date = new Date(journal.trade_date);
    const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
    
    if (journal.remarks) {
      // Strip HTML tags and get first line
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = journal.remarks;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const firstLine = plainText.split('\n')[0].trim();
      return firstLine.substring(0, 50) || `${monthDay} Daily Journal`;
    }
    
    return `${monthDay} Daily Journal`;
  };

  // Create new journal
  const createNewJournal = () => {
    setActiveJournal(null);
    setTitle('');
    setContent('');
    // Set to current date and time to avoid conflicts
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setMood('');
    setPnl(undefined);
    setTradesCount(undefined);
    setIsEditing(true);
  };

  // Save journal
  const saveJournal = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login first');
        return;
      }

      if (!selectedAccount) {
        setError('No CEX account selected');
        return;
      }

      // Check if journal already exists for this date (when creating new)
      if (!activeJournal) {
        const existingJournal = journals.find(j => j.trade_date === selectedDate);
        if (existingJournal) {
          const confirmOverwrite = confirm(
            `A journal entry already exists for ${selectedDate}. Do you want to overwrite it?`
          );
          if (!confirmOverwrite) {
            setIsSaving(false);
            return;
          }
        }
      }

      const data = {
        cex_account_id: selectedAccount.id,
        trade_date: selectedDate,
        remarks: content,
        screenshots: [],
        mood: mood || undefined,
        pnl: pnl || undefined,
        trades_count: tradesCount || undefined,
      };

      const response = await apiService.saveJournal(data, token);
      if (response.success) {
        // Reload journals
        await loadJournals();
        setIsEditing(false);
        
        // Select the saved journal
        const savedJournal = response.data;
        setActiveJournal(savedJournal);
        
        // Show success message briefly
        setError(null);
        setSuccessMessage('Journal saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err: any) {
      console.error('Save error:', err);
      let errorMessage = err.message || 'Failed to save journal';
      
      // Parse validation errors if available
      if (err.message && err.message.includes('Validation failed')) {
        errorMessage = 'Validation failed. Please check your input.';
      }
      
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete journal
  const deleteJournal = async () => {
    if (!activeJournal) return;
    
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please login first');
        return;
      }

      if (!selectedAccount) {
        setError('No CEX account selected');
        return;
      }

      const response = await apiService.deleteJournal(activeJournal.trade_date, token, selectedAccount.id);
      if (response.success) {
        // Reload journals
        await loadJournals();
        setActiveJournal(null);
        setTitle('');
        setContent('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete journal');
      console.error('Error deleting journal:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format time ago
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get excerpt from content
  const getExcerpt = (text: string, maxLength: number = 100) => {
    if (!text) return 'No content available...';
    
    // Strip HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Get excerpt
    const cleaned = plainText.trim();
    if (!cleaned) return 'No content available...';
    
    return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned;
  };

  // Determine tag color based on PNL
  const getTagFromJournal = (journal: JournalEntry) => {
    const tags = [];
    
    if (journal.pnl !== null && journal.pnl !== undefined) {
      if (journal.pnl > 0) {
        tags.push({ label: 'PROFIT', color: 'green' });
      } else if (journal.pnl < 0) {
        tags.push({ label: 'LOSS', color: 'red' });
      }
    }
    
    if (journal.mood) {
      tags.push({ label: journal.mood.toUpperCase(), color: 'blue' });
    }
    
    return tags;
  };

  // Filter journals based on active folder
  const filteredJournals = journals.filter(journal => {
    if (activeFolder === 'all') return true;
    if (activeFolder === 'trade') return journal.pnl !== null && journal.pnl !== undefined;
    if (activeFolder === 'daily') return true; // All journals are daily journals
    return true;
  });

  // Count journals by type
  const tradeNotesCount = journals.filter(j => j.pnl !== null && j.pnl !== undefined).length;
  const dailyJournalCount = journals.length;

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      <Sidebar plan={formData.plan} />

      <main className="flex-1 bg-[#050505] min-h-screen flex flex-col">
        <TopBar name={formData.name}>
          <h1 className="text-xl font-bold">Notebook</h1>
        </TopBar>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm flex items-center gap-2">
            <Check size={16} />
            {successMessage}
          </div>
        )}

        {/* Notebook Content Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Folders & Tags */}
          <div className="w-64 border-r border-neutral-900 bg-[#0A0A0A] flex flex-col shrink-0">
             <div className="p-4 border-b border-neutral-900">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={14} />
                 <input 
                   type="text" 
                   placeholder="Search notes..." 
                   className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-neutral-600 transition-all text-white placeholder-neutral-600"
                 />
               </div>
             </div>

             <div className="p-4 flex-1 overflow-y-auto">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-3 px-2">Folders</h3>
                <nav className="space-y-0.5 mb-8">
                   <FolderItem 
                     icon={<FileText size={16} />} 
                     label="All Notes" 
                     count={journals.length} 
                     active={activeFolder === 'all'}
                     onClick={() => setActiveFolder('all')}
                   />
                   <FolderItem 
                     icon={<BarChart2 size={16} />} 
                     label="Trade Notes" 
                     count={tradeNotesCount}
                     active={activeFolder === 'trade'}
                     onClick={() => setActiveFolder('trade')}
                   />
                   <FolderItem 
                     icon={<Calendar size={16} />} 
                     label="Daily Journal" 
                     count={dailyJournalCount}
                     active={activeFolder === 'daily'}
                     onClick={() => setActiveFolder('daily')}
                   />
                </nav>

                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-3 px-2">Month</h3>
                <div className="px-2 mb-4">
                  <select 
                    value={`${currentYear}-${currentMonth}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-');
                      setCurrentYear(parseInt(year));
                      setCurrentMonth(parseInt(month));
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-neutral-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = i + 1;
                      const date = new Date(currentYear, i);
                      return (
                        <option key={`${currentYear}-${month}`} value={`${currentYear}-${month}`}>
                          {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </option>
                      );
                    })}
                  </select>
                </div>
             </div>
          </div>

          {/* Middle Column: Notes List */}
          <div className="w-80 border-r border-neutral-900 flex flex-col shrink-0">
             <div className="p-4 border-b border-neutral-900 flex justify-between items-center bg-[#050505]">
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">
                  {isLoading ? 'Loading...' : `${activeFolder === 'all' ? 'All Notes' : activeFolder === 'trade' ? 'Trade Notes' : 'Daily Journal'} (${filteredJournals.length})`}
                </span>
                <button 
                  onClick={createNewJournal}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <FilePlus size={18} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto bg-[#050505]">
                {filteredJournals.length === 0 && !isLoading && (
                  <div className="p-8 text-center text-neutral-600 text-sm">
                    {journals.length === 0 ? (
                      <>No journal entries yet.<br />Click + to create one!</>
                    ) : (
                      <>No {activeFolder === 'trade' ? 'trade notes' : 'journals'} found.<br />Try a different filter.</>
                    )}
                  </div>
                )}
                {filteredJournals.map(journal => (
                   <NoteItem 
                     key={journal.id} 
                     title={formatJournalTitle(journal)}
                     time={timeAgo(journal.updated_at)}
                     excerpt={getExcerpt(journal.remarks)}
                     tags={getTagFromJournal(journal)}
                     active={activeJournal?.id === journal.id} 
                     onClick={() => selectJournal(journal)} 
                   />
                ))}
             </div>
          </div>

          {/* Right Column: Note Editor */}
          <div className="flex-1 bg-black flex flex-col">
             {activeJournal || isEditing ? (
               <>
                 <div className="h-12 border-b border-neutral-900 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-neutral-500">
                          <Clock size={12} /> 
                          <span className="text-[10px] font-bold">
                            {activeJournal ? timeAgo(activeJournal.updated_at) : 'New entry'}
                          </span>
                       </div>
                       <div className="h-3 w-px bg-neutral-800" />
                       <div className="flex items-center gap-1.5 text-neutral-500">
                          <CalendarIcon size={12} /> 
                          <input 
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            disabled={!isEditing}
                            className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none outline-none disabled:cursor-not-allowed"
                            title="One journal per day - changing date may overwrite existing entry"
                          />
                       </div>
                       {!activeJournal && isEditing && journals.find(j => j.trade_date === selectedDate) && (
                         <div className="flex items-center gap-1 text-amber-500 text-[9px] font-bold">
                           ⚠️ Date exists
                         </div>
                       )}
                    </div>
                    <div className="flex items-center gap-3">
                       {isEditing ? (
                         <>
                           <button 
                             onClick={() => {
                               setIsEditing(false);
                               if (activeJournal) selectJournal(activeJournal);
                             }}
                             className="text-neutral-500 hover:text-white transition-colors"
                           >
                             <X size={16} />
                           </button>
                           <button 
                             onClick={saveJournal}
                             disabled={isSaving}
                             className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                           >
                             <Save size={14} />
                             {isSaving ? 'Saving...' : 'Save'}
                           </button>
                         </>
                       ) : (
                         <>
                           <button 
                             onClick={() => setIsEditing(true)}
                             className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors"
                           >
                             Edit
                           </button>
                           <button 
                             onClick={deleteJournal}
                             className="text-neutral-500 hover:text-red-500 transition-colors"
                           >
                             <Trash2 size={16} />
                           </button>
                         </>
                       )}
                    </div>
                 </div>

                 {/* Editor Canvas */}
                 <div className="flex-1 overflow-y-auto p-12 max-w-4xl mx-auto w-full">
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={!isEditing}
                      className="w-full bg-transparent border-none outline-none text-4xl font-black tracking-tight text-white mb-6 disabled:text-neutral-400"
                      placeholder="Note Title"
                    />
                    
                    <div className="prose prose-invert max-w-none text-neutral-300">
                       <RichTextEditor
                         value={content}
                         onChange={setContent}
                         disabled={!isEditing}
                         placeholder="Write your trading notes here..."
                       />
                       
                       {/* Metadata Section */}
                       <div className="mt-8 space-y-4">
                         <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6">
                           <h3 className="text-sm font-bold text-white mb-4">Trade Metadata</h3>
                           <div className="grid grid-cols-3 gap-4">
                             <div>
                               <label className="text-[10px] font-black uppercase text-neutral-500 block mb-2">Mood</label>
                               <input 
                                 type="text"
                                 value={mood}
                                 onChange={(e) => setMood(e.target.value)}
                                 disabled={!isEditing}
                                 placeholder="e.g., Confident"
                                 className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white disabled:opacity-50"
                               />
                             </div>
                             <div>
                               <label className="text-[10px] font-black uppercase text-neutral-500 block mb-2">PNL ($)</label>
                               <input 
                                 type="number"
                                 step="0.01"
                                 value={pnl || ''}
                                 onChange={(e) => setPnl(e.target.value ? parseFloat(e.target.value) : undefined)}
                                 disabled={!isEditing}
                                 placeholder="0.00"
                                 className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white disabled:opacity-50"
                               />
                             </div>
                             <div>
                               <label className="text-[10px] font-black uppercase text-neutral-500 block mb-2">Trades Count</label>
                               <input 
                                 type="number"
                                 value={tradesCount || ''}
                                 onChange={(e) => setTradesCount(e.target.value ? parseInt(e.target.value) : undefined)}
                                 disabled={!isEditing}
                                 placeholder="0"
                                 className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-sm text-white disabled:opacity-50"
                               />
                             </div>
                           </div>
                         </div>

                         {pnl !== undefined && pnl !== null && (
                           <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className={`w-12 h-12 ${pnl >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'} rounded-xl flex items-center justify-center font-black`}>
                                   PNL
                                 </div>
                                 <div>
                                    <p className={`text-xl font-black ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                                    </p>
                                    <p className="text-[10px] font-black uppercase text-neutral-500">Realized Performance</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2 text-green-500">
                                 <span className="text-[10px] font-black uppercase">Saved to Database</span>
                                 <Check size={14} />
                              </div>
                           </div>
                         )}
                       </div>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex-1 flex items-center justify-center text-neutral-600">
                 <div className="text-center">
                   <FileText size={48} className="mx-auto mb-4 opacity-50" />
                   <p className="text-lg font-bold">No journal selected</p>
                   <p className="text-sm mt-2">Select a journal from the list or create a new one</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub Components ---

const FolderItem = ({ icon, label, count, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${active ? 'bg-red-600/10 text-white' : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'}`}
  >
     <div className="flex items-center gap-3">
        <span className={active ? 'text-red-500' : 'text-neutral-600'}>{icon}</span>
        <span className="text-xs font-bold">{label}</span>
     </div>
     <span className="text-[10px] font-bold text-neutral-700">{count}</span>
  </button>
);

const NoteItem = ({ title, time, excerpt, tags, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`p-4 border-b border-neutral-900 cursor-pointer transition-all ${active ? 'bg-neutral-900/50 border-l-2 border-l-red-600' : 'hover:bg-neutral-900/30'}`}
  >
     <div className="flex justify-between items-start mb-2">
        <h4 className={`text-xs font-black truncate pr-2 ${active ? 'text-white' : 'text-neutral-400'}`}>{title}</h4>
        <span className="text-[9px] font-bold text-neutral-700 shrink-0">{time}</span>
     </div>
     <p className="text-[10px] text-neutral-600 line-clamp-2 leading-relaxed mb-3">{excerpt}</p>
     <div className="flex gap-2">
        {tags.map((tag: any, i: number) => (
           <span key={i} className={`text-[8px] font-black uppercase tracking-widest ${
             tag.color === 'blue' ? 'text-blue-500' : 
             tag.color === 'red' ? 'text-red-500' : 
             tag.color === 'green' ? 'text-green-500' :
             tag.color === 'amber' ? 'text-amber-500' : 
             'text-neutral-500'
           }`}>
              #{tag.label}
           </span>
        ))}
     </div>
  </div>
);

export default NotebookPage;
