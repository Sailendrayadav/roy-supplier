import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({ searchTerm, setSearchTerm, totalResults }) {
  return (
    <div className="w-full space-y-2">
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-amber-500 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search materials, equipment or services (e.g., Cement, TMT Rod, JCB, Tipper, बालुवा)..."
          className="w-full bg-slate-900 text-white placeholder-slate-400 text-sm pl-11 pr-10 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
          <span>Showing <strong className="text-white">{totalResults}</strong> matching offerings</span>
        </span>
        {searchTerm && (
          <span>Filtering by: <strong className="text-amber-400">"{searchTerm}"</strong></span>
        )}
      </div>
    </div>
  );
}
