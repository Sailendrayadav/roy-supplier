import React from 'react';
import { motion } from 'framer-motion';
import { HardHat, FileText, Mountain, ShieldCheck } from 'lucide-react';

export default function BulkMaterialCard({ item, onOpenQuote }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-amber-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-950">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700 text-amber-400 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Mountain className="w-3.5 h-3.5 text-amber-500" />
          Crusher / Quarry Direct
        </span>

        {item.name_np && (
          <span className="absolute bottom-3 left-3 bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-md">
            {item.name_np}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            <HardHat className="w-3 h-3" /> Bulk & Road Work Supply
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Measurement Unit:</span>
            <span className="font-semibold text-slate-200">{item.unit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Supply Capacity:</span>
            <span className="font-semibold text-amber-400">{item.availability || 'Continuous Supply'}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenQuote(item)}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <FileText className="w-4 h-4 stroke-[2.5]" />
          <span>Request Price / Get Quote</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
