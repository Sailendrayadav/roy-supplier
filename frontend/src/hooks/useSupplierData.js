import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useSupplierData() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Admin View state
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [catsData, prodsData, servsData, eqData] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getServices(),
        api.getEquipment()
      ]);
      setCategories(catsData);
      setProducts(prodsData);
      setServices(servsData);
      setEquipment(eqData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  const openQuoteModal = (item) => {
    setSelectedItem(item);
    setIsQuoteModalOpen(true);
  };

  const closeQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setSelectedItem(null);
  };

  // Filtered Items logic
  const searchLower = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter(p => {
    const matchCategory = activeCategory === 'all' || 
                          (activeCategory === 'construction-materials' && p.type === 'material') ||
                          (activeCategory === 'bulk-road-materials' && p.type === 'bulk');
    const matchSearch = !searchLower || 
                        p.name.toLowerCase().includes(searchLower) ||
                        (p.name_np && p.name_np.toLowerCase().includes(searchLower)) ||
                        p.description.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const filteredServices = services.filter(s => {
    const matchCategory = activeCategory === 'all' || activeCategory === 'transportation';
    const matchSearch = !searchLower || 
                        s.name.toLowerCase().includes(searchLower) ||
                        s.description.toLowerCase().includes(searchLower) ||
                        s.service_type.toLowerCase().includes(searchLower);
    return matchCategory && matchSearch;
  });

  const filteredEquipment = equipment.filter(e => {
    const matchCategory = activeCategory === 'all' || activeCategory === 'equipment';
    const matchSearch = !searchLower || 
                        e.name.toLowerCase().includes(searchLower) ||
                        e.description.toLowerCase().includes(searchLower) ||
                        (e.specs && e.specs.toLowerCase().includes(searchLower));
    return matchCategory && matchSearch;
  });

  const totalResultsCount = (activeCategory === 'all' || activeCategory === 'construction-materials' || activeCategory === 'bulk-road-materials' ? filteredProducts.length : 0) +
                            (activeCategory === 'all' || activeCategory === 'transportation' ? filteredServices.length : 0) +
                            (activeCategory === 'all' || activeCategory === 'equipment' ? filteredEquipment.length : 0);

  return {
    categories,
    products: filteredProducts,
    services: filteredServices,
    equipment: filteredEquipment,
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
    setIsAdminOpen,
    refreshData: loadAllData
  };
}
