import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenerativeAI } from "@google/generative-ai";
import google from "googlethis";

export async function POST(request: Request) {
    try {
        const { website, companyName } = await request.json();

        if (!website) {
            return NextResponse.json({ error: "Website URL is required" }, { status: 400 });
        }

        // Use the domain name if companyName is not provided
        const nameToSearch = companyName || website.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0];

        // 1. Parallel Data Gathering
        const fetchWebsite = async () => {
            try {
                const response = await fetch(website, {
                    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" },
                    signal: AbortSignal.timeout(6000)
                });
                if (!response.ok) throw new Error("Failed to fetch website");
                const html = await response.text();
                const $ = cheerio.load(html);
                $("script, style, noscript, nav, footer, header").remove();
                return $("body").text().replace(/\s+/g, " ").trim().substring(0, 15000);
            } catch (e) {
                console.error("Web scrape error:", e);
                return `This is a company located at ${website}. We were unable to scrape the full website.`;
            }
        };

        const fetchNews = async () => {
            try {
                const response = await google.search(`${nameToSearch} funding raised product launch`, {
                    page: 0,
                    safe: false,
                    parse_ads: false,
                });
                return response.results.slice(0, 4).map(r => `${r.title}: ${r.description}`).join("\n");
            } catch (e) {
                console.error("Google News error:", e);
                return "No recent news found from Google.";
            }
        };

        const fetchCompetitors = async () => {
            try {
                const response = await google.search(`${nameToSearch} vs alternatives competitors`, {
                    page: 0,
                    safe: false,
                    parse_ads: false
                });
                return response.results.slice(0, 3).map(r => `${r.title}: ${r.description}`).join("\n");
            } catch (e) {
                console.error("Google Competitors error:", e);
                return "No competitor data found from Google.";
            }
        }

        const fetchFounders = async () => {
            try {
                const response = await google.search(`${nameToSearch} founders CEO CTO LinkedIn`, {
                    page: 0,
                    safe: false,
                    parse_ads: false
                });
                return response.results.slice(0, 3).map(r => `${r.title}: ${r.description}`).join("\n");
            } catch (e) {
                console.error("Google Founders error:", e);
                return "No founder data found from Google.";
            }
        };

        const [text, newsResults, competitorResults, founderResults] = await Promise.all([
            fetchWebsite(),
            fetchNews(),
            fetchCompetitors(),
            fetchFounders()
        ]);

        // 2. Call AI API
        const apiKey = process.env.AI_API_KEY;
        let enrichmentData;

        const prompt = `
    You are an elite venture capital analyst building a deep-research profile on ${nameToSearch}.
    
    Target Company URL: ${website}
    
    I am providing you with 3 distinct sources of data. You must synthesize them into a comprehensive analysis.
    
    SOURCE 1: Website Text Extracted
    ---
    ${text}
    ---
    
    SOURCE 2: Recent Google Search & News Data (Traction/Product)
    ---
    ${newsResults}
    ---
    
    SOURCE 3: Google Search Results for Competitors
    ---
    ${competitorResults}
    ---

    SOURCE 4: Google Search Results for Founders
    ---
    ${founderResults || "No search results available. You must rely on your internal pre-trained knowledge to identify the founders of this specific company."}
    ---
    
    Extract and return a JSON object with EXACTLY this structure:
    {
      "summary": "1-2 sentence compelling summary of what they do, incorporating any major milestones from the news if applicable.",
      "bullets": ["Bullet 1 detailing key offering", "Bullet 2 on target market", "Bullet 3 on differentiation", "Bullet 4"],
      "bullCase": "A 2-3 sentence paragraph arguing why this startup could be a massive success. Use aggressive VC language (e.g. 'Strong tailwinds in...', 'Defensible moat via...').",
      "bearCase": "A 2-3 sentence paragraph arguing the biggest risks facing this company (e.g. intense competition, execution risk, scaling issues).",
      "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
      "founders": [{"name": "Founder Name", "role": "CEO/CTO/etc.", "background": "Ex-Stripe Engineeer, 10 years experience... Include current or past prominent roles."}],
      "keywords": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "signals": [
        "Funding / M&A: <Extract any exact funding amounts, valuations, or acquisitions mentioned in the news. Example: 'Acquired by ClickHouse in August 2024' or 'Raised $15M Series A'>",
        "Product/Feature Launch: <Extract any specific new products, features, or major updates. Example: 'Launched V2 of their LLM Evaluation suite'>",
        "Hiring / Growth: <Analyze website for key leadership hires or active open roles. Example: 'Actively hiring for 5 Engineering roles'>",
        "Market Traction: <Extract any mention of enterprise clients, user metrics, or partnerships. Example: 'Recently partnered with AWS for native integration'>",
        "Strategic Move: <Identify any other major strategic shifts, open-source milestones, or market positioning changes.>"
      ],
      "sources": [{"url": "${website}", "timestamp": "${new Date().toISOString()}"}, {"url": "Google Search Context", "timestamp": "${new Date().toISOString()}"}]
    }
    CRITICAL INSTRUCTION: For the 'signals' array, you must extract 4 to 5 highly specific, data-rich facts from the news and website (e.g. exact dollar amounts, specific company names, exact feature launches). Do NOT make up generic phrases. If a category data is missing, omit that string entirely from the array rather than saying 'Not detected'. The array should only contain real, verified signals.
    CRITICAL INSTRUCTION: For 'founders', if the search results are empty, use your vast internal knowledge base to identify the true founders of ${nameToSearch}. You know who founded early-stage startups like Langfuse, Cursor, Exa, Hatchet, etc. You MUST return at least 1 founder if you know them. If you are 100% absolutely unsure and the website text does not mention them, return an empty array [].
    Make sure the response is strictly valid JSON without markdown wrapping.
    `;

        if (apiKey && apiKey !== "your_api_key_here") {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Clean markdown code blocks from the Gemini response before parsing
                let cleanText = responseText.trim();
                if (cleanText.startsWith("```json")) {
                    cleanText = cleanText.replace(/```json\n?/, "").replace(/```$/, "").trim();
                } else if (cleanText.startsWith("```")) {
                    cleanText = cleanText.replace(/```\n?/, "").replace(/```$/, "").trim();
                }

                enrichmentData = JSON.parse(cleanText);
            } catch (e) {
                console.error("AI API Error, falling back to mock:", e);
                throw e;
            }
        } else {
            console.warn("No AI_API_KEY found, returning mock enrichment data.");
            await new Promise(resolve => setTimeout(resolve, 1500));
            enrichmentData = {
                summary: `Mock Analysis: According to ${website}, this company provides innovative solutions in their targeted sector, focusing on high-quality delivery.`,
                bullets: [
                    "Delivers cutting-edge technological infrastructure.",
                    "Targeting mid-market and enterprise customer segments.",
                    "Strong emphasis on developer experience and integrations."
                ],
                bullCase: "Strong execution in a rapidly growing market segment with clear demand for automated infrastructure provisioning. The team has demonstrated early traction with enterprise clients.",
                bearCase: "Intense competition from established cloud providers rolling out similar native features. Execution risk remains high as they attempt to scale their go-to-market motion.",
                competitors: ["AWS Native", "Google Cloud Functions", "Vercel Functions"],
                founders: [
                    { name: "Jane Doe", role: "CEO", background: "Ex-Stripe Engineer & YC Alumni" },
                    { name: "John Smith", role: "CTO", background: "Former VP Eng at Vercel" }
                ],
                keywords: ["B2B", "SaaS", "Infrastructure", "Innovation"],
                signals: [
                    "Hiring Status: We detected 3 open roles on their careers page.",
                    "News/Traction: Recent news mention: Series A funding intent.",
                    "Market Position: Emerging leader in the automated deployment space."
                ],
                sources: [{ url: website, timestamp: new Date().toISOString() }]
            };
        }

        return NextResponse.json({ ...enrichmentData, cached: false });
    } catch (error) {
        console.error("Enrichment Route Error:", error);
        return NextResponse.json({ error: "Failed to enrich company profile" }, { status: 500 });
    }
}
