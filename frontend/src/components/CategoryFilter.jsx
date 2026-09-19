import React from 'react';
import { Package, Layers, Truck, HardHat, Wrench } from 'lucide-react';

export default function CategoryFilter({ activeCategory, setActiveCategory }) {
  const filters = [
    { id: 'all', label: 'All Offerings', icon: Package },
    { id: 'construction-materials', label: 'Construction Materials', icon: Layers },
    { id: 'transportation', label: 'Transportation', icon: Truck },
    { id: 'bulk-road-materials', label: 'Bulk Materials', icon: HardHat },
    { id: 'equipment', label: 'Equipment Rental', icon: Wrench }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 py-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeCategory === filter.id;

        return (
          <button
            key={filter.id}
            onClick={() => setActiveCategory(filter.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
              isActive
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
            <span>{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
