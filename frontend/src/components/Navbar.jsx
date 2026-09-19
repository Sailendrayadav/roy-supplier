import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  PhoneCall, 
  Menu, 
  X, 
  HardHat, 
  ShieldCheck, 
  MapPin, 
  FileText, 
  Settings,
  Package,
  Layers,
  Wrench,
  LogIn,
  LogOut,
  User,
  Shield
} from 'lucide-react';

export default function Navbar({ 
  onOpenQuote, 
  activeCategory, 
  setActiveCategory, 
  isAdminOpen, 
  setIsAdminOpen,
  currentUser,
  onOpenAuth,
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'All Offerings', key: 'all', icon: Package },
    { name: 'Construction Materials', key: 'construction-materials', icon: Layers },
    { name: 'Transportation & Logistics', key: 'transportation', icon: Truck },
    { name: 'Bulk & Road Supplies', key: 'bulk-road-materials', icon: HardHat },
    { name: 'Construction Equipment', key: 'equipment', icon: Wrench },
  ];

  const handleNavClick = (key) => {
    setActiveCategory(key);
    setIsAdminOpen(false);
    setMobileMenuOpen(false);
    const catalogElem = document.getElementById('catalog-section');
    if (catalogElem) {
      catalogElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminButtonClick = () => {
    if (!currentUser) {
      // Prompt login
      onOpenAuth('login');
      return;
    }
    if (currentUser.role !== 'admin') {
      alert('Administrator access required. Please sign in with an Admin account.');
      return;
    }
    setIsAdminOpen(!isAdminOpen);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-semibold text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-950" /> Direct Plant & Quarry Supplier
            </span>
            <span className="hidden md:inline text-slate-900">•</span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> High Quality Materials Delivered Across Nepal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+9779827492554" className="flex items-center gap-1.5 hover:underline text-slate-950">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Sales: +977 9827492554 / 9804436138</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveCategory('all'); setIsAdminOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Truck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                RSY <span className="text-amber-500">SUPPLIER</span>
              </span>
            </div>
            <p className="text-[10px] tracking-widest text-slate-400 font-medium uppercase">
              Materials • Logistics • Machinery
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = !isAdminOpen && activeCategory === link.key;
            return (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {link.name}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Admin Button */}
          <button
            onClick={handleAdminButtonClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              isAdminOpen
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
            title={currentUser?.role === 'admin' ? 'Toggle Admin Dashboard' : 'Admin Portal (Login Required)'}
          >
            <Settings className="w-4 h-4 text-amber-500" />
            <span>Admin</span>
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-[11px]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-white font-bold leading-tight truncate max-w-[100px]">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-400 capitalize leading-none font-semibold">
                    {currentUser.role === 'admin' ? 'Administrator' : 'Customer'}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-500/40 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-500" />
              <span>Sign In</span>
            </button>
          )}

          {/* Instant Quote Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenQuote({ name: 'General Materials & Transport' })}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-lg shadow-amber-500/25 text-xs tracking-wide"
          >
            <FileText className="w-4 h-4 stroke-[2.5]" />
            <span>Get Instant Quote</span>
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="xl:hidden bg-slate-950 border-t border-slate-800 px-4 py-4 space-y-2 overflow-hidden"
          >
            {/* Mobile User Header */}
            {currentUser ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-white font-bold text-xs">{currentUser.name}</div>
                    <div className="text-[10px] text-amber-400 capitalize">{currentUser.role === 'admin' ? 'Administrator' : 'Customer'}</div>
                  </div>
                </div>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-1 text-xs text-red-400 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="p-2 mb-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 py-2.5 rounded-lg text-xs font-semibold"
                >
                  <LogIn className="w-4 h-4 text-amber-500" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    !isAdminOpen && activeCategory === link.key
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => { handleAdminButtonClick(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 py-2.5 rounded-lg text-sm font-medium"
              >
                <Settings className="w-4 h-4 text-amber-500" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={() => { onOpenQuote({ name: 'General Supply & Transport' }); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Request Price / Get Quote</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
