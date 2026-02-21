# 🚀 VC Intelligence Interface

Live:https://vcintel.vercel.app/

**VC Intelligence** is a premium, modern SaaS dashboard heavily inspired by bespoke internal tools used by top-tier Venture Capital firms. It allows associates to discover, track, and deeply enrich startup lead profiles using autonomous AI agents.

Built with Next.js 15, React 19, and Tailwind CSS v4, it features a fluid, keyboard-optimized interface with gorgeous dark-mode aesthetics.

---

## ✨ Core Features

### 🧠 Deep Research AI Agent (V2)
The platform is augmented with a powerful Google Gemini pipeline that automatically researches companies for you. 
- **Live Scraping Enrichment:** Simply click "Enrich" on any company block to crawl their website, search the latest Google news for funding/product launches, and identify competitors in real-time.
- **Founder Snapshot:** Automatically extracts the names, roles, and backgrounds of the startup's founding team directly from the web and internal LLM knowledge.
- **Auto-Generate Deal Memo:** Click the "Draft Deal Memo" button to instantly synthesize all signals, bull/bear cases, and your personal analyst notes into a perfectly formatted, 3-paragraph "Invest vs. Pass" recommendation ready for the Investment Committee.
- **Contextual AI Chat:** Chat directly with the AI about the company. The chat is strictly tethered to the scraped context to eliminate hallucinations.

### 💼 Pipeline & Discovery
- **Company Discovery**: Search and filter a robust table of companies powered by `@tanstack/react-table`.
- **Keyboard Optimization**: Global `Cmd+K` command menu to frictionlessly navigate between companies, lists, and settings.
- **Local Persistence**: Add your own scratchpad analyst notes and save companies to personalized "Lists" which sync cleanly to your local browser storage.
- **Exporting**: Export your curated lists of startup matches directly to CSV or JSON formats.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 App Router](https://nextjs.org/)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + Lucide Icons
- **AI & NLP**: [Google Generative AI](https://ai.google.dev/) + `@ai-sdk/google`
- **Data Gathering**: `cheerio` + `googlethis`

---

## 🚀 Quick Start (Local Setup)

1. **Clone the repository**
   ```bash
   git clone https://github.com/StealthPanther/vc-intelligence.git
   cd vc-intel
   ```

2. **Install dependencies**
   Ensure you have Node 18+ installed.
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Rename the example block.
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and add your Gemini API Key to enable the Live Web Scraping and Deal Memo features:
   ```env
   AI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no API key is provided, the app will gracefully fall back to rich MVP mock data so you can still test the UI!)*

4. **Run the local development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## ☁️ Deployment (Vercel)

This project is highly optimized to run perfectly on Vercel's serverless edge infrastructure.
1. Create a new project in your Vercel dashboard.
2. Select this GitHub repository.
3. Make sure the Framework Preset is set to **Next.js**.
4. In the Environment Variables dropdown, add `AI_API_KEY` and your production Gemini key.
5. Click **Deploy**.

---

## 🛡️ Best Practices & Design
- **Graceful Degradation:** All complex asynchronous AI endpoints (`/api/enrich`, `/api/chat`, `/api/memo`) are protected by heavy `try/catch` logic and timeout safety mechanisms.
- **Aesthetic First:** The data visualizations draw inspiration from Dribbble's finest B2B dashboard paradigms, utilizing glassmorphism, animated transitions, and carefully calibrated typography (Inter font).

## 📄 License
This project is open-sourced under the MIT License.
