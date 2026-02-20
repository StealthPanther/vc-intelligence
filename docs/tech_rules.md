# VC Intelligence Interface Tech Rules

## Technology Stack
Tech Rules define the stack, conventions, and constraints for building the MVP efficiently within 7-8 hours...

VC Intelligence Interface Tech Rules
Tech Rules define the stack, conventions, and constraints for building the MVP efficiently within 7-8 hours, leveraging your React/Tailwind expertise for fast shipping. Focus: Next.js for full-stack (client/server), Tailwind for UI, localStorage for state—scalable to production. All choices prioritize Vercel deployment, security (server-side API keys), and premium performance.
​

Technology Stack
Category	Technology	Version	Rationale	Alternatives
Framework	Next.js	15+ (App Router)	Server-side API routes for enrichment, SSR/SSG for speed, Vercel-native.	Remix (if auth needed later)
UI/Styling	Tailwind CSS + shadcn/ui	Tailwind 3.4+, shadcn latest	Rapid premium UI (responsive, customizable), matches Dribbble inspo.	Chakra UI
UI Components	shadcn/ui (Table, Card, Button, etc.)	Latest	Accessible, Tailwind-based, copy-paste install.	Radix UI + Tailwind
Data Table	TanStack Table (@tanstack/react-table)	v8+	Sortable, paginated, filterable—perfect for companies list.	Native HTML (simple fallback)
State Mgmt (Client)	React useState/useReducer + Zustand (stretch)	React 19	Lightweight localStorage sync; no heavy Redux.	Jotai
Persistence	localStorage + IndexedDB (via idb-keyval lib)	N/A	Browser-only MVP; cache enrichments, lists.	Vercel KV (stretch)
Data Fetch	Native fetch (server/client)	N/A	Simple API calls; SWR/react-query (stretch for caching).	Axios
AI/Scraping	Grok API (x.ai) or OpenAI/Gemini	Latest	LLM extraction from page text; free tiers for demo. JSON mode prompts.	Hugging Face (self-hosted)
Icons	Lucide React	Latest	Matches shadcn; lightweight SVGs.	Heroicons
Forms	React Hook Form + Zod (stretch)	Latest	Notes/enrich inputs validation.	Native
Export	json2csv	Latest	List exports.	PapaParse
Deployment	Vercel	Latest	Git push → live; env secrets.	Netlify
Node.js: 20+. No polyfills needed.
​
​

Project Structure
text
vc-intel/
├── app/
│   ├── layout.tsx (global styles/providers)
│   ├── page.tsx (redirect to /companies)
│   ├── companies/
│   │   ├── page.tsx (list)
│   │   └── [id]/
│   │       └── page.tsx (profile)
│   ├── lists/page.tsx
│   └── api/enrich/
│       └── route.ts (POST handler)
├── components/
│   ├── ui/ (shadcn: button.tsx, table.tsx, etc.)
│   ├── CompanyTable.tsx
│   ├── CompanyProfile.tsx
│   ├── Sidebar.tsx
│   └── EnrichmentCard.tsx
├── lib/
│   ├── utils.ts (cn, toast)
│   ├── mock-data.ts (companies JSON)
│   └── storage.ts (localStorage wrappers)
├── public/ (favicon, etc.)
├── tailwind.config.js
├── next.config.js
├── .env.local.example (AI_API_KEY=)
└── README.md (setup, demo)
Commands: npx create-next-app@canary vc-intel --tailwind --eslint --app --typescript then npx shadcn-ui@latest init.
​

Coding Standards & Guidelines
Language: TypeScript strict (noImplicitAny).

Naming: camelCase vars/functions, PascalCase components, snake_case env vars.

Components: Functional + hooks; max 300 LOC; extract sub-comps.

Hooks: Custom for storage: useLocalCompanies(), useEnrich(companyId).

Error Handling: try/catch all fetches; user-friendly toasts (e.g., "Enrichment failed: retry?").

Performance:

Lazy load profiles: dynamic import.

Debounce search (300ms).

Virtualize table if >100 rows (TanStack).

Bundle analyzer if >2MB.

Testing: Console.log for MVP; Vitest/Jest stretch (1 API test).
​

API Specifications
Endpoint: POST /api/enrich

typescript
// Body: { companyId: string, website: string }
// Response: { summary: string, bullets: string[], keywords: string[], signals: string[], sources: {url: string, timestamp: string}[], cached: boolean }
// Errors: 400 (invalid), 500 (fetch/LLM fail)
Implementation:

Fetch website text (home + /about + /careers, 20k char limit).

LLM prompt: "Extract JSON: {summary:..., bullets:[...], ...} from text: [text]".

Parse/validate Zod.

Cache key: enrich-${companyId} in localStorage (TTL 24h).

Security: Env AI_API_KEY; CORS Vercel default; rate-limit 5/min IP (Upstash stretch). Public fetches only—no JS render (Cheerio if needed).
​

Build & Deployment Rules
Env Vars: .env.local: AI_API_KEY=sk-... (Grok/OpenAI). Gitignore .env*.

Scripts (package.json):

text
"dev": "next dev",
"build": "next build",
"lint": "next lint",
"export": "npm run build && json2csv lists"
Vercel: Connect GitHub repo → Auto-deploy branches; Secrets for API key.

README: Screenshots, setup (npm i && cp .env.example .env.local), demo URL, tech stack.

CI/CD: Vercel previews for PRs.
​

Constraints & Non-Functional
Timebox: 7-8h → MVP only; no over-engineering.

Scalability: localStorage <5MB; 1000 companies max.

Browser Support: Modern (Chrome 100+, Firefox 100+).

Dependencies: Minimize (pnpm add strict); audit weekly.

Version Control: Git commit often (feat: companies-list); main branch deploy.

Risk Mitigations: Fallback mock enrichment if API fails; offline-first via localStorage.

[End of TECH-RULES.md]
