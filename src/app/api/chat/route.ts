import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const { messages, companyName, enrichment } = await request.json();

        if (!messages || !enrichment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const apiKey = process.env.AI_API_KEY;
        const systemPrompt = `You are a helpful AI assistant analyzing a company called ${companyName}.
        
Here is the context scraped from the web:
---
Summary: ${enrichment.summary}
Bull Case: ${enrichment.bullCase}
Bear Case: ${enrichment.bearCase}
Competitors: ${enrichment.competitors ? enrichment.competitors.join(", ") : "None"}
Founders: ${enrichment.founders ? enrichment.founders.map((f: { name: string; role: string; background: string }) => `${f.name} (${f.role}) - ${f.background}`).join(" | ") : "None"}
Signals: ${enrichment.signals ? enrichment.signals.join("\n") : "None"}
---

Answer the user's questions based ONLY on the provided context. If the answer is not in the context, say "I don't have enough information from the scraped data to answer that." Keep your answers concise and directly to the point.
`;

        if (apiKey && apiKey !== "your_api_key_here") {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });

            // Format messages for Gemini
            const formattedHistory = messages.map((msg: { role: string; content: string }) => ({
                role: msg.role === "user" ? "user" : "model",
                parts: [{ text: msg.content }]
            }));

            const lastMessage = formattedHistory.pop();

            const chat = model.startChat({
                history: formattedHistory,
            });

            const result = await chat.sendMessage(lastMessage.parts[0].text);
            return NextResponse.json({ message: result.response.text() });
        } else {
            console.warn("No AI_API_KEY found, returning mock chat response.");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return NextResponse.json({
                message: `[MOCK AI] I see you asked: "${messages[messages.length - 1].content}". Based on the scraped context for ${companyName}, they are focused on B2B infrastructure. Let me know if you need more details!`
            });
        }
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to generate chat response" }, { status: 500 });
    }
}
