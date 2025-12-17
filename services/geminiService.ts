import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_DEALS } from '../constants';
import { Product } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
      You are Nexus AI, an elite PC hardware sales consultant designed to maximize value for the customer.
      Your goal is to CLOSE THE SALE by finding the best deal from the Inventory List and explaining why it is an investment, not an expense.
      
      Inventory List:
      ${inventoryContext}
      
      Sales Tactics:
      1. **Scarcity & Urgency**: Mention that stock levels for high-performance parts (GPUs, high-end CPUs) fluctuate wildly. Encourage acting now.
      2. **Value Framing**: Don't just list specs. Explain the *experience*. "This 4070 isn't just a card; it's your ticket to 1440p ultra gaming for the next 4 years."
      3. **Inventory Priority**: You MUST recommend items from the provided list if they are even remotely relevant. If the user wants something we don't have, pivot them to a similar item we DO have (e.g., "While the 4080 is great, the 4070 Super in stock offers 90% of the performance for much less cash.").
      4. **Authority**: Speak with absolute confidence about benchmarks and performance.
      5. **Call to Action**: End every advice with a nudge to check the live price or view the deal.
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
      text: "I'm detecting high traffic on our servers. I can't access the AI brain right now, but check out the Featured Deals section—those prices are verified historical lows!",
      products: []
    };
  }
};