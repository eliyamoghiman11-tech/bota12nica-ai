import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

export const identifyPlant = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: `Identify this plant. Provide the common name, scientific name, and detailed care instructions formatted in clear Markdown. Include sections for Water, Sunlight, Soil, and Hardiness Zone. Keep the tone helpful and encouraging for a gardener.`,
          },
        ],
      },
    });

    return response.text || "Could not identify the plant. Please try another image.";
  } catch (error) {
    console.error("Error identifying plant:", error);
    throw new Error("Failed to analyze image. Please check your API key and try again.");
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: "You are an expert botanist and gardening assistant named 'Sprout'. You are helpful, friendly, and knowledgeable about all types of plants, gardening techniques, pests, and plant care. Answer questions concisely but thoroughly. If you don't know the answer, admit it and suggest where to look.",
    },
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({
      message: message,
    });
    return response.text || "I'm having trouble thinking right now.";
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message.");
  }
};
