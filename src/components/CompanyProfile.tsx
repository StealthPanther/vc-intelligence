"use client";

import { useState } from "react";
import { Company } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookmarkPlus, ExternalLink, MapPin, Building2, TrendingUp, Sparkles, FileText, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { EnrichmentCard } from "@/components/EnrichmentCard";

interface CompanyProfileProps {
    company: Company;
    onUpdate: (updated: Company) => void;
}

export function CompanyProfile({ company, onUpdate }: CompanyProfileProps) {
    const [notes, setNotes] = useState(company.notes || "");
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    const [memo, setMemo] = useState("");
    const [isDraftingMemo, setIsDraftingMemo] = useState(false);
    const [isMemoOpen, setIsMemoOpen] = useState(false);

    const handleSaveNotes = () => {
        setIsSaving(true);
        setTimeout(() => {
            onUpdate({ ...company, notes });
            setIsSaving(false);
            toast.success("Notes saved successfully");
        }, 400);
    };

    const handleDraftMemo = async () => {
        if (!company.enrichment) {
            toast.error("Company not enriched yet. Please run enrichment first.");
            return;
        }
        setIsDraftingMemo(true);
        try {
            const response = await fetch("/api/memo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyName: company.name,
                    website: company.website,
                    enrichment: company.enrichment,
                    notes: notes
                }),
            });
            if (!response.ok) throw new Error("API failed");
            const data = await response.json();
            setMemo(data.memo);
        } catch (error) {
            toast.error("Failed to draft deal memo");
            console.error(error);
        } finally {
            setIsDraftingMemo(false);
        }
    };

    const copyMemo = () => {
        navigator.clipboard.writeText(memo);
        toast.success("Memo copied to clipboard");
    };

    return (
        <div className="space-y-6">
            <Card className="border-t-4 border-t-primary shadow-sm bg-card">
                <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight mb-2">{company.name}</h1>
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:underline font-medium"
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {company.website.replace("https://", "").replace("http://", "")}
                            </a>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-secondary/50">
                                <Building2 className="mr-1 h-3 w-3" />
                                {company.sector}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 text-sm bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {company.stage}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 text-sm text-muted-foreground">
                                <MapPin className="mr-1 h-3 w-3" />
                                {company.location}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <Button className="w-full shadow-sm">
                            <BookmarkPlus className="mr-2 h-4 w-4" />
                            Save to List
                        </Button>
                        <Dialog open={isMemoOpen} onOpenChange={setIsMemoOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60 transition-colors border-purple-200 dark:border-purple-800"
                                    onClick={() => {
                                        if (!company.enrichment) {
                                            toast.error("Please enrich the company first.");
                                        } else if (!memo) {
                                            handleDraftMemo();
                                        }
                                    }}
                                >
                                    <FileText className="mr-2 h-4 w-4 text-purple-500" />
                                    Draft Deal Memo
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>AI Deal Memo for {company.name}</DialogTitle>
                                    <DialogDescription>
                                        Auto-generated from enrichment signals and your analyst notes.
                                    </DialogDescription>
                                </DialogHeader>
                                {isDraftingMemo ? (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                                        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                                        <p className="text-sm text-muted-foreground">Drafting investment memo...</p>
                                    </div>
                                ) : memo ? (
                                    <div className="space-y-4">
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed p-4 bg-muted/30 rounded-md border border-border">
                                            {memo}
                                        </div>
                                        <Button onClick={copyMemo} className="w-full">
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copy to Clipboard
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center text-muted-foreground text-sm">
                                        Must enrich company first.
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                        <Button
                            variant="secondary"
                            onClick={() => setActiveTab("enrichment")}
                            className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-colors"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                            Enrich
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full sm:w-auto grid grid-cols-4 h-auto p-1 bg-muted/60">
                    <TabsTrigger value="overview" className="py-2.5">Overview</TabsTrigger>
                    <TabsTrigger value="signals" className="py-2.5">Signals</TabsTrigger>
                    <TabsTrigger value="enrichment" className="py-2.5 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span className="hidden sm:inline">Enrichment</span>
                        <span className="sm:hidden">Enrich</span>
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="py-2.5">Notes</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview" className="mt-0">
                        <Card className="shadow-sm border-muted/60">
                            <CardHeader>
                                <CardTitle className="text-xl">About {company.name}</CardTitle>
                                <CardDescription>Company overview and key information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-base leading-relaxed text-foreground/90">
                                    {company.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="signals" className="mt-0">
                        <Card className="shadow-sm border-muted/60">
                            <CardHeader>
                                <CardTitle className="text-xl">Recent Signals</CardTitle>
                                <CardDescription>Detected events and traction indicators</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {!company.enrichment ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-center">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                            <TrendingUp className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground max-w-sm text-sm">
                                            No signals detected yet. Run Live Enrichment to scrape hiring data, recent news, and traction metrics.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-4"
                                            onClick={() => setActiveTab("enrichment")}
                                        >
                                            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                                            Go to Enrichment
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent">
                                        {company.enrichment.signals.map((signal, idx) => {
                                            // Extract a short title if the signal has a colon (e.g., "Hiring Status: ...")
                                            const parts = signal.split(":");
                                            const title = parts.length > 1 ? parts[0] : "Signal Detected";
                                            const desc = parts.length > 1 ? parts.slice(1).join(":").trim() : signal;

                                            return (
                                                <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-primary/10 text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                        <Sparkles className="h-4 w-4" />
                                                    </div>
                                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-4 rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="font-semibold text-foreground text-sm">{title}</div>
                                                            <time className="text-xs font-medium text-muted-foreground">Today</time>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground leading-relaxed">{desc}</div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="enrichment" className="mt-0">
                        <EnrichmentCard company={company} onUpdate={onUpdate} />
                    </TabsContent>

                    <TabsContent value="notes" className="mt-0">
                        <Card className="shadow-sm border-muted/60">
                            <CardHeader>
                                <CardTitle className="text-xl">Analyst Notes</CardTitle>
                                <CardDescription>Private notes stored locally</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Add your thesis, meeting notes, or outstanding questions here..."
                                    className="min-h-[200px] resize-y"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="flex justify-end">
                                    <Button onClick={handleSaveNotes} disabled={isSaving || notes === company.notes}>
                                        {isSaving ? "Saving..." : "Save Notes"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
