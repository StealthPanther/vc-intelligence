"use client";

import { useMemo, useState, Suspense } from "react";
import { useLocalCompanies } from "@/lib/storage";
import { CompanyTable } from "@/components/CompanyTable";
import { Filters } from "@/components/Filters";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function CompaniesContent() {
    const { companies, isLoaded } = useLocalCompanies();
    const searchParams = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() || "";

    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [selectedStages, setSelectedStages] = useState<string[]>([]);

    const sectors = useMemo(() => {
        const set = new Set(companies.map((c) => c.sector));
        return Array.from(set).sort();
    }, [companies]);

    const stages = useMemo(() => {
        const set = new Set(companies.map((c) => c.stage));
        return Array.from(set).sort();
    }, [companies]);

    const filteredCompanies = useMemo(() => {
        return companies.filter((c) => {
            // Global Search
            const matchesQuery = query
                ? c.name.toLowerCase().includes(query) ||
                c.desc.toLowerCase().includes(query) ||
                c.sector.toLowerCase().includes(query)
                : true;


            const matchesSector =
                selectedSectors.length > 0 ? selectedSectors.includes(c.sector) : true;
            const matchesStage =
                selectedStages.length > 0 ? selectedStages.includes(c.stage) : true;

            return matchesQuery && matchesSector && matchesStage;
        });
    }, [companies, query, selectedSectors, selectedStages]);

    const handleSectorChange = (sector: string) => {
        setSelectedSectors((prev) =>
            prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
        );
    };

    const handleStageChange = (stage: string) => {
        setSelectedStages((prev) =>
            prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
        );
    };

    const handleClearFilters = () => {
        setSelectedSectors([]);
        setSelectedStages([]);
    };

    if (!isLoaded) {
        return (
            <div className="p-6 md:p-10 space-y-6">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Companies</h1>
                <p className="text-muted-foreground">Discover and track potential investment opportunities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8 xl:gap-12 flex-col-reverse md:flex-row-reverse">

                <div className="md:order-1 min-w-0">
                    <CompanyTable data={filteredCompanies} />
                </div>

                <div className="md:order-2">
                    <div className="md:sticky md:top-24 space-y-6">
                        <Filters
                            sectors={sectors}
                            stages={stages}
                            selectedSectors={selectedSectors}
                            selectedStages={selectedStages}
                            onSectorChange={handleSectorChange}
                            onStageChange={handleStageChange}
                            onClear={handleClearFilters}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default function CompaniesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CompaniesContent />
        </Suspense>
    )
}
