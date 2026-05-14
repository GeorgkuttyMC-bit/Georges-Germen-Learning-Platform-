import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "AIzaSyCZSBvXmBOnH-kjLD2DhyKG_TlCBYDWNBY") {
      throw new Error("GEMINI_API_KEY is missing or invalid. Please add a valid API key to your environment variables on Vercel.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    explanation: { type: Type.STRING, description: "A brief, clear explanation of the subject in English." },
    essay: { type: Type.STRING, description: "A short story or essay in German about the subject (about 4-5 paragraphs)." },
    essayTranslation: { type: Type.STRING, description: "English translation of the essay." },
    grammarConcept: {
      type: Type.OBJECT,
      description: "A key grammar concept used in the essay with explanation and examples.",
      properties: {
        concept: { type: Type.STRING, description: "Name of the grammar concept (e.g., 'Dative Case', 'Separable Verbs')." },
        explanation: { type: Type.STRING, description: "Clear explanation of the rule." },
        examples: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              german: { type: Type.STRING },
              english: { type: Type.STRING }
            },
            required: ["german", "english"]
          }
        }
      },
      required: ["concept", "explanation", "examples"]
    },
    vocabulary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          translation: { type: Type.STRING },
        },
        required: ["word", "translation"]
      }
    },
    quizzes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "The question in English or German." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correctOptionIndex: { type: Type.NUMBER, description: "Index of the correct option (0-3)." },
        },
        required: ["question", "options", "correctOptionIndex"]
      }
    }
  },
  required: ["explanation", "essay", "essayTranslation", "grammarConcept", "vocabulary", "quizzes"]
};

export async function generateLearningMaterial(subject: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a comprehensive German learning material about the subject: "${subject}". Include an explanation, a German essay/story, its translation, a key grammar concept from the essay, a vocabulary list, and 3 multiple-choice questions to test comprehension.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
    }
  });

  return JSON.parse(response.text || "{}");
}

export function getChatSession() {
  const ai = getAI();
  return ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      temperature: 0.7,
      systemInstruction: "You are a friendly and encouraging German language tutor. Chat in German with the student. Keep sentences relatively simple but natural, suitable for a learner (A2/B1 level). If the user makes a grammatical, spelling, or vocabulary mistake, gently correct them AND explain the correction in English in a separate paragraph at the end (e.g. 'Correction: You said X, but it should be Y because Z.'). Prioritize giving a natural German response first.",
    }
  });
}
