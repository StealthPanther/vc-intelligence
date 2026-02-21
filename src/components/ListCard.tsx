"use client";

import { SavedList } from "@/lib/storage";
import { Company } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, FileSpreadsheet, Plus, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Parser } from "json2csv";

interface ListCardProps {
    list: SavedList;
    allCompanies: Company[];
    onDelete: (id: string) => void;
    onAddCompanies: (id: string) => void;
}

export function ListCard({ list, allCompanies, onDelete, onAddCompanies }: ListCardProps) {
    const listCompanies = allCompanies.filter(c => list.companyIds.includes(c.id));

    const handleExportCSV = () => {
        try {
            const parser = new Parser();
            const csv = parser.parse(listCompanies.map(c => ({
                Name: c.name,
                Website: c.website,
                Sector: c.sector,
                Stage: c.stage,
                Location: c.location,
                Description: c.desc,
                Notes: c.notes || ""
            })));
            downloadBlob(csv, `${list.name.replace(/\\s+/g, '_')}_export.csv`, 'text/csv');
            toast.success("CSV Exported successfully");
        } catch (e) {
            console.error(e);
            toast.error("Export failed");
        }
    };

    const handleExportJSON = () => {
        const json = JSON.stringify(listCompanies, null, 2);
        downloadBlob(json, `${list.name.replace(/\\s+/g, '_')}_export.json`, 'application/json');
        toast.success("JSON Exported successfully");
    };

    const downloadBlob = (content: string, filename: string, contentType: string) => {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
                <CardTitle className="flex justify-between items-start">
                    <span className="text-xl font-bold truncate pr-2">{list.name}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(list.id)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </CardTitle>
                <CardDescription>
                    {list.companyIds.length} {list.companyIds.length === 1 ? 'company' : 'companies'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {listCompanies.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-6 bg-muted/30 rounded-md">Empty list</p>
                ) : (
                    <div className="space-y-2">
                        {listCompanies.slice(0, 3).map(c => (
                            <div key={c.id} className="text-sm flex items-center justify-between p-2 rounded-md bg-muted/50 border border-transparent hover:border-border">
                                <span className="font-medium truncate mr-2">{c.name}</span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{c.sector}</span>
                            </div>
                        ))}
                        {listCompanies.length > 3 && (
                            <div className="text-xs text-center text-muted-foreground font-medium pt-2">
                                +{listCompanies.length - 3} more
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-4 border-t flex items-center justify-between gap-2 overflow-x-auto pb-4">
                <Button variant="outline" size="sm" onClick={() => onAddCompanies(list.id)} className="shrink-0">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add
                </Button>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleExportCSV} disabled={listCompanies.length === 0} className="shrink-0" title="Export CSV">
                        <FileSpreadsheet className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">CSV</span>
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleExportJSON} disabled={listCompanies.length === 0} className="shrink-0" title="Export JSON">
                        <FileJson className="h-3.5 w-3.5 sm:mr-1.5" />
                        <span className="hidden sm:inline">JSON</span>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
