import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SyncLoadingModalProps {
  isOpen: boolean;
  cexName?: string;
  message?: string;
}

const SyncLoadingModal: React.FC<SyncLoadingModalProps> = ({ 
  isOpen, 
  cexName = 'Exchange',
  message = 'Syncing your data...'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Outer spinning ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-neutral-800 border-t-red-600"
                />
                
                {/* Inner icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <RefreshCw size={32} className="text-red-600" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white">
                Syncing with {cexName}
              </h3>
              
              <p className="text-sm text-neutral-400">
                {message}
              </p>

              {/* Loading dots */}
              <div className="flex justify-center gap-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-2 h-2 bg-red-600 rounded-full"
                  />
                ))}
              </div>

              {/* Progress indicator */}
              <div className="pt-4">
                <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-red-600 to-red-400"
                  />
                </div>
              </div>

              {/* Info text */}
              <p className="text-xs text-neutral-600 pt-2">
                Please wait while we fetch your latest data
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SyncLoadingModal;
