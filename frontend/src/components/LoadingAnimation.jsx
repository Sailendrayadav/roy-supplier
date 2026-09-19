import React from 'react';
import { motion } from 'framer-motion';
import { Truck, HardHat } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="py-20 flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="w-14 h-14 rounded-2xl bg-amber-500/10 border-2 border-amber-500 border-t-transparent flex items-center justify-center text-amber-500"
      >
        <Truck className="w-7 h-7" />
      </motion.div>
      <div className="text-center space-y-1">
        <h4 className="text-sm font-bold text-white font-display">Loading RSY Supplier Offerings...</h4>
        <p className="text-xs text-slate-400">Fetching latest stock and fleet availability</p>
      </div>
    </div>
  );
}
