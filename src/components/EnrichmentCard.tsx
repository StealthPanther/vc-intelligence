"use client";

import { useState } from "react";
import { Company } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, CheckCircle2, ChevronRight, Globe, User } from "lucide-react";
import { toast } from "sonner";
import { CompanyChat } from "./CompanyChat";

interface EnrichmentCardProps {
    company: Company;
    onUpdate: (updated: Company) => void;
}

export function EnrichmentCard({ company, onUpdate }: EnrichmentCardProps) {
    const [isEnriching, setIsEnriching] = useState(false);

    const handleEnrich = async () => {
        try {
            setIsEnriching(true);
            const response = await fetch("/api/enrich", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ website: company.website, companyId: company.id, companyName: company.name }),
            });

            if (!response.ok) {
                throw new Error("API failed");
            }

            const data = await response.json();

            const updatedCompany = {
                ...company,
                enrichment: data
            };

            onUpdate(updatedCompany);
            toast.success("Enrichment complete!", {
                description: "Public data embedded into profile.",
            });
        } catch (e) {
            console.error(e);
            toast.error("Enrichment failed", {
                description: "Could not scrape or parse website. Offline mock failure.",
                action: { label: "Retry", onClick: () => handleEnrich() }
            });
        } finally {
            setIsEnriching(false);
        }
    };

    const enrichment = company.enrichment;

    return (
        <Card className="shadow-sm border-muted/60 h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        Live Enrichment
                    </CardTitle>
                    <CardDescription className="mt-1">Deep insights generated from public web data</CardDescription>
                </div>
                {enrichment && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Cached
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                {enrichment ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Summary</h4>
                            <p className="text-foreground/90 font-medium leading-relaxed">{enrichment.summary}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-green-700 dark:text-green-500 mb-2">Bull Case</h4>
                                <p className="text-sm leading-relaxed text-foreground/80">{enrichment.bullCase || "No bull case available."}</p>
                            </div>
                            <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 dark:bg-red-900/10 dark:border-red-900/30">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-red-700 dark:text-red-500 mb-2">Bear Case</h4>
                                <p className="text-sm leading-relaxed text-foreground/80">{enrichment.bearCase || "No bear case available."}</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Key Offerings</h4>
                                <ul className="space-y-2">
                                    {enrichment.bullets.map((b: string, i: number) => (
                                        <li key={i} className="flex items-start text-sm">
                                            <ChevronRight className="h-4 w-4 text-blue-500 mr-1 shrink-0 mt-0.5" />
                                            <span className="text-foreground/80">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Top Competitors</h4>
                                <ul className="space-y-2">
                                    {enrichment.competitors?.map((c: string, i: number) => (
                                        <li key={i} className="flex items-start text-sm">
                                            <Globe className="h-4 w-4 text-purple-500 mr-2 shrink-0 mt-0.5" />
                                            <span className="text-foreground/80 font-medium">{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {enrichment.founders && enrichment.founders.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">Founder Snapshot</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {enrichment.founders.map((founder: { name: string; role: string; background: string }, i: number) => (
                                        <div key={i} className="flex flex-col gap-1 p-3 rounded-lg border border-border/60 bg-muted/20">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-semibold">{founder.name}</span>
                                                <Badge variant="outline" className="text-xs py-0 h-5 bg-background">{founder.role}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground pl-[34px] leading-relaxed">
                                                {founder.background}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {enrichment.keywords.map((k: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="font-normal">{k}</Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Data Sources</h4>
                            <div className="flex flex-col gap-1">
                                {enrichment.sources.map((src: { url: string, timestamp: string }, i: number) => (
                                    <div key={i} className="flex items-center text-xs text-muted-foreground">
                                        <Globe className="h-3 w-3 mr-1" />
                                        <a href={src.url} className="hover:underline">{src.url}</a>
                                        <span className="mx-2">•</span>
                                        <span>{new Date(src.timestamp).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CompanyChat company={company} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">No enrichment data yet</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto mt-1 mb-4 text-sm">
                                Click the Enrich button below to scrape <span className="font-medium text-foreground">{company.website}</span> and precisely extract key insights using AI.
                            </p>
                        </div>
                        <Button
                            size="lg"
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                            onClick={handleEnrich}
                            disabled={isEnriching}
                        >
                            {isEnriching ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Scraping & Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Run Live Enrichment
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
