"use client";

import { useEffect, useState, Suspense } from "react";
import { Menu, Search, Bell, User, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, List as ListIcon, Bookmark, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Companies", href: "/companies", icon: Building2 },
    { name: "Lists", href: "/lists", icon: ListIcon },
    { name: "Saved Searches", href: "/saved", icon: Bookmark },
    { name: "Settings", href: "/settings", icon: Settings },
];

function MobileNav() {
    const pathname = usePathname();
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-1 py-4">
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
            </div>
        </div>
    );
}

function HeaderContent() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const delayDebounceFn = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const currentQ = params.get("q") || "";

            // Only navigate if the search term actually changed from what's in the URL
            if (searchTerm !== currentQ) {
                if (searchTerm) {
                    params.set("q", searchTerm);
                } else {
                    params.delete("q");
                }
                router.push(`/companies?${params.toString()}`);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchParams, router, isMounted]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                document.getElementById("global-search")?.focus();
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur px-4 md:px-6">
            <div className="flex items-center md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-2">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[240px] p-0">
                        <SheetHeader className="p-6 border-b text-left">
                            <SheetTitle>VC Intel</SheetTitle>
                        </SheetHeader>
                        <div className="px-4">
                            <MobileNav />
                        </div>
                    </SheetContent>
                </Sheet>
                <span className="font-bold text-lg hidden sm:inline-block">VC Intel</span>
            </div>

            <div className="flex-1 flex items-center justify-center px-2 md:px-8">
                <div className="relative w-full max-w-md flex items-center">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="global-search"
                        type="search"
                        placeholder="Search companies... (Cmd+K)"
                        className="w-full bg-muted/50 pl-9 pr-12 md:w-[300px] lg:w-[400px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full bg-muted">
                    <User className="h-5 w-5" />
                    <span className="sr-only">My Account</span>
                </Button>
            </div>
        </header>
    );
}

export function Header() {
    return (
        <Suspense fallback={<header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur px-4 md:px-6" />}>
            <HeaderContent />
        </Suspense>
    );
}
