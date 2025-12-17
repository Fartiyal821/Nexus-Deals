import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_DEALS } from '../constants';
import { Product } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    // Safety check: Ensure process.env exists to prevent crashes in some browser environments
    const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
      ? process.env.API_KEY 
      : '';
      
    ai = new GoogleGenAI({ apiKey: apiKey });
  }
  return ai;
};

// Schema for structured recommendation
const productRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    responseText: {
      type: Type.STRING,
      description: "A persuasive, sales-oriented response explaining the recommendations and creating urgency.",
    },
    recommendedProductIds: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of IDs from the available products that match the user's request.",
    },
  },
  required: ["responseText", "recommendedProductIds"],
};

export const generatePCAdvice = async (userPrompt: string): Promise<{ text: string, products: Product[] }> => {
  try {
    const client = getAI();
    
    // Construct a context-aware prompt with our inventory
    const inventoryContext = MOCK_DEALS.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Price: ₹${p.price}, Specs: ${p.features.join(', ')}`
    ).join('\n');

    const systemInstruction = `
      You are Nexus AI, a high-end PC hardware sales consultant.
      Your goal is to CONVERT users into buyers by finding the perfect deal from the Inventory List.
      
      Inventory List:
      ${inventoryContext}
      
      Rules:
      1. AGGRESSIVELY PRIORITIZE items from the Inventory List. If a user asks for a "4090" but we only have a "4070", convince them why the 4070 is the better value choice right now.
      2. CREATE URGENCY. Use phrases like "prices fluctuating", "high demand", or "best value I've seen all week".
      3. HIGHLIGHT SAVINGS. Always mention how much they are saving compared to MSRP.
      4. Be concise, professional, but enthusiastic. Use gamer terminology (FPS, Ray Tracing, 4K) where appropriate.
      5. If no exact match exists, recommend the closest alternative from inventory and explain why it's a "hidden gem".
      6. All prices are in Indian Rupees (₹).
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: productRecommendationSchema,
        temperature: 0.7,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(responseText);
    
    // Map IDs back to full product objects
    const recommendedProducts = data.recommendedProductIds
      .map((id: string) => MOCK_DEALS.find(p => p.id === id))
      .filter((p: Product | undefined): p is Product => p !== undefined);

    return {
      text: data.responseText,
      products: recommendedProducts
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "I'm having trouble connecting to the Nexus mainframe right now. Please check your connection or try again later. (Make sure API Key is set in your environment)",
      products: []
    };
  }
};