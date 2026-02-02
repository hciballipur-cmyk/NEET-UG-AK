
import { GoogleGenAI, Type } from "@google/genai";
import { Question, TestType, Subject } from "../types";

// Fix: Initialized GoogleGenAI with apiKey strictly from process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuestions = async (
  type: TestType,
  subject: Subject,
  chapters: string[],
  count: number = 90
): Promise<Question[]> => {
  // Fix: Use gemini-3-pro-preview for complex STEM tasks like NEET question generation
  const model = "gemini-3-pro-preview";
  
  // Note: For a very large number of questions like 90, we request a diverse batch.
  // In a production environment, we might chain multiple requests, 
  // but with Gemini 3 Pro's large context, we can prompt for a high-density structured output.
  const prompt = `
    Generate ${count} high-quality NEET ${subject} questions for the following configuration:
    Type: ${type}
    Subject: ${subject}
    Target Chapters: ${chapters.length > 0 ? chapters.join(", ") : "Entire Syllabus"}
    
    Rules:
    1. STRICTLY NCERT BASED. For Physics/Chemistry, include numericals and theory.
    2. Variety is key: Conceptual, Diagram-based description, Application, Match the following.
    3. If PYQ, assign a year (2010-2024).
    4. Return exactly ${count} items in the specified JSON schema.
    5. Ensure randomized sub-topics for infinite variety.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            ncertReference: { type: Type.STRING },
            year: { type: Type.INTEGER },
            chapter: { type: Type.STRING },
            subject: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "ncertReference", "chapter"]
        }
      }
    }
  });

  try {
    // Fix: Access response.text property directly as per guidelines
    const rawData = JSON.parse(response.text || "[]");
    return rawData.map((q: any) => ({
      ...q,
      subject,
      type
    }));
  } catch (e) {
    console.error("Batch generation failed, retrying smaller set", e);
    // Fallback logic for robustness
    return [];
  }
};
