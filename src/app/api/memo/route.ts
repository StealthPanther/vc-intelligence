import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        const { companyName, website, enrichment, notes } = await request.json();

        if (!enrichment) {
            return NextResponse.json({ error: "Company must be enriched first" }, { status: 400 });
        }

        const apiKey = process.env.AI_API_KEY;

        const prompt = `
        You are a highly experienced Venture Capital Partner writing an internal Deal Memo for your investment committee about ${companyName} (${website}).
        
        Use the following data to draft a perfectly formatted 3-paragraph "Pass or Invest Deal Memo".
        
        COMPANY ENRICHMENT DATA:
        - Summary: ${enrichment.summary || "N/A"}
        - Bull Case: ${enrichment.bullCase || "N/A"}
        - Bear Case: ${enrichment.bearCase || "N/A"}
        - Key Signals: ${enrichment.signals ? enrichment.signals.join(", ") : "N/A"}
        - Competitors: ${enrichment.competitors ? enrichment.competitors.join(", ") : "N/A"}
        
        ANALYST NOTES:
        ${notes || "No additional analyst notes provided."}
        
        INSTRUCTIONS:
        Draft exactly 3 paragraphs.
        Paragraph 1: Executive Summary - What they do, the market context, and the immediate traction/signals.
        Paragraph 2: Investment Thesis & Risks - Synthesize the bull case and bear case against the competitors.
        Paragraph 3: Recommendation - Conclude with a clear "INVEST" or "PASS" (Pick one based on the data) and a 1-sentence justification.
        
        Avoid any fluff or intro/outro text. Just output the three paragraphs separated by a double newline.
        `;

        if (apiKey && apiKey !== "your_api_key_here") {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            return NextResponse.json({ memo: result.response.text().trim() });
        } else {
            console.warn("No AI_API_KEY found, returning mock memo.");
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return NextResponse.json({
                memo: `Executive Summary: ${companyName} is operating in a competitive but growing market, offering innovative infrastructure for modern teams. We noted early traction signals indicating potential product-market fit. \n\nInvestment Thesis & Risks: The bull case suggests strong tailwinds, but execution risk remains high against established players like AWS and Vercel. Defensibility relies on their specific developer-focused go-to-market strategy. \n\nRecommendation: PASS. While the early traction is promising, the competitive landscape poses too much risk for our current fund thesis without stronger revenue metrics.`
            });
        }
    } catch (error) {
        console.error("Deal Memo API Error:", error);
        return NextResponse.json({ error: "Failed to draft deal memo" }, { status: 500 });
    }
}
