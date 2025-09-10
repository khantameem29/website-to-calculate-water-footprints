
import { GoogleGenAI, Type } from "@google/genai";
import type { WaterFootprintData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: {
      type: Type.STRING,
      description: "The name of the item, properly capitalized.",
    },
    waterFootprintLiters: {
      type: Type.NUMBER,
      description: "The total water footprint in liters.",
    },
    comparison: {
      type: Type.STRING,
      description: "A simple, relatable comparison to help visualize this amount of water (e.g., equivalent to X number of 8-minute showers).",
    },
    breakdown: {
      type: Type.ARRAY,
      description: "An array of objects showing the breakdown of water usage into 2-4 key stages.",
      items: {
        type: Type.OBJECT,
        properties: {
          stage: {
            type: Type.STRING,
            description: "The name of the production stage (e.g., 'Growing Cotton', 'Manufacturing')."
          },
          liters: {
            type: Type.NUMBER,
            description: "The amount of water in liters for this stage."
          },
        },
        required: ["stage", "liters"],
      },
    },
  },
  required: ["itemName", "waterFootprintLiters", "comparison", "breakdown"],
};

export const calculateWaterFootprint = async (itemName: string): Promise<WaterFootprintData> => {
  const prompt = `You are an expert environmental scientist specializing in water footprint analysis.
Your task is to calculate the approximate water footprint for a given daily use item.

The user has provided the item: "${itemName}".

You must provide the total water footprint in liters.
You must also provide a simple, relatable comparison to help visualize this amount of water.
Additionally, provide a simple breakdown of the water usage into 2-4 key stages (e.g., growing raw materials, manufacturing, transport).

Respond ONLY with a valid JSON object that strictly adheres to the provided schema. Do not include any extra text or markdown formatting.
`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    // The Gemini API with responseSchema should return a valid JSON string.
    const data = JSON.parse(jsonText);
    
    // Validate that the breakdown is not empty
    if (!data.breakdown || data.breakdown.length === 0) {
        throw new Error("Received an incomplete data structure from the API.");
    }

    return data as WaterFootprintData;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to calculate water footprint. The AI model may be unable to process this item or is currently unavailable.");
  }
};
