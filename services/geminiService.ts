
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY}); and directly access process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseVoiceCommand = async (text: string): Promise<Partial<FinancialData>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `قم بتحليل النص التالي واستخرج القيم المالية المتعلقة بـ (المخزون، الدخل، المصاريف، الأجور، الديون لنا، الديون علينا، السيولة). 
      النص: "${text}"
      أرجع النتيجة بصيغة JSON فقط بالأسماء التالية:
      inventory, income, expenses, wages, debtsToUs, debtsByUs, liquidity.
      إذا لم يذكر الحقل، اتركه فارغاً.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            inventory: { type: Type.NUMBER },
            income: { type: Type.NUMBER },
            expenses: { type: Type.NUMBER },
            wages: { type: Type.NUMBER },
            debtsToUs: { type: Type.NUMBER },
            debtsByUs: { type: Type.NUMBER },
            liquidity: { type: Type.NUMBER },
          }
        }
      }
    });

    // Access the .text property directly as it is a getter, not a method.
    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return {};
  }
};
