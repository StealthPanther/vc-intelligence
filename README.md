# VC Intelligence Interface

A premium, modern SaaS dashboard for Venture Capital associates to discover, track, and enrich startup lead profiles using AI.

## Features

- **Company Discovery**: Search and filter a robust table of companies (powered by TanStack Table).
- **Company Profiles**: Detailed insights including manual note-taking (persisted locally).
- **Live Enrichment**: Server-side AI integration parses public site data into summary, keywords, and detected signals.
- **Lists Management**: Create segmented lists of startup matches and export data formats to CSV/JSON.
- **Premium UI**: Dribbble-inspired dashboard utilizing `shadcn/ui`, `TailwindCSS` with dark mode support.
- **Keyboard Optimization**: `Cmd+k` global omni-search navigation focus.

## Setup Instructions

1. Clone or download this repository.
2. Ensure you have Node 18+ installed.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
5. Add your Grok/Gemini AI API Key to `.env.local` to enable Live Scraping Enrichment:
   ```
   AI_API_KEY=your_key_here
   ```
6. Run the local development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4 & shadcn/ui
- @tanstack/react-table
- @google/generative-ai
- cheerio
- json2csv

## Screenshots

*Add screenshots here*
