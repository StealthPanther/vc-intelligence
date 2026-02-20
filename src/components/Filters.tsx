"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface FiltersProps {
    sectors: string[];
    stages: string[];
    selectedSectors: string[];
    selectedStages: string[];
    onSectorChange: (sector: string) => void;
    onStageChange: (stage: string) => void;
    onClear: () => void;
}

export function Filters({
    sectors,
    stages,
    selectedSectors,
    selectedStages,
    onSectorChange,
    onStageChange,
    onClear,
}: FiltersProps) {
    const hasFilters = selectedSectors.length > 0 || selectedStages.length > 0;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={onClear} className="h-8 px-2 lg:px-3">
                        Clear filters
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Sector</h3>
                    <div className="flex flex-wrap gap-2">
                        {sectors.map((sector) => (
                            <Badge
                                key={sector}
                                variant={selectedSectors.includes(sector) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => onSectorChange(sector)}
                            >
                                {sector}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Stage</h3>
                    <div className="flex flex-wrap gap-2">
                        {stages.map((stage) => (
                            <Badge
                                key={stage}
                                variant={selectedStages.includes(stage) ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => onStageChange(stage)}
                            >
                                {stage}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
