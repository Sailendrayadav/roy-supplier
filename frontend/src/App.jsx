import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupplierData } from './hooks/useSupplierData';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategorySection from './components/CategorySection';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';
import BulkMaterialCard from './components/BulkMaterialCard';
import TransportationCard from './components/TransportationCard';
import EquipmentCard from './components/EquipmentCard';
import QuoteModal from './components/QuoteModal';
import ContactForm from './components/ContactForm';
import AboutSection from './components/AboutSection';
import AdminSection from './components/AdminSection';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import LoadingAnimation from './components/LoadingAnimation';
import BackToTop from './components/BackToTop';
import { api } from './services/api';
import { PackageSearch, AlertCircle, Layers, Truck, HardHat, Wrench } from 'lucide-react';

export default function App() {
  const {
    products,
    services,
    equipment,
    totalResultsCount,
    loading,
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    isQuoteModalOpen,
    selectedItem,
    openQuoteModal,
    closeQuoteModal,
    isAdminOpen,
    setIsAdminOpen
  } = useSupplierData();

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => api.getAuthUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  useEffect(() => {
    // Verify session token on startup
    if (api.getAuthToken()) {
      api.getMe().then(user => {
        if (user) setCurrentUser(user);
        else setCurrentUser(null);
      }).catch(() => {});
    }
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setIsAdminOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col justify-between">
      
      {/* Sticky Header */}
      <Navbar
        onOpenQuote={openQuoteModal}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {/* If Admin Portal is active */}
        {isAdminOpen ? (
          <AdminSection onClose={() => setIsAdminOpen(false)} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onOpenQuote={openQuoteModal}
              setActiveCategory={setActiveCategory}
            />

            {/* Core Categories Visual Breakdown */}
            <CategorySection
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />

            {/* Main Interactive Catalog Section */}
            <section id="catalog-section" className="py-16 bg-slate-950 relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Catalog Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
                  <div>
                    <div className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
                      Explore Stock & Fleet
                    </div>
                    <h2 className="text-3xl font-extrabold text-white font-display">
                      Material, Service & Equipment Catalog
                    </h2>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md">
                    Select any item to request instant plant rates, delivery schedules, or site vehicle chartering.
                  </p>
                </div>

                {/* Filters & Search Control Bar */}
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                  <CategoryFilter
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />
                  
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    totalResults={totalResultsCount}
                  />
                </div>

                {/* Content Display */}
                {loading ? (
                  <LoadingAnimation />
                ) : totalResultsCount === 0 ? (
                  <div className="py-16 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 space-y-3">
                    <PackageSearch className="w-12 h-12 text-slate-500 mx-auto stroke-[1.5]" />
                    <h3 className="text-lg font-bold text-white">No Matching Items Found</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      We couldn't find any materials or equipment matching "{searchTerm}". Try clearing your search or switching categories.
                    </p>
                    <button
                      onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                      className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-12">
                    
                    {/* 1. Construction Materials Grid */}
                    {(activeCategory === 'all' || activeCategory === 'construction-materials') && (
                      <div className="space-y-4">
                        {activeCategory === 'all' && (
                          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-2">
                            <Layers className="w-5 h-5 text-amber-500" />
                            <span>Construction Materials ({products.filter(p => p.type === 'material').length})</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {products.filter(p => p.type === 'material').map(prod => (
                            <ProductCard
                              key={`prod-${prod.id}`}
                              product={prod}
                              onOpenQuote={openQuoteModal}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Transportation & Fleet Grid */}
                    {(activeCategory === 'all' || activeCategory === 'transportation') && (
                      <div className="space-y-4">
                        {activeCategory === 'all' && (
                          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-2 pt-4">
                            <Truck className="w-5 h-5 text-amber-500" />
                            <span>Transportation & Fleet Logistics ({services.length})</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {services.map(srv => (
                            <TransportationCard
                              key={`srv-${srv.id}`}
                              service={srv}
                              onOpenQuote={openQuoteModal}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. Bulk & Road Materials Grid */}
                    {(activeCategory === 'all' || activeCategory === 'bulk-road-materials') && (
                      <div className="space-y-4">
                        {activeCategory === 'all' && (
                          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-2 pt-4">
                            <HardHat className="w-5 h-5 text-amber-500" />
                            <span>Bulk & Road Construction Supplies ({products.filter(p => p.type === 'bulk').length})</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {products.filter(p => p.type === 'bulk').map(bulkItem => (
                            <BulkMaterialCard
                              key={`bulk-${bulkItem.id}`}
                              item={bulkItem}
                              onOpenQuote={openQuoteModal}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 4. Equipment Rental Grid */}
                    {(activeCategory === 'all' || activeCategory === 'equipment') && (
                      <div className="space-y-4">
                        {activeCategory === 'all' && (
                          <div className="flex items-center gap-2 text-base font-bold text-white border-b border-slate-800 pb-2 pt-4">
                            <Wrench className="w-5 h-5 text-amber-500" />
                            <span>Construction Equipment Rental ({equipment.length})</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {equipment.map(eq => (
                            <EquipmentCard
                              key={`eq-${eq.id}`}
                              equipment={eq}
                              onOpenQuote={openQuoteModal}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

              </div>
            </section>

            {/* About Section */}
            <AboutSection />

            {/* Contact Form Section */}
            <ContactForm />
          </>
        )}
      </main>

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={closeQuoteModal}
        selectedItem={selectedItem}
      />

      {/* Authentication Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <Footer
        onOpenQuote={openQuoteModal}
        setActiveCategory={setActiveCategory}
      />

      {/* Back to Top */}
      <BackToTop />
    </div>
  );
}
