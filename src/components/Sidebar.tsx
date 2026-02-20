"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, List, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: List },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("hidden md:flex flex-col w-64 border-r bg-background", className)}>
            <div className="p-6">
                <h2 className="text-xl font-bold tracking-tight">VC Intel</h2>
            </div>
            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t text-xs text-muted-foreground text-center">
                &copy; Vibe Coding
            </div>
        </aside>
    );
}
