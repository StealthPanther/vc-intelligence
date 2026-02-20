"use client";

import { use } from "react";
import { useLocalCompany } from "@/lib/storage";
import { CompanyProfile } from "@/components/CompanyProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const { company, isLoaded, updateCompany } = useLocalCompany(id);

    if (!isLoaded) {
        return (
            <div className="p-6 md:p-10 space-y-6">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[400px] w-full" />
            </div>
        );
    }

    if (!company) {
        return (
            <div className="p-6 md:p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Company not found</h2>
                <Button onClick={() => router.push("/companies")}>Back to Directory</Button>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-[1200px] mx-auto">
            <Button
                variant="ghost"
                className="mb-6 -ml-4 text-muted-foreground"
                onClick={() => router.push("/companies")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Companies
            </Button>

            <CompanyProfile company={company} onUpdate={updateCompany} />
        </div>
    );
}
