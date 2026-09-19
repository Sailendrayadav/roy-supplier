import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Truck, HardHat, Wrench, ArrowRight } from 'lucide-react';

export default function CategorySection({ activeCategory, setActiveCategory }) {
  const categoryCards = [
    {
      id: 'construction-materials',
      name: 'Construction Materials',
      sub: 'Cement, Rod/TMT, Sand, Aggregate, Bricks, GI Sheets, Pipes & Tiles',
      count: '13 Subcategories',
      icon: Layers,
      image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      badge: 'Certified Supply'
    },
    {
      id: 'transportation',
      name: 'Transportation & Logistics',
      sub: 'Sand/soil haulage, Tipper, Truck & Tractor rentals, site labor',
      count: '7 Specialized Fleet Services',
      icon: Truck,
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      badge: '24/7 Fleet Dispatch'
    },
    {
      id: 'bulk-road-materials',
      name: 'Bulk & Road Construction Materials',
      sub: 'Crusher aggregates, Quarry Boulders, Base course, Sub-base gravel',
      count: '4 Bulk Categories',
      icon: HardHat,
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      badge: 'Crusher Direct'
    },
    {
      id: 'equipment',
      name: 'Construction Machinery & Equipment',
      sub: 'Excavator, JCB Backhoe, Heavy Tippers, Tractors & Heavy Haulers',
      count: 'Heavy Duty Fleet',
      icon: Wrench,
      image: 'https://images.unsplash.com/photo-1579412690850-bd41cd0af397?auto=format&fit=crop&w=600&q=80',
      badge: 'Operator Included'
    }
  ];

  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
              Core Supply Divisions
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Main Service & Material Categories
            </h2>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md">
            Click any category below to filter our high-grade materials, equipment rentals, and specialized transport fleets.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => handleCategoryClick(cat.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                  isSelected 
                    ? 'border-amber-500 bg-amber-500/10 shadow-xl shadow-amber-500/10 scale-[1.02]' 
                    : 'border-slate-800 bg-slate-950/80 hover:border-amber-500/50 hover:bg-slate-900'
                }`}
              >
                {/* Image Header */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm border border-slate-700 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                    {cat.badge}
                  </span>

                  {/* Icon floating */}
                  <div className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.sub}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-medium text-[11px]">{cat.count}</span>
                    <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Items <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
