import React from 'react';
import { createPortal } from 'react-dom';
import { Product } from '../types';
import { X, Twitter, Facebook, Link as LinkIcon, Share2, Check } from 'lucide-react';
import { generateAffiliateLink } from '../services/apiService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
  if (!isOpen) return null;

  const affiliateUrl = generateAffiliateLink(product);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(affiliateUrl);
    
    // Dispatch custom event for toast notification
    const event = new CustomEvent('price-alert', {
      detail: {
        title: 'Link Copied',
        message: 'Product link copied to clipboard.',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
    onClose();
  };

  const handleTwitterShare = () => {
    const text = `Check out this deal: ${product.name} for ₹${product.price}!`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(affiliateUrl)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateUrl)}`, '_blank');
  };

  // Render using Portal to avoid clipping issues with DealCard transforms
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-nexus-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-nexus-900 border border-nexus-700 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
        <div className="p-5 border-b border-nexus-800 flex items-center justify-between">
          <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Share2 size={18} className="text-nexus-accent" />
            Share Deal
          </h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
           {/* Product Preview */}
           <div className="bg-nexus-800/50 rounded-lg p-3 flex items-start gap-3 border border-nexus-700/50">
             <div className="flex-1">
               <p className="text-xs text-nexus-accent font-bold mb-1">{product.retailer}</p>
               <h4 className="text-sm font-medium text-white line-clamp-2 leading-snug">{product.name}</h4>
               <p className="text-sm font-bold text-white mt-1">₹{product.price}</p>
             </div>
           </div>

           {/* Share Actions */}
           <div className="grid grid-cols-1 gap-3">
             <button 
               onClick={handleTwitterShare}
               className="flex items-center justify-center gap-3 w-full p-3 bg-nexus-800 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 border border-nexus-700 rounded-xl transition-all group"
             >
               <Twitter size={20} className="text-[#1DA1F2] group-hover:scale-110 transition-transform" />
               <span className="font-medium">Share on Twitter</span>
             </button>

             <button 
               onClick={handleFacebookShare}
               className="flex items-center justify-center gap-3 w-full p-3 bg-nexus-800 hover:bg-[#4267B2]/20 hover:text-[#4267B2] hover:border-[#4267B2]/50 border border-nexus-700 rounded-xl transition-all group"
             >
               <Facebook size={20} className="text-[#4267B2] group-hover:scale-110 transition-transform" />
               <span className="font-medium">Share on Facebook</span>
             </button>

             <button 
               onClick={handleCopyLink}
               className="flex items-center justify-center gap-3 w-full p-3 bg-nexus-accent hover:bg-nexus-accentHover text-white rounded-xl transition-all shadow-lg shadow-nexus-accent/20"
             >
               <LinkIcon size={20} />
               <span className="font-bold">Copy Link</span>
             </button>
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ShareModal;
