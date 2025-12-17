import React, { useState, useEffect } from 'react';
import { Product, Review } from '../types';
import { ShoppingCart, Star, TrendingDown, Clock, ExternalLink, Zap, CheckCircle2, MessageSquare, X, ChevronLeft, ChevronRight, Loader2, Bell, BellRing, Package, Scale, Share2, TrendingUp, AlertTriangle } from 'lucide-react';
import { generateAffiliateLink, formatTimeLeft, fetchProductReviews } from '../services/apiService';
import ShareModal from './ShareModal';

interface DealCardProps {
  product: Product;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (product: Product) => void;
}

const DealCard: React.FC<DealCardProps> = ({ product, isSelectedForCompare, onToggleCompare }) => {
  // Review State
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Alert State
  const [showAlertInput, setShowAlertInput] = useState(false);
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [activeAlert, setActiveAlert] = useState<number | null>(null);

  // Share Modal State
  const [showShareModal, setShowShareModal] = useState(false);

  // AI Prediction Mock
  const [prediction, setPrediction] = useState<'rising' | 'falling' | 'stable'>('stable');

  // Initialize Alert State from LocalStorage
  useEffect(() => {
    const savedAlert = localStorage.getItem(`nexus_alert_${product.id}`);
    if (savedAlert) {
      const parsed = JSON.parse(savedAlert);
      setActiveAlert(parsed.targetPrice);
      setTargetPrice(parsed.targetPrice.toString());
    }

    // Randomize prediction for UI demo
    const preds: ('rising' | 'falling' | 'stable')[] = ['rising', 'stable', 'falling'];
    setPrediction(preds[Math.floor(Math.random() * preds.length)]);
  }, [product.id]);

  // Check Price Alert Logic
  useEffect(() => {
    if (activeAlert !== null) {
      const savedAlertStr = localStorage.getItem(`nexus_alert_${product.id}`);
      const savedAlert = savedAlertStr ? JSON.parse(savedAlertStr) : null;
      
      if (product.price <= activeAlert) {
         const lastNotifiedPrice = sessionStorage.getItem(`nexus_notified_${product.id}`);
         
         if (lastNotifiedPrice !== product.price.toString()) {
            const event = new CustomEvent('price-alert', {
              detail: {
                title: 'Price Drop Alert!',
                message: `${product.name} has dropped to ₹${product.price} (Target: ₹${activeAlert})`,
                type: 'success'
              }
            });
            window.dispatchEvent(event);
            sessionStorage.setItem(`nexus_notified_${product.id}`, product.price.toString());
         }
      }
    }
  }, [product.price, activeAlert, product.id, product.name]);

  const saveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseInt(targetPrice);
    if (!isNaN(price) && price > 0) {
      setActiveAlert(price);
      localStorage.setItem(`nexus_alert_${product.id}`, JSON.stringify({ targetPrice: price }));
      setShowAlertInput(false);
      
      const event = new CustomEvent('price-alert', {
        detail: {
          title: 'Alert Set',
          message: `We'll notify you when price drops below ₹${price}`,
          type: 'info'
        }
      });
      window.dispatchEvent(event);
    }
  };

  const removeAlert = () => {
    setActiveAlert(null);
    localStorage.removeItem(`nexus_alert_${product.id}`);
    sessionStorage.removeItem(`nexus_notified_${product.id}`);
    setShowAlertInput(false);
    setTargetPrice('');
    
    const event = new CustomEvent('price-alert', {
        detail: {
          title: 'Alert Removed',
          message: `Price monitoring disabled for this item.`,
          type: 'info'
        }
      });
      window.dispatchEvent(event);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const affiliateUrl = generateAffiliateLink(product);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleToggleReviews = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showReviews && reviews.length === 0) {
      setLoadingReviews(true);
      setShowReviews(true);
      try {
        const fetchedReviews = await fetchProductReviews(product.name);
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoadingReviews(false);
      }
    } else {
      setShowReviews(!showReviews);
    }
  };

  const nextReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <>
      <div className={`group relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] flex flex-col h-full transform hover:-translate-y-1 ${isSelectedForCompare ? 'border-nexus-accent' : 'border-white/10 hover:border-nexus-accent/50'}`}>
        
        {/* Compare Checkbox - Top Left */}
        {onToggleCompare && (
          <div className="absolute top-0 left-0 z-30 p-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`flex items-center justify-center w-8 h-8 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${
                isSelectedForCompare 
                  ? 'bg-nexus-accent border-nexus-accent text-white' 
                  : 'bg-nexus-900/60 border-white/20 text-slate-400 hover:text-white hover:border-white/50'
              }`}
              title={isSelectedForCompare ? "Remove from Compare" : "Add to Compare"}
            >
              <Scale size={16} />
            </button>
          </div>
        )}

        {/* Retailer Badge */}
        <div className="absolute top-0 right-0 z-20 bg-nexus-900/90 px-3 py-1 rounded-bl-xl border-b border-l border-nexus-700 text-[10px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1 shadow-lg">
          {product.retailer}
          <CheckCircle2 size={10} className="text-nexus-success" />
        </div>

        {/* Discount Badge */}
        {!showReviews && (
          <div className="absolute top-10 left-3 z-10 transition-opacity duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-sm opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <TrendingDown size={14} />
                {discount}% OFF
              </div>
            </div>
          </div>
        )}

        {/* Image / Reviews Container */}
        <div className="h-56 relative bg-nexus-900 overflow-hidden group-hover:bg-nexus-800 transition-colors duration-500">
          
          {/* Placeholder Graphic (No Image) */}
          <div className={`w-full h-full flex items-center justify-center bg-nexus-800 transition-all duration-500 ${showReviews ? 'blur-sm scale-110 opacity-40' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}>
             <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
             <Package size={64} className="text-nexus-700 opacity-30" />
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-nexus-900 via-transparent to-transparent opacity-80" />

          {/* Quick View Button (Only visible when reviews are closed) */}
          {!showReviews && (
            <div className="absolute inset-0 bg-nexus-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
               <span className="text-white font-semibold flex items-center gap-2 border border-white/30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors pointer-events-none">
                  View Specs <ExternalLink size={14} />
               </span>
            </div>
          )}

          {/* Reviews Overlay */}
          {showReviews && (
            <div className="absolute inset-0 bg-nexus-900/80 backdrop-blur-md z-30 flex flex-col p-4 animate-fade-in-up">
              <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                <h4 className="text-sm font-display font-bold text-nexus-accent flex items-center gap-2">
                  <MessageSquare size={14} /> User Reviews
                </h4>
                <button onClick={handleToggleReviews} className="text-slate-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                {loadingReviews ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 size={24} className="animate-spin text-nexus-accent" />
                    <span className="text-xs">Fetching reviews...</span>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="w-full">
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10 min-h-[100px] flex flex-col justify-between relative">
                       <p className="text-xs italic text-slate-300 mb-2 leading-relaxed">"{reviews[currentReviewIndex].content}"</p>
                       
                       <div className="flex justify-between items-end mt-2">
                         <div>
                           <div className="flex text-yellow-400 mb-1">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={8} fill={i < reviews[currentReviewIndex].rating ? "currentColor" : "none"} />
                             ))}
                           </div>
                           <div className="text-[10px] text-slate-500">
                             {reviews[currentReviewIndex].author} • <span className="text-nexus-accent">{reviews[currentReviewIndex].source}</span>
                           </div>
                         </div>
                         <div className="text-[10px] text-slate-600">{reviews[currentReviewIndex].date}</div>
                       </div>
                    </div>

                    {/* Navigation Arrows */}
                    <button 
                      onClick={prevReview}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 p-1 bg-nexus-800 rounded-full text-slate-300 hover:text-white hover:bg-nexus-700 border border-nexus-700 shadow-lg"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button 
                      onClick={nextReview}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 p-1 bg-nexus-800 rounded-full text-slate-300 hover:text-white hover:bg-nexus-700 border border-nexus-700 shadow-lg"
                    >
                      <ChevronRight size={14} />
                    </button>
                    
                    {/* Dots */}
                    <div className="flex justify-center gap-1 mt-2">
                      {reviews.map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-1 h-1 rounded-full transition-all ${idx === currentReviewIndex ? 'bg-nexus-accent w-3' : 'bg-slate-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">No reviews available.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col relative -mt-4 bg-gradient-to-b from-transparent to-nexus-900/50">
          <div className="flex justify-between items-start mb-3 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-wider text-nexus-accent bg-nexus-900/80 px-2 py-1 rounded border border-nexus-accent/20 backdrop-blur-sm">
              {product.category}
            </span>
            
            <div className="flex items-center gap-1.5">
               {/* Share Button */}
               <button
                 onClick={() => setShowShareModal(true)}
                 className="p-1.5 rounded-full border bg-nexus-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-nexus-800 transition-colors"
                 title="Share Deal"
               >
                 <Share2 size={12} />
               </button>

               {/* Price Alert Button */}
               <button
                 onClick={() => setShowAlertInput(!showAlertInput)}
                 className={`p-1.5 rounded-full border transition-all ${
                   activeAlert 
                     ? 'bg-nexus-accent border-nexus-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]' 
                     : 'bg-nexus-900/60 border-white/10 text-slate-400 hover:text-white hover:bg-nexus-800'
                 }`}
                 title="Set Price Alert"
               >
                 {activeAlert ? <BellRing size={12} /> : <Bell size={12} />}
               </button>

               {/* Reviews Toggle Button */}
               <button 
                onClick={handleToggleReviews}
                className={`flex items-center text-xs gap-1 px-2 py-1 rounded-full border backdrop-blur-sm transition-all duration-300 ${
                  showReviews 
                    ? 'bg-nexus-accent text-white border-nexus-accent' 
                    : 'bg-nexus-900/60 text-yellow-400 border-white/5 hover:bg-nexus-800 hover:border-white/20'
                }`}
              >
                <div className="flex">
                  <Star size={10} fill={Math.round(product.rating) >= 4 ? "currentColor" : "none"} />
                </div>
                <span className={showReviews ? "text-white ml-1" : "text-slate-300 ml-1"}>
                  {showReviews ? 'Hide' : `(${product.reviews})`}
                </span>
              </button>
            </div>
          </div>

          <h3 className="font-display font-bold text-lg leading-tight mb-3 line-clamp-2 text-slate-100 group-hover:text-nexus-accent transition-colors drop-shadow-md">
            {product.name}
          </h3>

          {/* Features Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.features.slice(0, 2).map((feat, idx) => (
              <span key={idx} className="text-[10px] text-slate-300 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700/50">
                {feat}
              </span>
            ))}
          </div>
          
          {/* AI Price Prediction - Revenue Driver */}
          {prediction === 'rising' && (
             <div className="flex items-center gap-1.5 mb-3 text-[10px] text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20 w-fit animate-pulse">
                <TrendingUp size={12} />
                <span>AI Prediction: Price Rising Soon</span>
             </div>
          )}

          {/* Countdown Timer */}
          {product.dealEndsIn && (
            <div className="flex items-center gap-2 mb-4 text-xs font-medium text-nexus-accent bg-nexus-accent/10 px-2 py-1.5 rounded-lg border border-nexus-accent/20 w-fit">
              <Clock size={12} className="animate-pulse" />
              Ends in: {formatTimeLeft(product.dealEndsIn)}
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-white/5 relative">
            
            {/* Price Alert Overlay */}
            {showAlertInput && (
              <div className="absolute inset-x-0 bottom-0 top-0 bg-nexus-900/95 backdrop-blur-lg z-20 flex flex-col justify-center animate-fade-in-up p-1 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-nexus-accent flex items-center gap-1">
                    <Bell size={12} /> Set Alert Price
                  </span>
                  <button onClick={() => setShowAlertInput(false)} className="text-slate-500 hover:text-white">
                    <X size={14} />
                  </button>
                </div>
                
                <form onSubmit={saveAlert} className="flex gap-2">
                  <input 
                    type="number" 
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder={product.price.toString()}
                    className="w-full bg-nexus-800 text-white text-sm px-2 py-1 rounded border border-nexus-700 focus:border-nexus-accent focus:outline-none"
                    autoFocus
                  />
                  <button type="submit" className="bg-nexus-accent hover:bg-nexus-accentHover text-white px-3 py-1 rounded text-xs font-bold transition-colors">
                    Set
                  </button>
                </form>
                
                {activeAlert && (
                  <button onClick={removeAlert} className="mt-2 text-[10px] text-red-400 hover:text-red-300 text-center w-full">
                    Remove Active Alert (₹{activeAlert})
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-sm text-slate-500 line-through font-medium">{formatCurrency(product.originalPrice)}</div>
                <div className="text-3xl font-display font-bold text-white flex items-center gap-1">
                  {formatCurrency(product.price)}
                  <span className="text-xs font-sans font-normal text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded ml-2 flex items-center">
                    <Zap size={10} className="mr-0.5" fill="currentColor" /> Live
                  </span>
                </div>
                {activeAlert && (
                   <div className="text-[10px] text-nexus-accent font-medium mt-1 flex items-center gap-1">
                      <BellRing size={10} /> Alert set at ₹{activeAlert}
                   </div>
                )}
              </div>
            </div>

            <a 
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full group/btn overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)] transform hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
              <div className="relative flex items-center justify-center gap-2 rounded-xl bg-nexus-900/90 px-4 py-3 text-white transition-all group-hover/btn:bg-transparent font-bold">
                <ShoppingCart size={18} className="text-yellow-400 group-hover/btn:text-white transition-colors" />
                <span className="tracking-wide group-hover/btn:text-white">BUY NOW @ {product.retailer}</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Share Modal Portal */}
      <ShareModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        product={product} 
      />
    </>
  );
};

export default DealCard;