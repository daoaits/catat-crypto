import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { SUPPORTED_CEX, CexConfig } from '../constants';

interface AddCexAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editAccount?: {
    id: number;
    cex_name: string;
    account_label: string;
  } | null;
}

const AddCexAccountModal: React.FC<AddCexAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editAccount = null,
}) => {
  const [selectedCex, setSelectedCex] = useState<string>('');
  const [accountLabel, setAccountLabel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [apiPassphrase, setApiPassphrase] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string>('');
  const [testSuccess, setTestSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedCexConfig = SUPPORTED_CEX.find(cex => cex.value === selectedCex);
  const requiresPassphrase = selectedCexConfig?.requiresPassphrase || false;

  useEffect(() => {
    if (editAccount) {
      setSelectedCex(editAccount.cex_name);
      setAccountLabel(editAccount.account_label);
    } else {
      resetForm();
    }
  }, [editAccount, isOpen]);

  const resetForm = () => {
    setSelectedCex('');
    setAccountLabel('');
    setApiKey('');
    setApiSecret('');
    setApiPassphrase('');
    setError('');
    setTestSuccess(false);
    setSaveSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTestConnection = async () => {
    if (!selectedCex || !apiKey || !apiSecret) {
      setError('Please fill in all required fields');
      return;
    }

    if (requiresPassphrase && !apiPassphrase) {
      setError(`${selectedCexConfig?.label} requires API passphrase`);
      return;
    }

    setIsTesting(true);
    setError('');
    setTestSuccess(false);

    try {
      const token = localStorage.getItem('auth_token'); // Fixed: use 'auth_token' instead of 'token'
      
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }
      
      // Create temporary account for testing
      const createResponse = await fetch('http://localhost:8000/api/cex-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cex_name: selectedCex,
          account_label: accountLabel || 'Test Account',
          api_key: apiKey,
          api_secret: apiSecret,
          api_passphrase: requiresPassphrase ? apiPassphrase : null,
        }),
      });

      // Check if response is JSON
      const contentType = createResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please check if backend is running.');
      }

      const createData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createData.message || 'Failed to create test account');
      }

      // Test the connection
      const testResponse = await fetch(`http://localhost:8000/api/cex-accounts/${createData.data.id}/test`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const testData = await testResponse.json();

      // Delete the test account
      await fetch(`http://localhost:8000/api/cex-accounts/${createData.data.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!testResponse.ok) {
        throw new Error(testData.message || 'Connection test failed');
      }

      setTestSuccess(true);
      setError('');
    } catch (err: any) {
      console.error('Test connection error:', err);
      setError(err.message || 'Connection test failed');
      setTestSuccess(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCex || !apiKey || !apiSecret) {
      setError('Please fill in all required fields');
      return;
    }

    if (requiresPassphrase && !apiPassphrase) {
      setError(`${selectedCexConfig?.label} requires API passphrase`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token'); // Fixed: use 'auth_token' instead of 'token'
      
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }
      
      const url = editAccount 
        ? `http://localhost:8000/api/cex-accounts/${editAccount.id}`
        : 'http://localhost:8000/api/cex-accounts';
      
      const method = editAccount ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          cex_name: selectedCex,
          account_label: accountLabel || 'Main Account',
          api_key: apiKey,
          api_secret: apiSecret,
          api_passphrase: requiresPassphrase ? apiPassphrase : null,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please check if backend is running on http://localhost:8000');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save CEX account');
      }

      // Success!
      setSaveSuccess(true);
      setError('');
      
      // Save the new account ID to localStorage immediately
      // This prevents race condition with auto-restore logic
      if (data.data && data.data.id) {
        localStorage.setItem('selectedAccountId', data.data.id.toString());
        console.log('💾 Saved new account ID to localStorage:', data.data.id);
      }
      
      // Call onSuccess to trigger parent refresh
      onSuccess();
      
      // Close modal after showing success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error('Save account error:', err);
      setError(err.message || 'Failed to save CEX account');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">
            {editAccount ? 'Edit CEX Account' : 'Add CEX Account'}
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {testSuccess && !saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-400">Connection test successful!</p>
            </div>
          )}

          {/* Save Success Message */}
          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-start gap-2">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-green-400">
                  {editAccount ? 'Account updated successfully!' : 'CEX account added successfully!'}
                </p>
                <p className="text-xs text-green-500/70 mt-1">
                  Syncing your data...
                </p>
              </div>
            </div>
          )}

          {/* CEX Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Select Exchange *
            </label>
            <select
              value={selectedCex}
              onChange={(e) => {
                setSelectedCex(e.target.value);
                setApiPassphrase('');
                setTestSuccess(false);
              }}
              disabled={!!editAccount}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Choose an exchange...</option>
              {SUPPORTED_CEX.map((cex) => (
                <option key={cex.value} value={cex.value}>
                  {cex.label}
                </option>
              ))}
            </select>
          </div>

          {/* Account Label */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Account Label (Optional)
            </label>
            <input
              type="text"
              value={accountLabel}
              onChange={(e) => setAccountLabel(e.target.value)}
              placeholder="e.g., Main Account, Trading Account"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
            <p className="text-xs text-neutral-500 mt-1">
              Leave empty to use "Main Account" as default
            </p>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              API Key *
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestSuccess(false);
              }}
              placeholder="Enter your API key"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono text-sm"
              required
            />
          </div>

          {/* API Secret */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              API Secret *
            </label>
            <input
              type="password"
              value={apiSecret}
              onChange={(e) => {
                setApiSecret(e.target.value);
                setTestSuccess(false);
              }}
              placeholder="Enter your API secret"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono text-sm"
              required
            />
          </div>

          {/* API Passphrase (conditional) */}
          {requiresPassphrase && (
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                API Passphrase *
              </label>
              <input
                type="password"
                value={apiPassphrase}
                onChange={(e) => {
                  setApiPassphrase(e.target.value);
                  setTestSuccess(false);
                }}
                placeholder="Enter your API passphrase"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 font-mono text-sm"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                {selectedCexConfig?.label} requires an API passphrase
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting || !selectedCex || !apiKey || !apiSecret}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>
            <button
              type="submit"
              disabled={isLoading || saveSuccess}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle size={18} className="text-white" />
                  Saved!
                </>
              ) : isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                editAccount ? 'Update Account' : 'Add Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCexAccountModal;
