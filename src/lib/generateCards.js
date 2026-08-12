import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const cardSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        cards: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question: { type: "string" },
                    answer: { type: "string" },
                },
                required: ["question", "answer"],
            },
        },
    },
    required: ["title", "cards"],
};

export async function generateCards(text) {
    if (!text || text.trim().split(/\s+/).length < 20) {
        return { error: "insufficient_content" };
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
        responseMimeType: "application/json",
        responseSchema: cardSchema,
        },
    });

    const prompt = `
        Generate a set of flashcards (question and answer pairs) covering the
        key concepts in the following material. Create as many cards as are
        reasonably needed to cover the material well.

        Material:
        ${text}
    `;

    try {
        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(result.response.text());
        return { cards: parsed.cards, title: parsed.title };
    } catch (err) {
        console.error("generateCards failed:", err);
        return { error: "generation_failed" };
    }
}