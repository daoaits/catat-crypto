import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Edit2, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CexAccount, SUPPORTED_CEX } from '../constants';
import AddCexAccountModal from './AddCexAccountModal';

interface CexAccountListProps {
  onAccountSelect?: (account: CexAccount) => void;
  selectedAccountId?: number | null;
}

const CexAccountList: React.FC<CexAccountListProps> = ({ 
  onAccountSelect,
  selectedAccountId 
}) => {
  const [accounts, setAccounts] = useState<CexAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAccounts();
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
        setAccounts(data.data);
        
        // Auto-select first account if none selected
        if (data.data.length > 0 && !selectedAccountId && onAccountSelect) {
          onAccountSelect(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch CEX accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async (accountId: number) => {
    setSyncingId(accountId);
    try {
      const token = localStorage.getItem('auth_token'); // Fixed: use 'auth_token'
      const response = await fetch(`http://localhost:8000/api/cex-accounts/${accountId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchAccounts();
        // Trigger re-sync in parent component if this is the selected account
        const account = accounts.find(acc => acc.id === accountId);
        if (account && onAccountSelect && selectedAccountId === accountId) {
          onAccountSelect(account);
        }
      }
    } catch (error) {
      console.error('Failed to sync account:', error);
    } finally {
      setSyncingId(null);
    }
  };

  const handleDelete = async (accountId: number) => {
    if (!confirm('Are you sure you want to delete this CEX account?')) {
      return;
    }

    setDeletingId(accountId);
    try {
      const token = localStorage.getItem('auth_token'); // Fixed: use 'auth_token'
      const response = await fetch(`http://localhost:8000/api/cex-accounts/${accountId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchAccounts();
        // If deleted account was selected, select another one
        if (selectedAccountId === accountId && accounts.length > 1) {
          const nextAccount = accounts.find(acc => acc.id !== accountId);
          if (nextAccount && onAccountSelect) {
            onAccountSelect(nextAccount);
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (account: CexAccount) => {
    setEditingAccount({
      id: account.id,
      cex_name: account.cex_name,
      account_label: account.account_label,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleModalSuccess = () => {
    fetchAccounts();
    handleModalClose();
  };

  const getCexIcon = (cexName: string) => {
    const cex = SUPPORTED_CEX.find(c => c.value === cexName);
    return cex?.icon;
  };

  const getCexColor = (cexName: string) => {
    const cex = SUPPORTED_CEX.find(c => c.value === cexName);
    return cex?.color || '#666';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">CEX Accounts</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          Add Account
        </button>
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-neutral-500" />
          </div>
          <h4 className="text-white font-semibold mb-2">No CEX Accounts</h4>
          <p className="text-neutral-400 text-sm mb-4">
            Add your first exchange account to start tracking your trades
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Add Your First Account
          </button>
        </div>
      )}

      {/* Account List */}
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className={`bg-neutral-900 border rounded-xl p-4 transition-all cursor-pointer ${
              selectedAccountId === account.id
                ? 'border-red-500 shadow-lg shadow-red-500/20'
                : 'border-neutral-800 hover:border-neutral-700'
            }`}
            onClick={() => onAccountSelect && onAccountSelect(account)}
          >
            <div className="flex items-start justify-between">
              {/* Left: Icon & Info */}
              <div className="flex items-start gap-3 flex-1">
                {/* CEX Icon */}
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${getCexColor(account.cex_name)}20` }}
                >
                  {getCexIcon(account.cex_name) ? (
                    <img 
                      src={getCexIcon(account.cex_name)} 
                      alt={account.cex_display_name}
                      className="w-8 h-8 object-contain"
                    />
                  ) : (
                    <span className="text-lg font-bold" style={{ color: getCexColor(account.cex_name) }}>
                      {account.cex_display_name[0]}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold truncate">
                      {account.full_display_name}
                    </h4>
                    {account.is_active ? (
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-neutral-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Last synced: {formatDate(account.last_synced_at)}
                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSync(account.id);
                  }}
                  disabled={syncingId === account.id}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                  title="Sync Now"
                >
                  <RefreshCw 
                    size={16} 
                    className={`text-neutral-400 hover:text-white ${
                      syncingId === account.id ? 'animate-spin' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(account);
                  }}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} className="text-neutral-400 hover:text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(account.id);
                  }}
                  disabled={deletingId === account.id}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {deletingId === account.id ? (
                    <Loader2 size={16} className="text-red-400 animate-spin" />
                  ) : (
                    <Trash2 size={16} className="text-neutral-400 hover:text-red-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AddCexAccountModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editAccount={editingAccount}
      />
    </div>
  );
};

export default CexAccountList;
