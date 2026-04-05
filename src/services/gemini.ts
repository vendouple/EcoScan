import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const analyzeWater = async (imageData: string) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as an environmental scientist specializing in water quality. 
    Analyze this image for visual indicators of water quality risks.
    Look for:
    - Turbidity (cloudiness)
    - Algal blooms (green/blue-green surface)
    - Debris or pollution
    - Discoloration
    - Oil sheens
    
    Provide a structured response in JSON format:
    {
      "score": number (0-100, where 100 is pristine and 0 is critical risk),
      "risks": string[],
      "observations": string,
      "recommendations": string[]
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
};

export const identifyPlant = async (imageData: string) => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as a botanist. Identify the plant species in this image.
    Provide details about its common name, scientific name, habitat, and conservation status.
    
    Provide a structured response in JSON format:
    {
      "commonName": string,
      "scientificName": string,
      "family": string,
      "habitat": string,
      "conservationStatus": string,
      "description": string,
      "funFact": string,
      "isPoisonous": boolean,
      "warning": string (only if isPoisonous is true, otherwise empty)
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageData.split(',')[1] } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text || "{}");
};
