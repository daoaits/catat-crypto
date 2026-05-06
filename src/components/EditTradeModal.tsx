import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save } from 'lucide-react';

interface EditTradeModalProps {
  trade: any;
  onClose: () => void;
  onSave: (tradeId: number, data: any) => Promise<void>;
}

const EditTradeModal: React.FC<EditTradeModalProps> = ({ trade, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    session: trade.session || '',
    market_cap: trade.market_cap || '',
    primary_setup_type: trade.primary_setup_type || '',
    key_indicators: trade.key_indicators || '',
    timeframe_analysis: trade.timeframe_analysis || '',
    risk_percentage: trade.risk_percentage || '',
    mid_trade_changes: trade.mid_trade_changes || 0,
    entry_window: trade.entry_window || '',
    pre_trade_confidence: trade.pre_trade_confidence || 5,
    emotional_load: trade.emotional_load || 5,
    remarks: trade.remarks || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(trade.id, formData);
      onClose();
    } catch (error) {
      console.error('Failed to save trade:', error);
      alert('Failed to save trade. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-[#111] border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-[#0A0A0A]">
            <div>
              <h2 className="text-xl font-bold text-white">Edit Trade Details</h2>
              <p className="text-xs text-neutral-500 mt-1">
                {trade.pairs} • {new Date(trade.trade_date).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
            >
              <X size={20} className="text-neutral-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Auto Fields (Read-only) */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-green-500">
                Auto Data (From API)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <ReadOnlyField label="Pairs" value={trade.pairs} />
                <ReadOnlyField label="Direction" value={trade.direction} />
                <ReadOnlyField label="Entry Price" value={`$${trade.entry_price}`} />
                <ReadOnlyField label="Exit Price" value={trade.exit_price ? `$${trade.exit_price}` : 'N/A'} />
                <ReadOnlyField label="Position Size" value={trade.position_size} />
                <ReadOnlyField label="PnL" value={`$${trade.pnl_amount}`} />
              </div>
            </div>

            {/* Manual Fields */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500">
                Manual Input (Your Analysis)
              </h3>

              {/* Session */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Session</label>
                <select
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                >
                  <option value="">Select Session</option>
                  <option value="Asian Session">Asian Session</option>
                  <option value="US Session">US Session</option>
                  <option value="London Session">London Session</option>
                </select>
              </div>

              {/* Market Cap */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Market Cap</label>
                <select
                  value={formData.market_cap}
                  onChange={(e) => setFormData({ ...formData, market_cap: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                >
                  <option value="">Select Market Cap</option>
                  <option value="High-Cap">High-Cap</option>
                  <option value="Mid-Cap">Mid-Cap</option>
                  <option value="Low-Cap">Low-Cap</option>
                </select>
              </div>

              {/* Primary Setup Type */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Primary Setup Type</label>
                <select
                  value={formData.primary_setup_type}
                  onChange={(e) => setFormData({ ...formData, primary_setup_type: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                >
                  <option value="">Select Setup Type</option>
                  <option value="Breakout">Breakout</option>
                  <option value="Pullback">Pullback</option>
                  <option value="Reversal">Reversal</option>
                  <option value="Trend Continuation">Trend Continuation</option>
                  <option value="Range Trade">Range Trade</option>
                  <option value="News/Event">News/Event</option>
                </select>
              </div>

              {/* Key Indicators */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Key Indicators</label>
                <select
                  value={formData.key_indicators}
                  onChange={(e) => setFormData({ ...formData, key_indicators: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                >
                  <option value="">Select Indicator</option>
                  <option value="EMA crossover">EMA crossover</option>
                  <option value="RSI divergence">RSI divergence</option>
                  <option value="Volume spike">Volume spike</option>
                  <option value="Order block">Order block</option>
                  <option value="Liquidity grab">Liquidity grab</option>
                </select>
              </div>

              {/* Timeframe Analysis */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Timeframe Analysis</label>
                <input
                  type="text"
                  value={formData.timeframe_analysis}
                  onChange={(e) => setFormData({ ...formData, timeframe_analysis: e.target.value })}
                  placeholder="e.g., 4H and Daily"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Risk Percentage */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Risk Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.risk_percentage}
                  onChange={(e) => setFormData({ ...formData, risk_percentage: e.target.value })}
                  placeholder="e.g., 2"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Mid Trade Changes */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Mid Trade Changes</label>
                <input
                  type="number"
                  value={formData.mid_trade_changes}
                  onChange={(e) => setFormData({ ...formData, mid_trade_changes: parseInt(e.target.value) || 0 })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Entry Window (minutes) */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Entry Window (minutes)</label>
                <input
                  type="number"
                  value={formData.entry_window}
                  onChange={(e) => setFormData({ ...formData, entry_window: e.target.value })}
                  placeholder="e.g., 120"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>

              {/* Pre Trade Confidence (1-10) */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">
                  Pre Trade Confidence: {formData.pre_trade_confidence}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.pre_trade_confidence}
                  onChange={(e) => setFormData({ ...formData, pre_trade_confidence: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Emotional Load (1-10) */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">
                  Emotional Load: {formData.emotional_load}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.emotional_load}
                  onChange={(e) => setFormData({ ...formData, emotional_load: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-neutral-600 mt-1">
                  <span>1</span>
                  <span>10</span>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">Remarks</label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Why did you take this trade? What did you learn?"
                  rows={4}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-neutral-600 resize-none"
                />
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-800 flex justify-end gap-3 bg-[#0A0A0A]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const ReadOnlyField = ({ label, value }: { label: string; value: any }) => (
  <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-3">
    <p className="text-[9px] font-black uppercase text-neutral-500 tracking-widest mb-1">{label}</p>
    <p className="text-sm font-bold text-white">{value || 'N/A'}</p>
  </div>
);

export default EditTradeModal;
