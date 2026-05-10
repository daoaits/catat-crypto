import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  TrendingUp, 
  Compass, 
  Plus, 
  PieChart, 
  BookOpen, 
  Bot, 
  ChevronRight,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import Logo from './Logo';
import { usePortfolio } from '../context/PortfolioContext';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  plan: string;
  onNewTradeClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ plan, onNewTradeClick }) => {
  const navigate = useNavigate();
  const { logout } = usePortfolio();
  const { t } = useTranslation();
  
  return (
    <div className="w-72 bg-black border-r border-neutral-900 flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-hide">
      <div className="p-6">
        <Logo size="lg" />
        
        <button 
          onClick={onNewTradeClick}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 active:scale-[0.98] mb-8"
        >
          <Plus size={18} /> {t('sidebar.newTrade')}
        </button>

        <nav className="space-y-1">
          <NavItem icon={<BarChart size={20} />} label={t('sidebar.dashboard')} onClick={() => navigate('/dashboard')} />
          <NavItem icon={<PieChart size={20} />} label={t('sidebar.reports')} onClick={() => navigate('/reports')} />
          <NavItem icon={<TrendingUp size={20} />} label={t('sidebar.trades')} onClick={() => navigate('/trades')} />
          <NavItem icon={<BookOpen size={20} />} label={t('sidebar.notebook')} onClick={() => navigate('/notebook')} />
          <NavItem icon={<Bot size={20} />} label={t('sidebar.aiAssistant')} />
          <div className="py-4">
            <div className="h-px bg-neutral-900 w-full mb-4" />
            <NavItem icon={<LogOut size={20} />} label={t('sidebar.logout')} onClick={logout} />
          </div>
        </nav>
      </div>

    <div className="mt-auto p-6">
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-5 rounded-3xl border border-neutral-800 relative overflow-hidden group cursor-pointer">
        {/* Glow Effect */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-red-600 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
        
        <div className="relative z-10">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-red-900/40">
            <ShieldAlert size={20} className="text-white" />
          </div>
          <h3 className="text-sm font-black text-white mb-1 uppercase tracking-tight">{t('sidebar.upgradeToPro')}</h3>
          <p className="text-[10px] text-neutral-500 leading-tight mb-4">{t('sidebar.upgradeDescription')}</p>
          <div className="flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest">
            {t('sidebar.upgradeNow')} <ChevronRight size={10} />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-3 rounded-xl flex items-center gap-3 font-bold transition-all cursor-pointer group ${active ? 'bg-red-700/10 text-red-600 border-l-4 border-red-600 rounded-l-none pl-4' : 'text-neutral-500 hover:text-white hover:bg-neutral-900'}`}
  >
    <span className={`${active ? 'text-red-600' : 'text-neutral-500 group-hover:text-red-500 transition-colors'}`}>{icon}</span>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default Sidebar;
