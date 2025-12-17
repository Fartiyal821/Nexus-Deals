import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DealCard from './components/DealCard';
import AIAssistant from './components/AIAssistant';
import ComparisonView from './components/ComparisonView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { MOCK_DEALS, CATEGORIES } from './constants';
import { ViewState, Product } from './types';
import { Search, Filter, Loader2, Scale, Timer, X, TrendingUp, AlertCircle, Crown, ShoppingBag, Users } from 'lucide-react';
import { fetchLivePrices } from './services/apiService';

interface Activity {
  id: string;
  text: string;
  time: string;
  type: 'purchase' | 'viewing';
}

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Comparison State
  const [compareList, setCompareList] = useState<Product[]>([]);

  // Banner & Popup State
  const [showBanner, setShowBanner] = useState(true);
  const [showPromoPopup, setShowPromoPopup] = useState(false);

  // Toast Handler
  const addToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Social Proof & Stock Urgency Simulation
  useEffect(() => {
    const names = ['Rahul', 'Aditya', 'Sneha', 'Vikram', 'Priya', 'Amit', 'Anjali', 'Karan'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai'];
    const actions = ['just bought', 'just ordered', 'snagged a deal on', 'saved ₹5000 on'];

    const socialProofInterval = setInterval(() => {
      // 30% chance to show a "Low Stock" warning instead of a purchase
      if (Math.random() > 0.6 && products.length > 0) {
        if (Math.random() > 0.4) {
            // Purchase Notification
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const randomName = names[Math.floor(Math.random() * names.length)];
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const action = actions[Math.floor(Math.random() * actions.length)];
            const message = `${randomName} from ${randomCity} ${action} ${randomProduct.name.substring(0, 25)}...`;

            addToast("New Purchase Verified", message, "success");
            
            // Add to activity feed
            setActivities(prev => [{
              id: Date.now().toString(),
              text: message,
              time: 'Just now',
              type: 'purchase' as const
            }, ...prev].slice(0, 5));

        } else {
            // Low Stock Warning (FOMO)
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const stockLeft = Math.floor(Math.random() * 4) + 1;
            const message = `Only ${stockLeft} units left of ${randomProduct.name.substring(0, 20)}...`;
            
            addToast("High Demand Alert", `${message} 14 people viewing this.`, "warning");

             // Add to activity feed
             setActivities(prev => [{
              id: Date.now().toString(),
              text: `${message} 14 viewing.`,
              time: 'Just now',
              type: 'viewing' as const
            }, ...prev].slice(0, 5));
        }
      }
    }, 8000); // slightly faster updates for the feed

    return () => clearInterval(socialProofInterval);
  }, [products]);

  // Promo Popup Logic
  useEffect(() => {
    const timer = setTimeout(() => {
       setShowPromoPopup(true);
    }, 5000); // Show popup after 5 seconds
    return () => clearTimeout(timer);
  }, []);

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
      
      try {
        // Fetch fresh data
        const liveData = await fetchLivePrices(MOCK_DEALS);
        
        // Sort logic: High ticket items (GPUs, CPUs) first to maximize affiliate revenue
        const sortedData = [...liveData].sort((a, b) => {
           if (a.category === 'GPU' && b.category !== 'GPU') return -1;
           if (a.category !== 'GPU' && b.category === 'GPU') return 1;
           return b.price - a.price; // Higher price first
        });
        
        setProducts(sortedData);
      } catch (error) {
        console.error("Error loading deals:", error);
        // Fallback to mock if API fails
        setProducts(MOCK_DEALS);
      } finally {
        if (isInitial) setLoading(false);
      }
    };

    // Initial fetch
    loadData(true);

    const intervalId = setInterval(() => {
      loadData(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle Comparison Toggle
  const handleToggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
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
                <>
                {/* Featured / Trending Header & Live Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                  <div className="lg:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                       <Crown className="text-nexus-gold" size={24} />
                       <h2 className="text-2xl font-display font-bold text-white">Trending High-Yield Deals</h2>
                    </div>
                    <p className="text-slate-400">
                      Top-rated hardware with the deepest discounts right now. 
                      <span className="text-nexus-accent ml-1 font-medium">Updated 14s ago.</span>
                    </p>
                  </div>

                  {/* Live Activity Feed */}
                  <div className="bg-nexus-800/40 border border-nexus-700/50 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-nexus-success uppercase tracking-wider">
                         <div className="w-2 h-2 rounded-full bg-nexus-success animate-pulse"/>
                         Live Market Activity
                      </div>
                      <span className="text-[10px] text-slate-500">Real-time</span>
                    </div>
                    <div className="space-y-3 max-h-[120px] overflow-hidden relative">
                       {activities.length > 0 ? (
                         activities.map((activity, idx) => (
                           <div key={activity.id} className={`flex items-start gap-3 text-sm animate-slide-in ${idx === 0 ? 'opacity-100' : 'opacity-70'}`}>
                              <div className={`mt-1 p-1 rounded-full ${activity.type === 'purchase' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                 {activity.type === 'purchase' ? <ShoppingBag size={10} /> : <Users size={10} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="text-slate-200 text-xs truncate leading-tight">{activity.text}</p>
                                 <p className="text-[10px] text-slate-500 mt-0.5">{activity.time}</p>
                              </div>
                           </div>
                         ))
                       ) : (
                         <div className="text-center py-4 text-xs text-slate-500 italic flex items-center justify-center gap-2">
                            <Loader2 size={12} className="animate-spin" />
                            Connecting to purchase stream...
                         </div>
                       )}
                       {/* Fade overlay for bottom of list */}
                       <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-nexus-900/50 to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>

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
                </>
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
             <span className="uppercase tracking-wide">FLASH SALE: GPU PRICES DROPPED 15% - ENDS IN 01:24:00</span>
             <button onClick={() => setShowBanner(false)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">✕</button>
          </div>
        </div>
      )}

      {/* Limited Time Promo Popup */}
      {showPromoPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowPromoPopup(false)} />
          <div className="relative bg-gradient-to-br from-nexus-900 to-nexus-800 border-2 border-nexus-gold rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-bounce-slow">
            <button onClick={() => setShowPromoPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X size={24} />
            </button>
            <div className="inline-block p-3 rounded-full bg-nexus-gold/20 text-nexus-gold mb-4 animate-pulse">
               <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Price Hike Incoming!</h2>
            <p className="text-slate-300 mb-6">
              Our AI predicts a <span className="text-red-400 font-bold">12% price increase</span> on RTX 40-Series cards in the next 4 hours.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                onClick={() => setShowPromoPopup(false)}
                className="w-full py-4 bg-nexus-gold hover:bg-nexus-goldHover text-black font-bold rounded-xl transition-all hover:scale-105 shadow-lg uppercase tracking-wide"
                >
                Lock In Current Prices
                </button>
                <div className="flex items-center justify-center gap-1 text-[10px] text-orange-400 font-medium">
                    <TrendingUp size={12} />
                    <span className="animate-pulse">842 people viewing these deals right now</span>
                </div>
            </div>
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