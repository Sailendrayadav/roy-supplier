import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function EquipmentCard({ equipment, onOpenQuote }) {
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
          src={equipment.image}
          alt={equipment.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700 text-amber-400 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Wrench className="w-3.5 h-3.5 text-amber-500" />
          Heavy Machinery Rental
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            <Cpu className="w-3 h-3" /> Machinery & Earthmover
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {equipment.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>
        </div>

        {/* Specs Box */}
        {equipment.specs && (
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="font-semibold text-amber-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Specs & Operator:
            </div>
            <div className="text-slate-300 leading-tight">{equipment.specs}</div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Rental Structure:</span>
            <span className="font-semibold text-slate-200">{equipment.rental_type || 'Hourly / Daily'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Availability:</span>
            <span className="font-semibold text-emerald-400">{equipment.availability || 'Available'}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenQuote(equipment)}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <FileText className="w-4 h-4 stroke-[2.5]" />
          <span>Rent Equipment / Get Quote</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
