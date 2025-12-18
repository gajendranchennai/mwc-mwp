import { GoogleGenAI, Type } from "@google/genai";
import { BudgetItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithAssistant = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
) => {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: "You are a professional, warm, and helpful wedding planner assistant named 'Bella'. Help the user with wedding etiquette, ideas, vows, and planning advice. Keep responses concise but friendly.",
    },
  });

  return await chat.sendMessageStream({ message });
};

export const generateBudgetBreakdown = async (totalBudget: number, guestCount: number, location: string): Promise<BudgetItem[]> => {
  const prompt = `
    Create a detailed wedding budget breakdown for a total budget of ₹${totalBudget} (Indian Rupees) for ${guestCount} guests in ${location}.
    Return a JSON array of budget items. 
    IMPORTANT: Keep 'category' names short (max 2-3 words) to fit in charts.
    Each item should have a category and an estimated cost.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            estimated: { type: Type.NUMBER },
          },
          required: ["category", "estimated"],
        },
      },
    },
  });

  if (response.text) {
    const rawData = JSON.parse(response.text);
    return rawData.map((item: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      category: item.category,
      estimated: item.estimated,
      actual: 0,
      paid: 0,
    }));
  }
  return [];
};

export const generateInspirationImage = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using flash-image for speed and efficiency
      contents: {
        parts: [{ text: `High quality, photorealistic, wedding inspiration: ${prompt}` }],
      },
      config: {
        // No specific imageConfig needed for flash-image basics unless aspect ratio is critical
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};