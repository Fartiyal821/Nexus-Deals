import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_DEALS } from '../constants';
import { Product } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

// Schema for structured recommendation
const productRecommendationSchema = {
  type: Type.OBJECT,
  properties: {
    responseText: {
      type: Type.STRING,
      description: "A helpful, conversational response explaining the recommendations.",
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
      You are Nexus AI, an elite PC hardware expert and sales assistant. 
      Your goal is to help users find the best PC parts for their budget and needs using the provided inventory list.
      
      Inventory List:
      ${inventoryContext}
      
      Rules:
      1. Always prioritize items from the Inventory List if they match.
      2. If the user asks for something not in inventory, explain general advice but try to steer them to similar in-stock items.
      3. Be enthusiastic, use "gamer" terminology appropriately (FPS, 4K, ray tracing, bottlenecks).
      4. Keep responses concise but informative.
      5. All prices are in Indian Rupees (₹).
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
      text: "I'm having trouble connecting to the Nexus mainframe right now. Please check your connection or try again later. (Make sure API Key is set)",
      products: []
    };
  }
};