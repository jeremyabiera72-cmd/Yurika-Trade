import { GoogleGenAI, Type } from "@google/genai";
import { MarketOutlook } from "@/src/types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIAnalysisResult {
  outlook: MarketOutlook;
  confidence: number;
  insight: string;
  keyLevels: {
    resistance: string[];
    support: string[];
  };
  patterns: string[];
}

export async function analyzeChartImage(base64Image: string): Promise<AIAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(",")[1] || base64Image,
                mimeType: "image/png",
              },
            },
            {
              text: "Analyze this trading chart. Provide a market outlook (bullish, bearish, or neutral), a confidence score (0-100), detailed technical insights, key support and resistance levels, and any detected chart patterns. Respond in JSON format.",
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            outlook: { type: Type.STRING, enum: ["bullish", "bearish", "neutral"] },
            confidence: { type: Type.NUMBER },
            insight: { type: Type.STRING },
            keyLevels: {
              type: Type.OBJECT,
              properties: {
                resistance: { type: Type.ARRAY, items: { type: Type.STRING } },
                support: { type: Type.ARRAY, items: { type: Type.STRING } },
              }
            },
            patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["outlook", "confidence", "insight", "keyLevels", "patterns"]
        },
      },
    });

    const result = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze chart image");
  }
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export async function getDailyTrivia(): Promise<TriviaQuestion> {
  try {
    const today = new Date().toDateString();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Generate a professional technical trading trivia question for ${today}. It should focus on advanced concepts like Smart Money Concepts (SMC), institutional order flow, or complex chart patterns. Provide 4 options, one correct index (0-3), and a brief explanation. Respond in JSON.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "correctIndex", "explanation"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Trivia Error:", error);
    // Fallback question
    return {
      question: "What does a 'Fair Value Gap' (FVG) typically represent in market structure?",
      options: [
        "A period of high volatility with no direction",
        "An inefficiency where price moved too quickly, leaving orders unfilled",
        "A strong support level that will never be broken",
        "The end of a major market cycle"
      ],
      correctIndex: 1,
      explanation: "An FVG occurs when price moves rapidly in one direction, creating a gap between the wicks of the candles before and after it, indicating institutional imbalance."
    };
  }
}

export async function getAIAssistantResponse(query: string, history: { role: string, parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are YurikaTrade AI, an expert technical analyst and trading educator. Your goal is to help users understand market structure, technical indicators, and price action. You provide analysis and educational insights only. This platform does not provide financial advice or execute trades. Be professional, clear, and encouraging. Use technical terms but explain them for beginners when appropriate.",
    },
    // Note: SDK might expect a different history format depending on version, 
    // but the @google/genai guidelines say use sendMessageStream or generateContent.
  });

  // Sending message
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history.map(h => ({ role: h.role, parts: h.parts })), { role: "user", parts: [{ text: query }] }],
  });

  return result.text;
}
