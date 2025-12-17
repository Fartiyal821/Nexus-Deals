import { MOCK_DEALS } from '../constants';
import { Product } from '../types';

// Removed GoogleGenAI import to eliminate external dependency

export const generatePCAdvice = async (userPrompt: string): Promise<{ text: string, products: Product[] }> => {
  // Simulate "thinking" delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const promptLower = userPrompt.toLowerCase();
  let recommendedProducts: Product[] = [];
  let responseText = "";

  // Basic Keyword Logic to simulate AI recommendations
  if (promptLower.includes('gpu') || promptLower.includes('card') || promptLower.includes('graphics')) {
    recommendedProducts = MOCK_DEALS.filter(p => p.category === 'GPU');
    responseText = "For graphics performance, these GPUs are currently the best value in our inventory. The RTX 4070 Super specifically offers incredible 1440p performance per rupee.";
  } else if (promptLower.includes('cpu') || promptLower.includes('processor')) {
    recommendedProducts = MOCK_DEALS.filter(p => p.category === 'CPU');
    responseText = "The Ryzen 7 7800X3D is arguably the best gaming CPU on the market right now. We have it in stock at a highly competitive price.";
  } else if (promptLower.includes('build') || promptLower.includes('pc')) {
    recommendedProducts = MOCK_DEALS.slice(0, 3); // Return mix
    responseText = "To start your build, you need a strong foundation. I've highlighted a GPU, CPU, and Monitor that pair perfectly together for a high-end experience.";
  } else if (promptLower.includes('storage') || promptLower.includes('ssd')) {
    recommendedProducts = MOCK_DEALS.filter(p => p.category === 'Storage');
    responseText = "Don't bottleneck your system with slow storage. The Samsung 990 PRO is my top recommendation for lightning-fast load times.";
  } else {
    // Default / Fallback
    recommendedProducts = MOCK_DEALS.filter(p => p.rating >= 4.8).slice(0, 3);
    responseText = "I've analyzed our current deals. Based on price-to-performance history, these items represent the best investment right now. Stock is moving fast.";
  }

  // Ensure we always return something if logic misses
  if (recommendedProducts.length === 0) {
     recommendedProducts = MOCK_DEALS.slice(0, 2);
     responseText = "I found these top-rated deals that match high-performance criteria. Check them out before the sale ends.";
  }

  return {
    text: responseText,
    products: recommendedProducts
  };
};