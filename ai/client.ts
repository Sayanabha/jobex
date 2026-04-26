import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

export const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export const model = genAI?.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    temperature: 0.4,
    responseMimeType: "application/json",
  },
});

export const groqConfig = groqApiKey
  ? {
      apiKey: groqApiKey,
      model: "llama-3.3-70b-versatile",
      baseUrl: "https://api.groq.com/openai/v1/chat/completions",
    }
  : null;
