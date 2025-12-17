import { Product, Review } from '../types';

/**
 * MONETIZATION CONFIGURATION
 * Replace these with your actual affiliate IDs to start earning commissions.
 */
const AFFILIATE_IDS = {
  amazon: 'nexus-deals-20', // Replace with your Amazon Associates Tag
  flipkart: 'nexus-aff-id', // Replace with your Flipkart Affiliate ID
  newegg: '7843222',        // Replace with Newegg ID
  bestbuy: 'bby-123'
};

/**
 * Simulates fetching live data from Amazon/Flipkart APIs.
 */
export const fetchLivePrices = async (products: Product[]): Promise<Product[]> => {
  // Simulate network delay for "Real-time" feel
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

  return products.map(product => {
    // Logic: Randomly fluctuate price slightly to simulate "Live Market"
    const randomFluctuation = Math.random() > 0.7 ? (Math.random() * 50 - 25) : 0;
    const newPrice = Number((product.price + randomFluctuation).toFixed(0));

    return {
      ...product,
      price: newPrice,
      lastChecked: Date.now(),
      affiliateLink: generateAffiliateLink(product)
    };
  });
};

/**
 * Generates the money-making URL by appending affiliate tags.
 */
export const generateAffiliateLink = (product: Product): string => {
  if (product.affiliateLink) return product.affiliateLink;

  const baseUrl = product.url;

  if (product.retailer === 'Amazon') {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}tag=${AFFILIATE_IDS.amazon}`;
  }
  if (product.retailer === 'Flipkart') {
    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}affid=${AFFILIATE_IDS.flipkart}`;
  }
  
  return baseUrl;
};

export const formatTimeLeft = (endTime: number) => {
  const diff = endTime - Date.now();
  if (diff <= 0) return "Expired";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

/**
 * Simulates fetching reviews from the retailer API.
 */
export const fetchProductReviews = async (productName: string): Promise<Review[]> => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Network delay

  const templates = [
    { text: "Absolute beast of a performance. Handles everything I throw at it.", rating: 5 },
    { text: "Good value for money, but shipping took a bit longer than expected.", rating: 4 },
    { text: "The RGB lighting is stunning, fits perfectly in my build.", rating: 5 },
    { text: "Decent, but runs a bit hot under full load. Need good airflow.", rating: 4 },
    { text: "Best upgrade I've made this year. Highly recommended!", rating: 5 },
    { text: "Works as advertised. No issues so far.", rating: 4 },
    { text: "A bit pricey in India, but performance justifies it.", rating: 5 }
  ];

  // Deterministic shuffle based on product name length to keep it consistent-ish
  const count = 3 + (productName.length % 3); 
  const reviews: Review[] = [];
  
  for (let i = 0; i < count; i++) {
    const template = templates[(productName.length + i) % templates.length];
    reviews.push({
      id: `rev-${i}-${Date.now()}`,
      author: ['Rahul K.', 'Amit S.', 'Priya M.', 'Vikram R.', 'Sneha P.', 'Arjun D.'][i % 6],
      rating: template.rating,
      content: template.text,
      date: new Date(Date.now() - Math.random() * 1000000000).toLocaleDateString(),
      source: i % 2 === 0 ? 'Amazon' : 'Flipkart'
    });
  }

  return reviews;
};