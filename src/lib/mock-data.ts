export interface Company {
  id: string;
  name: string;
  website: string;
  desc: string;
  sector: string;
  stage: string;
  location: string;
  notes?: string;
  enrichment?: {
    summary: string;
    bullets: string[];
    bullCase?: string;
    bearCase?: string;
    competitors?: string[];
    keywords: string[];
    signals: string[];
    sources: { url: string; timestamp: string }[];
  };
}

export const mockCompanies: Company[] = [
  { id: "1", name: "Langfuse", website: "https://langfuse.com", desc: "Open source LLM engineering platform. Traces, evals, prompt management and metrics.", sector: "AI/ML", stage: "Seed", location: "Berlin" },
  { id: "2", name: "Midday", website: "https://midday.ai", desc: "The operating system for modern businesses. Invoicing, expenses, and financial overview.", sector: "FinTech", stage: "Seed", location: "Stockholm" },
  { id: "3", name: "Dub", website: "https://dub.co", desc: "Open-source link management infrastructure for modern marketing teams.", sector: "Marketing", stage: "Seed", location: "San Francisco" },
  { id: "4", name: "Mintlify", website: "https://mintlify.com", desc: "Continuous documentation platform that helps developers build beautiful docs out of the box.", sector: "Developer Tools", stage: "Series A", location: "San Francisco" },
  { id: "5", name: "Trigger.dev", website: "https://trigger.dev", desc: "The open source background jobs framework for Next.js and TypeScript.", sector: "Developer Tools", stage: "Seed", location: "London" },
  { id: "6", name: "OpenPipe", website: "https://openpipe.ai", desc: "Helps developers train and deploy fine-tuned LLMs that match GPT-4 performance at a fraction of the cost.", sector: "AI/ML", stage: "Seed", location: "Seattle" },
  { id: "7", name: "Cal.com", website: "https://cal.com", desc: "Open-source scheduling infrastructure for everyone.", sector: "Productivity", stage: "Series A", location: "Global" },
  { id: "8", name: "Resend", website: "https://resend.com", desc: "Email API for developers. The best way to reach humans instead of spam folders.", sector: "Developer Tools", stage: "Series A", location: "San Francisco" }
];
