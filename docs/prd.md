# VC Intelligence Interface PRD

## Product Vision
VC Intelligence Interface is a thesis-driven startup discovery tool that streamlines VC sourcing by combining intuitive search/filtering, detailed profiles, and on-demand AI enrichment from public web data. It reduces manual triage noise, surfaces high-signal leads earlier, and provides explainable insights—empowering VCs to act faster on fund-specific opportunities. Long-term: Customizable per fund thesis, with always-on monitoring and integrations.

VC Intelligence Interface PRD
Product Vision
VC Intelligence Interface is a thesis-driven startup discovery tool that streamlines VC sourcing by combining intuitive search/filtering, detailed profiles, and on-demand AI enrichment from public web data. It reduces manual triage noise, surfaces high-signal leads earlier, and provides explainable insights—empowering VCs to act faster on fund-specific opportunities. Long-term: Customizable per fund thesis, with always-on monitoring and integrations.
​

Problem Statement
VCs waste hours on fragmented workflows: scanning newsletters, databases, founder moves, amid generic alerts and spreadsheets. Leads are thesis-dependent (strong for one fund, noise for another), with duplicates, shallow profiles, and no early signals. Current tools (PitchBook, Crunchbase) lack precision, transparency, and live enrichment.
​
​

Objectives & Success Metrics
Business: Deliver MVP in 7-8 hours, deploy live; score high on usability, enrichment reliability for intern role.

User: Cut sourcing time 50%; increase signal quality via enrichment.

Metrics (post-MVP): 99% uptime, <2s enrichment load, 90% user satisfaction (demo feedback), cache hit rate >70%.
​
​

Target Users & Personas
Primary: VC Associates/Scouts (e.g., Subrat-like at Vibe Coding), scanning 50+ leads/week.

Persona: Alex, VC Scout: 28yo, Mumbai-based, thesis: AI/blockchain startups <5yo, $1-5M raised. Pains: Noisy alerts, manual site checks. Goals: Quick enrich, list thesis matches, export.

Secondary: Solo GPs, analysts. Needs: Fast search, mobile-responsive, export.
​

Market & Competitors
Market: VC tech (sourcing/scouting), $10B+ TAM; growing with AI agents.

Competitors:

| Competitor               | Strengths                             | Weaknesses                       | Differentiation                                |
| ------------------------ | ------------------------------------- | -------------------------------- | ---------------------------------------------- |
| Harmonic.ai harmonic​    | Robust search, alerts, 20M+ companies | Paid, less live enrichment focus | Free MVP + on-demand AI scrape, thesis signals |
| Cardinal.ai trycardinal​ | Thesis scouting                       | Limited public demos             | Live web pulls, sources transparency           |
| Crunchbase/PitchBook     | Databases                             | Static, expensive                | Real-time public enrichment, local persistence |
Advantage: MVP emphasizes end-to-end enrichment path, premium UI, safe server-side AI.
​

Core Features & User Stories
Prioritized MVP (must-have), stretches.

MVP Features
App Shell: Sidebar nav (Companies, Lists, Saved), global search bar. As a scout, so I navigate fast.

Companies Discovery:

Search/filter (name, sector, stage), sortable table (name, desc, website), pagination.

As Alex, I search "AI blockchain" to see ranked results.

Company Profile (/companies/[id]):

Overview (name, desc, website), signals timeline (mock), notes editor, save-to-list.

As Alex, I view details and add notes.

Live Enrichment:

"Enrich" button → server API scrapes public pages (/about, /careers), LLM extracts: Summary (1-2s), What they do (3-6 bullets), Keywords (5-10), Signals (2-4, e.g., "recent blog"), Sources (URLs + timestamp).

Cache results in localStorage.

As Alex, I click Enrich on example.com to get instant insights.

Lists Management (/lists):

Create/view lists, add/remove companies, export CSV/JSON.

As Alex, I save "Thesis Matches" and export.

Persistence: localStorage for companies, lists, saved searches/enrichments.
​

Stretch Features
Saved searches (re-run), bulk actions, keyboard shortcuts, thesis scoring, queue/rate-limit.
​

User Flows:

Land → Search "AI startups" → Filter stage:Seed → Click company → Enrich → Note "Strong signal" → Add to list → Export list.

/lists → View "Hot Leads" → Export JSON.
​

Technical Specifications
Stack: Next.js 15 (App Router), React, Tailwind CSS, shadcn/ui (premium components), TanStack Table (sortable), localStorage/IndexedDB.

Enrichment Pipeline (server-side /api/enrich):

Input: company website.

Fetch public URLs (home, /about, /careers, /blog).

LLM (Grok/OpenAI/Gemini via API): Prompt for structured JSON output.

Env: AI_API_KEY (Vercel secrets).

Output: JSON with fields + metadata.

Data: Mock JSON seed (5-10 companies).

Deployment: Vercel (auto-deploy from GitHub), Netlify fallback.

Security: Public pages only, no auth/evasion; rate-limit API.

Performance: <2s loads, optimistic UI, error states.
​
​

UX/UI Design Guidelines
Style: Harmonic-inspired—clean, dark/light mode, generous spacing, sans-serif (Inter), responsive (mobile-first).

Components: Card-based profiles, loading skeletons, toast notifications.

Accessibility: ARIA labels, keyboard nav.

North Star: Premium tool feel—fast, intuitive, no clutter.
​
​

Roadmap & Timeline
Phase 1 (MVP, 0-8h): Scaffold → Discovery → Profile → Enrichment → Lists → Deploy.

Phase 2 (Stretch, +2h): Polish, saved searches.

Future: User auth, thesis filters, integrations (Slack export), vector search.
​
​

Risks & Assumptions
Risks: API costs/limits (use free tiers), scrape blocks (public only, retries).

Assumptions: Public sites accessible; LLM extracts reliably (prompt engineering).

Dependencies: Free AI API key, Vercel account.

Out of Scope: Real DB, user auth, payments

[End of PRD.md]
