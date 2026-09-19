import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  HardHat, 
  Layers, 
  Clock, 
  MapPin 
} from 'lucide-react';

export default function Hero({ searchTerm, setSearchTerm, onOpenQuote, setActiveCategory }) {
  const stats = [
    { label: 'Supply Projects Completed', value: '500+', sub: 'Hydel, Highways & Real Estate' },
    { label: 'Heavy Fleet & Machinery', value: '50+', sub: 'Tippers, Excavators & Trucks' },
    { label: 'Plant Direct Quality', value: '100%', sub: 'Certified OPC/PPC & Rebars' },
    { label: 'On-Time Express Dispatch', value: '24/7', sub: 'Site Logistics Across Nepal' }
  ];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Industrial Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/15 via-slate-950 to-slate-950 pointer-events-none" />
      
      {/* Ambient background pattern */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1800&q=80')` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Search */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span>RSY Supplier • Heavy Building Materials & Transportation</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
              Build Faster With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
                Direct Plant Materials & Heavy Fleet
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Your one-stop source for certified Cement, TMT Steel Rods, River Sand (बालुवा), Aggregate (गिट्टी), 
              Excavator rentals, and bulk Tipper transportation across Nepal.
            </p>

            {/* Search Input Bar in Hero */}
            <div className="pt-2">
              <div className="relative max-w-xl bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl shadow-slate-950/80 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full flex items-center pl-3">
                  <Search className="w-5 h-5 text-amber-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search materials, equipment or services (e.g. Cement, JCB, बालुवा)..."
                    className="w-full bg-transparent text-white placeholder-slate-400 text-sm px-3 py-2.5 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    const catSection = document.getElementById('catalog-section');
                    if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <span>Search Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Quick Searches:</span>
                {['OPC Cement', 'TMT Rods', 'River Sand', 'Excavator', 'Tipper Transport'].map(item => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearchTerm(item);
                      const catSection = document.getElementById('catalog-section');
                      if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 px-2.5 py-1 rounded-md border border-slate-800 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onOpenQuote({ name: 'Bulk Materials & Logistics' })}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2"
              >
                <FileText className="w-4 h-4 stroke-[2.5]" />
                <span>Request Project Rate Quote</span>
              </motion.button>

              <button
                onClick={() => {
                  setActiveCategory('transportation');
                  const catSection = document.getElementById('catalog-section');
                  if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-5 py-3.5 rounded-xl border border-slate-800 text-sm flex items-center gap-2 transition-all"
              >
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Book Transportation & Equipment</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-3 border border-slate-800 shadow-2xl">
              {/* Feature Image Frame */}
              <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80"
                  alt="RSY Supplier Heavy Construction Site Haulage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Dispatch Available
                </div>

                {/* Card Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                    Full-Scale Fleet & Supply Chain
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Direct Crusher Aggregates, Cement & Machinery Rental
                  </h3>
                  <p className="text-xs text-slate-300">
                    Delivering high strength materials directly from certified mills and quarries to your job site.
                  </p>
                </div>
              </div>

              {/* Mini Highlights */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Quality Assured</div>
                    <div className="text-[11px] text-slate-400">NS / ISO Certified</div>
                  </div>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Fast Dispatch</div>
                    <div className="text-[11px] text-slate-400">Same Day Delivery</div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80"
        >
          {stats.map((st, i) => (
            <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-display">
                {st.value}
              </div>
              <div className="text-xs font-bold text-white">{st.label}</div>
              <div className="text-[11px] text-slate-400">{st.sub}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
