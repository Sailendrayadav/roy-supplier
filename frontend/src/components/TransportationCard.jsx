import React from 'react';
import { motion } from 'framer-motion';
import { Truck, FileText, MapPin, Gauge, ShieldCheck } from 'lucide-react';

export default function TransportationCard({ service, onOpenQuote }) {
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
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        
        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md border border-slate-700 text-amber-400 text-[11px] font-extrabold px-2.5 py-1 rounded-md flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 text-amber-500" />
          {service.service_type || 'Fleet Logistics'}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            <MapPin className="w-3 h-3" /> All Nepal Route Haulage
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {service.name}
          </h3>
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-amber-500" /> Load Capacity:
            </span>
            <span className="font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              {service.capacity || 'Multi-Tonne Fleet'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Dispatch Status:</span>
            <span className="font-semibold text-emerald-400">{service.availability || '24/7 Dispatch'}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onOpenQuote(service)}
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
        >
          <FileText className="w-4 h-4 stroke-[2.5]" />
          <span>Book Vehicle / Get Quote</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
