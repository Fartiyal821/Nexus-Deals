import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DealCard from './components/DealCard';
import AIAssistant from './components/AIAssistant';
import ComparisonView from './components/ComparisonView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MOCK_DEALS, CATEGORIES } from './constants';
import { ViewState, Product } from './types';
import { Search, Filter, Loader2, Scale, Timer } from 'lucide-react';
import { fetchLivePrices } from './services/apiService';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Banner State
  const [showBanner, setShowBanner] = useState(true);

  // Toast Handler
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Social Proof Simulation (Fake purchases to drive urgency)
  useEffect(() => {
    const names = ['Rahul', 'Aditya', 'Sneha', 'Vikram', 'Priya', 'Amit'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune'];
    const actions = ['just bought', 'just ordered', 'snagged a deal on'];

    const socialProofInterval = setInterval(() => {
      // Only show if user is idle/viewing deals
      if (Math.random() > 0.7 && products.length > 0) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];

        addToast(
          "New Purchase Verified", 
          `${randomName} from ${randomCity} ${action} ${randomProduct.name.substring(0, 20)}...`, 
          "success"
        );
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(socialProofInterval);
  }, [products]);

  // Listen for custom price alert events
  useEffect(() => {
    const handlePriceAlert = (event: CustomEvent<{ title: string; message: string; type: 'success' | 'info' | 'warning' }>) => {
      addToast(event.detail.title, event.detail.message, event.detail.type);
    };

    window.addEventListener('price-alert' as any, handlePriceAlert);
    return () => {
      window.removeEventListener('price-alert' as any, handlePriceAlert);
    };
  }, []);

  // Load data initially and then every 30 seconds
  useEffect(() => {
    const loadData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      
      // Fetch fresh data
      const liveData = await fetchLivePrices(MOCK_DEALS);
      setProducts(liveData);
      
      if (isInitial) setLoading(false);
    };

    // Initial fetch
    loadData(true);

    // Set up 30-second interval
    const intervalId = setInterval(() => {
      loadData(false); // Background update, don't trigger full loading screen
    }, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle Comparison Toggle
  const handleToggleCompare = (product: Product) => {
    setCompareList(prev => {
      // Check if already in list
      const exists = prev.find(p => p.id === product.id);
      
      if (exists) {
        // Remove if exists
        return prev.filter(p => p.id !== product.id);
      } else {
        // Add if not exists (check limit)
        if (prev.length >= 4) {
           addToast("Comparison Limit Reached", "You can compare up to 4 items at a time.", "warning");
           return prev;
        }
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const filteredDeals = products.filter(deal => {
    const matchesCategory = selectedCategory === 'All' || deal.category === selectedCategory;
    const matchesSearch = deal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderContent = () => {
    switch (currentView) {
      case ViewState.AI_BUILDER:
        return (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <AIAssistant />
          </main>
        );
      case ViewState.COMPARE:
        return (
          <main className="min-h-screen bg-nexus-900 animate-fade-in-up">
            <ComparisonView 
              products={compareList} 
              onRemove={removeFromCompare}
              onBack={() => setCurrentView(ViewState.HOME)}
            />
          </main>
        );
      case ViewState.HOME:
      default:
        return (
          <>
            <Hero onStartBuilding={() => setCurrentView(ViewState.AI_BUILDER)} />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Filters & Search */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 sticky top-20 z-40 bg-nexus-900/80 backdrop-blur-xl p-4 -mx-4 md:mx-0 rounded-2xl border border-nexus-700/50 shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === cat 
                          ? 'bg-nexus-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] transform scale-105' 
                          : 'bg-nexus-800 text-slate-400 hover:bg-nexus-700 hover:text-white border border-transparent hover:border-nexus-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search parts (e.g., 4070 Ti)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-nexus-800/50 text-white pl-10 pr-4 py-2.5 rounded-lg border border-nexus-700 focus:outline-none focus:border-nexus-accent focus:ring-1 focus:ring-nexus-accent transition-all placeholder-slate-600"
                  />
                </div>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 size={48} className="text-nexus-accent animate-spin mb-4" />
                  <h3 className="text-xl font-display font-bold text-white">Fetching Live Deals...</h3>
                  <p className="text-slate-500">Connecting to Amazon, Flipkart, Newegg APIs</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map(deal => (
                      <DealCard 
                        key={deal.id} 
                        product={deal} 
                        onToggleCompare={handleToggleCompare}
                        isSelectedForCompare={compareList.some(p => p.id === deal.id)}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20 text-slate-500 bg-nexus-800/20 rounded-2xl border border-nexus-800 border-dashed">
                      <Filter size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No deals found matching your criteria.</p>
                      <button onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className="mt-4 text-nexus-accent hover:underline">
                        Reset Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-20 border-t border-nexus-800 pt-10 text-center text-slate-500 text-sm">
                <p>© 2024 Nexus PC Deals. Data refreshes every 30 seconds.</p>
                <div className="flex justify-center gap-4 mt-4 text-xs opacity-60">
                   <span>Amazon Associate</span>
                   <span>•</span>
                   <span>Flipkart Partner</span>
                   <span>•</span>
                   <span>Newegg Affiliate</span>
                </div>
                <p className="mt-2 max-w-2xl mx-auto">
                  Disclaimer: Prices and availability are accurate as of the date/time indicated and are subject to change. 
                  Any price and availability information displayed on the linked site at the time of purchase will apply to the purchase of this product.
                </p>
              </div>
            </main>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-nexus-900 text-white font-sans selection:bg-nexus-accent selection:text-white overflow-x-hidden">
      
      {/* Flash Sale Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-[length:200%_100%] animate-[shimmer_5s_linear_infinite] text-white text-xs font-bold py-2 px-4 text-center relative z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
             <Timer size={14} className="animate-pulse" />
             <span>FLASH SALE: EXTRA 15% OFF SELECTED GPUS - ENDS IN 2:45:00</span>
             <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">✕</button>
          </div>
        </div>
      )}

      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {renderContent()}

      {/* Floating Compare Action Bar */}
      {compareList.length > 0 && currentView !== ViewState.COMPARE && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
           <button 
             onClick={() => setCurrentView(ViewState.COMPARE)}
             className="bg-nexus-accent hover:bg-nexus-accentHover text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)] font-bold flex items-center gap-2 border border-white/20 transition-all hover:scale-105"
           >
             <Scale size={20} />
             Compare ({compareList.length}) Products
           </button>
        </div>
      )}
    </div>
  );
}

export default App;