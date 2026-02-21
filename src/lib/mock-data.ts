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
    founders?: { name: string; role: string; background: string }[];
    keywords: string[];
    signals: string[];
    sources: { url: string; timestamp: string }[];
  };
}

export const mockCompanies: Company[] = [
  { id: "1", name: "Hatchet", website: "https://hatchet.run", desc: "A distributed, fault-tolerant task queue that replaces Celery and RabbitMQ.", sector: "Developer Tools", stage: "Seed", location: "San Francisco" },
  { id: "2", name: "Exa", website: "https://exa.ai", desc: "The search engine designed specifically for AI models and LLMs to query the web.", sector: "AI/ML", stage: "Series A", location: "San Francisco" },
  { id: "3", name: "Braintrust", website: "https://braintrust.dev", desc: "Enterprise-grade evaluations, prompt playground, and data management for AI.", sector: "AI/ML", stage: "Seed", location: "San Francisco" },
  { id: "4", name: "Modal", website: "https://modal.com", desc: "Serverless cloud platform for AI developers to run code in the cloud without infrastructure pain.", sector: "Cloud/AI", stage: "Series A", location: "New York" },
  { id: "5", name: "Inkeep", website: "https://inkeep.com", desc: "AI-powered search and support assistant specifically for developer documentation.", sector: "Developer Tools", stage: "Seed", location: "Remote" },
  { id: "6", name: "Pydantic", website: "https://pydantic.run", desc: "The company behind the popular Pydantic Python library, building Logfire for observability.", sector: "Developer Tools", stage: "Seed", location: "Remote" },
  { id: "7", name: "Anysphere (Cursor)", website: "https://cursor.com", desc: "The AI-first code editor built to make engineers much faster.", sector: "DevTools/AI", stage: "Series A", location: "San Francisco" },
  { id: "8", name: "Langfuse", website: "https://langfuse.com", desc: "Open source LLM engineering platform. Traces, evals, prompt management and metrics.", sector: "AI/ML", stage: "Seed", location: "Berlin" }
];
