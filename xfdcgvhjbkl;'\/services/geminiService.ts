
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = transactions.map(t => `${t.date}: ${t.type === 'income' ? '+' : '-'}R${t.amount} (${t.category} - ${t.description})`).join('\n');

  const prompt = `
    As a professional financial advisor, analyze the following transactions (amounts in South African Rand, R) from the last month and provide a concise (max 100 words), encouraging, and actionable piece of advice. 
    Look for patterns in spending or ways to optimize.

    Transactions:
    ${summary}

    Format the response as a friendly paragraph.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Keep up the great work tracking your finances in Rand! You're on the right path.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Start tracking more transactions to get personalized AI financial insights!";
  }
};
