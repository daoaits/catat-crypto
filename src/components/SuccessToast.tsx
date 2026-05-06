import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessToastProps {
  isOpen: boolean;
  onClose: () => void;
  cexName: string;
  duration?: number; // Auto-close duration in ms
}

const SuccessToast: React.FC<SuccessToastProps> = ({ 
  isOpen, 
  onClose, 
  cexName,
  duration = 3000 
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed top-8 right-8 z-[110] max-w-md"
        >
          <div className="bg-gradient-to-r from-green-900/90 to-green-800/90 backdrop-blur-xl border border-green-700/50 rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className="h-1 bg-green-400"
            />

            {/* Content */}
            <div className="p-4 flex items-start gap-3">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  delay: 0.2,
                  stiffness: 200 
                }}
                className="flex-shrink-0"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} className="text-white" />
                </div>
              </motion.div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <motion.h4
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-bold text-white mb-1"
                >
                  Successfully switched to {cexName}!
                </motion.h4>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs text-green-200"
                >
                  Your dashboard has been updated with the latest data.
                </motion.p>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-green-300 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessToast;
