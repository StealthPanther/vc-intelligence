# VC Intelligence Interface Design Document

## Design Inspiration
This design draws from modern SaaS dashboards on Dribbble (e.g., clean VC/finance UIs with sidebars, search bars, card-based tables) and Harmonic.ai's workflow: premium, data-dense layouts with search → results → profiles. Key inspo: Minimalist dark/light modes, generous whitespace, responsive grids. Primary reference: https://dribbble.com/search/vc%20dashboard [web:32]

VC Intelligence Interface Design Document
Design Inspiration
This design draws from modern SaaS dashboards on Dribbble (e.g., clean VC/finance UIs with sidebars, search bars, card-based tables) and Harmonic.ai's workflow: premium, data-dense layouts with search → results → profiles. Key inspo: Minimalist dark/light modes, generous whitespace, responsive grids. Primary reference: 
https://dribbble.com/search/vc%20dashboard
​

Design Principles
Premium Feel: Clean typography (Inter font), subtle shadows, blue/gray palette (#1E3A8A primary, #F8FAFC bg), dark mode toggle.

Responsive: Mobile-first (sidebar collapses to hamburger), desktop: 1200px+ wide.

Interactions: Smooth transitions (0.2s ease), loading skeletons, toasts for actions/enrich.

Accessibility: High contrast (AA+), keyboard nav, ARIA labels.

Consistency: shadcn/ui components (Button, Card, Table, Input).
​

Color Palette & Typography
Element	Light	Dark	Usage
Primary	#3B82F6	#60A5FA	Buttons, links
Secondary	#64748B	#94A3B8	Text, borders
Background	#F8FAFC	#0F172A	Main bg
Surface	#FFFFFF	#1E293B	Cards
Success/Error	#10B981 / #EF4444	Same	Status
Typography: Inter (sans-serif). H1: 24px bold, Body: 14px, Labels: 12px semibold.

Layout Structure
Global: Fixed header (logo left, search center, user menu right), collapsible sidebar (200px wide), main content (flex-grow).

Breakpoints: Mobile <768px (stacked), Tablet 768-1024px, Desktop >1024px.

Spacing: 16px base (4x scale: 4/8/16/32/64px).
​
​

Key Screens & Wireframes
Text-based wireframes (implement in Tailwind/shadcn). Mockups inspired by Dribbble VC dashboards: Card tables, profile heroes.

1. App Shell (/dashboard or home)
text
[Header: Logo "VC Intel" | Global Search Input | Notifications (bell) | User Avatar Dropdown (Profile/Settings/Logout)]

[Sidebar (collapsible)]          [Main Content]
- Dashboard                     |
- Companies   ← active          |
- Lists                          |
- Saved Searches                 |
- Settings                       |
[Footer: © Vibe Coding]
Search: Placeholder "Search companies, founders...", debounce 300ms.
​
​

2. Companies List (/companies)
text
[Header with Filters: Sector Dropdown | Stage Chips | Clear Btn]

[Table - TanStack or shadcn Table]
| Name | Description | Website | Stage | Actions (View/Enrich) |
|------|-------------|---------|-------|----------------------|
| AI Startup | Blockchain AI... | aistartup.com | Seed | [Eye] [Save] |
... (sortable cols, pagination bottom: 1 2 3 > )

[Empty State: "No companies match. Try broadening filters."]
Filters: Multi-select chips, search results update live.

Cards alt: Grid view toggle (Dribbble inspo).
​
​

3. Company Profile (/companies/[id])
text
[Hero Card: Name (H1) | Website Link | Save Btn | Enrich Btn (loading spinner)]

[Tabs: Overview | Signals | Enrichment | Notes]

Overview:
- Desc paragraph
- Key Info: Stage, Location badges

Enrichment Section (post-click):
[Card]
Summary: AI-built 1-2 sentences.
What they do:
• Bullet 1
Keywords: tag1, tag2...
Signals:
• Careers page detected
Sources: aistartup.com/about (timestamp)

Notes: Editable textarea, save btn.
Enrich: Modal confirm → Spinner → Results expand. Cache badge if done.
​

4. Lists (/lists)
text
[Create List Btn (+ New List)]

[Grid of List Cards]
Card: "Thesis Matches" | 5 companies | Edit/Delete/Export CSV/JSON

[Modal: Add Company Search | Bulk select]
Export: Download btn triggers json2csv.
​

Components Library (shadcn/Tailwind)
Button: Variants (primary, outline, ghost). E.g., <Button>Enrich</Button>

Card: Elevated, hover subtle lift.

Table: Sortable headers, row hover, zebra stripes.

Input/Search: Magnifier icon, clear X.

Modal/Dialog: Fullscreen mobile, backdrop blur.

Badge: Stage/sector (green/seed).

Skeleton: For loading tables/profiles.

Toast: Success "Enriched!", Error "Scrape failed".
​
​

User Flows & Interactions
Discovery Flow: Search → Filter → Table row click → Profile → Enrich (API call, optimistic cache) → Note → Save list.

Animation: Fade in results, slide-up modal.

List Flow: Create → Search/add companies → Export (blob download).

Error States: Network fail: Retry btn; No data: Illus + CTA.

Mobile: Sidebar overlay drawer, touch-friendly tabs.
​
​

Prototyping Notes
Use Figma for hi-fi mocks (import shadcn kit).

Test: Responsive preview, click prototypes (search → profile).

Handoff: Tailwind classes in code comments, e.g., className="bg-primary text-white px-4 py-2 rounded-lg".

[End of DESIGN.md]
