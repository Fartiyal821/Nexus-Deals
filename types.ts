export interface Product {
  id: string;
  name: string;
  category: 'GPU' | 'CPU' | 'RAM' | 'Storage' | 'Monitor' | 'Case' | 'PSU' | 'Mouse' | 'Keyboard';
  price: number;
  originalPrice: number;
  image: string;
  retailer: 'Amazon' | 'Newegg' | 'BestBuy' | 'Flipkart';
  rating: number;
  reviews: number;
  url: string;
  features: string[];
  lastChecked?: number; // Timestamp for "Live" status
  dealEndsIn?: number; // Timestamp for countdown
  affiliateLink?: string; // The money-making link
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  source: 'Amazon' | 'Flipkart' | 'Newegg' | 'Verified Buyer';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendedProducts?: Product[];
  timestamp: number;
}

export enum ViewState {
  HOME = 'HOME',
  AI_BUILDER = 'AI_BUILDER',
  COMPARE = 'COMPARE',
}