Detailed Task Breakdown for VC Intelligence Interface MVP
Timeboxed: 7-8 hours total. Follow Tech Rules stack. Check off as completed. Estimated time per task.

Phase 0: Setup (0-45 min) ☑️ START HERE
 npx create-next-app@15 vc-intel --tailwind --typescript --eslint --app --src-dir (5 min)

 cd vc-intel && npm i @tanstack/react-table lucide-react json2csv idb-keyval (2 min)

 npx shadcn-ui@latest init && npx shadcn-ui@latest add table button card input badge dialog toast skeleton (10 min)

 Create /docs/ folder, add PRD.md/DESIGN.md/TECH-RULES.md (copied from above) (5 min)

 Create lib/mock-data.ts with 8 sample companies JSON (name/website/desc/sector/stage) (10 min)

 Create .env.local.example with AI_API_KEY= placeholder (1 min)

 git init && git add . && git commit -m "Initial scaffold" (5 min)

Phase 1: App Shell + Layout (45-90 min)
 /app/layout.tsx: Add shadcn theme provider, Tailwind globals, Inter font (5 min)

 Create /components/Sidebar.tsx: Collapsible nav (Companies/Lists/Saved) w/ Lucide icons (15 min)

 Create /components/Header.tsx: Logo + Global Search Input (debounce later) + User avatar (15 min)

 /app/page.tsx: Redirect to /companies (2 min)

 /app/layout.tsx: Flex layout (header + sidebar + main outlet) matching DESIGN.md (15 min)

 Test responsive mobile hamburger (sidebar drawer) (10 min)

Phase 2: Companies Discovery (90-210 min) Core Feature
 /lib/storage.ts: Custom hooks useLocalCompanies(), useLocalStorage(companyId) (15 min)

 /app/companies/page.tsx: Load mock data via hook (5 min)

 Create /components/CompanyTable.tsx: TanStack Table w/ columns (Name/Desc/Website/Sector/Stage/Actions), sorting, pagination (20 min)

 Add /components/Filters.tsx: Sector dropdown + Stage chips (multi-select) above table (20 min)

 Wire global search → filter table data live (debounce 300ms) (15 min)

 Add empty state + loading skeleton (10 min)

 Table row click → router.push(/companies/[id]) (5 min)

Phase 3: Company Profile (210-300 min)
 /app/companies/[id]/page.tsx: Dynamic route, fetch company from storage/mock (5 min)

 Create /components/CompanyProfile.tsx: Hero card (name, website link, Save btn) (10 min)

 Add Tabs (Overview/Signals/Enrichment/Notes) via shadcn (10 min)

 Overview tab: Company desc + badges (sector/stage/location) (10 min)

 Notes tab: Textarea + Save to localStorage (10 min)

 Signals tab: Mock timeline (3 fake events) (5 min)

Phase 4: Live Enrichment MUST WORK FOR FULL SCORE (300-390 min)
 /app/api/enrich/route.ts: POST handler - fetch website → truncate text → call AI API → parse JSON → cache → return (25 min)

typescript
// Test w/ curl first: curl -X POST /api/enrich -d '{"website":"https://example.com"}'
 /components/EnrichmentCard.tsx: "Enrich" button → POST /api/enrich → loading spinner → display results (Summary/Bullets/Keywords/Signals/Sources) (20 min)

 Enrichment tab: Show cached results or "Click Enrich" CTA (10 min)

 Error handling: Toast "Failed - retry?" + offline mock fallback (10 min)

Phase 5: Lists Management (390-420 min)
 /lib/storage.ts: Add useLocalLists() hook (5 min)

 /app/lists/page.tsx: List cards grid + "New List" button (10 min)

 Create /components/ListCard.tsx: Name/count/Edit/Delete/Export buttons (10 min)

 Modal: Add companies to list (search + checkboxes) (10 min)

 Export: json2csv → download blob (CSV + JSON) (5 min)

Phase 6: Polish + Deploy (420-480 min) Premium Feel
 Add toast notifications (success/error) globally (10 min)

 Dark mode toggle in Header (shadcn theme) (10 min)

 Mobile responsive QA (sidebar drawer, touch targets) (10 min)

 Keyboard shortcuts: Cmd+K search, / focus filters (5 min)

 Performance: Skeleton loaders everywhere (5 min)

 npm run build && npm run start - fix errors (10 min)

 Update README.md: Setup, screenshots, demo GIF, tech stack (15 min)

 Deploy Vercel: Connect GitHub → add AI_API_KEY secret → visit live URL (10 min)

 Test end-to-end on live deploy: Search → Profile → Enrich → List → Export (10 min)

Final Checklist Before Submission
 Live URL works (share with Subrat by Feb 22 midnight)

 Enrichment API works end-to-end (test 3 real websites)

 localStorage persists across refresh

 Responsive on mobile + desktop

 No console errors

 README has env setup + demo instructions

 GitHub repo public w/ docs folder

Stretch Goals (Post-MVP, +1h each)
 Saved searches (persist filter state)

 Bulk actions (add multiple to list)

 Thesis scoring (mock AI match %)

 PWA/offline support