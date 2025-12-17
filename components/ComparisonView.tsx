import React from 'react';
import { Product } from '../types';
import { X, CheckCircle2, ShoppingCart, ArrowLeft, Package, Zap } from 'lucide-react';
import { generateAffiliateLink } from '../services/apiService';

interface ComparisonViewProps {
  products: Product[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ products, onRemove, onBack }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <Package size={64} className="text-nexus-700 mb-4" />
        <h2 className="text-2xl font-display font-bold text-white mb-2">No items to compare</h2>
        <p className="text-slate-400 mb-6">Select products from the home page to compare them here.</p>
        <button 
          onClick={onBack}
          className="px-6 py-2 bg-nexus-accent hover:bg-nexus-accentHover text-white rounded-lg transition-colors"
        >
          Browse Deals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full bg-nexus-800 hover:bg-nexus-700 text-slate-300 hover:text-white transition-colors border border-nexus-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-display font-bold text-white">Compare Products</h2>
      </div>

      <div className="overflow-x-auto pb-6">
        <div className="min-w-[800px]">
          <div className="grid" style={{ gridTemplateColumns: `200px repeat(${products.length}, minmax(280px, 1fr))` }}>
            
            {/* Header Row (Images & Names) */}
            <div className="p-4 flex flex-col justify-end text-slate-400 font-medium text-sm">
              Product Details
            </div>
            {products.map(product => (
              <div key={product.id} className="relative p-6 bg-nexus-800/30 border-r border-nexus-700 first:rounded-tl-2xl last:rounded-tr-2xl last:border-r-0 flex flex-col items-center text-center">
                <button 
                  onClick={() => onRemove(product.id)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition-colors"
                  title="Remove from comparison"
                >
                  <X size={18} />
                </button>
                
                <div className="w-32 h-32 bg-nexus-900 rounded-lg flex items-center justify-center mb-4 border border-nexus-700 overflow-hidden">
                   {/* Placeholder Graphic */}
                   <Package size={40} className="text-nexus-700 opacity-50" />
                </div>
                
                <div className="text-xs uppercase tracking-wider text-nexus-accent font-bold mb-2">{product.category}</div>
                <h3 className="font-bold text-white leading-tight mb-2 h-12 overflow-hidden line-clamp-2">{product.name}</h3>
                
                <a 
                  href={generateAffiliateLink(product)}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-nexus-accent hover:bg-nexus-accentHover text-white py-2 rounded-lg text-sm font-bold transition-colors"
                >
                  <ShoppingCart size={14} /> Buy Now
                </a>
              </div>
            ))}

            {/* Price Row */}
            <div className="p-4 bg-nexus-900/50 border-t border-nexus-700 text-slate-300 font-medium flex items-center">
              Price
            </div>
            {products.map(product => (
              <div key={`price-${product.id}`} className="p-4 bg-nexus-900/50 border-t border-r border-nexus-700 last:border-r-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold text-white">{formatCurrency(product.price)}</div>
                <div className="text-sm text-slate-500 line-through">{formatCurrency(product.originalPrice)}</div>
              </div>
            ))}

            {/* Retailer Row */}
            <div className="p-4 border-t border-nexus-700 text-slate-300 font-medium flex items-center">
              Retailer
            </div>
            {products.map(product => (
              <div key={`retailer-${product.id}`} className="p-4 border-t border-r border-nexus-700 last:border-r-0 flex items-center justify-center">
                <span className="flex items-center gap-2 bg-nexus-800 px-3 py-1 rounded-full text-sm text-slate-200 border border-nexus-700">
                  {product.retailer} <CheckCircle2 size={12} className="text-green-500" />
                </span>
              </div>
            ))}

             {/* Rating Row */}
             <div className="p-4 bg-nexus-900/50 border-t border-nexus-700 text-slate-300 font-medium flex items-center">
              Rating
            </div>
            {products.map(product => (
              <div key={`rating-${product.id}`} className="p-4 bg-nexus-900/50 border-t border-r border-nexus-700 last:border-r-0 flex flex-col items-center justify-center">
                <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
                  {product.rating} <span className="text-xs font-normal text-slate-500">/ 5</span>
                </div>
                <div className="text-xs text-slate-500">{product.reviews} reviews</div>
              </div>
            ))}

            {/* Features Row */}
            <div className="p-4 border-t border-nexus-700 text-slate-300 font-medium flex items-center">
              Key Features
            </div>
            {products.map(product => (
              <div key={`features-${product.id}`} className="p-4 border-t border-r border-nexus-700 last:border-r-0 last:rounded-br-2xl flex flex-col gap-2">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <Zap size={12} className="text-nexus-accent flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;