"use client";

import { useState, useRef, useEffect } from "react";
import { Company } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
    role: "user" | "model";
    content: string;
}

export function CompanyChat({ company }: { company: Company }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", content: `Hi! I'm your AI Analyst. I've read the scraped data for ${company.name}. What would you like to know?` }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || !company.enrichment) return;

        const userMsg: Message = { role: "user", content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const apiMessages = newMessages[0].role === "model" ? newMessages.slice(1) : newMessages;

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    companyName: company.name,
                    enrichment: company.enrichment
                })
            });
            if (!res.ok) throw new Error("API Error");
            const data = await res.json();

            setMessages([...newMessages, { role: "model", content: data.message }]);
        } catch (error) {
            console.error(error);
            toast.error("Failed to get AI response");
        } finally {
            setIsLoading(false);
        }
    };

    if (!company.enrichment) return null;

    return (
        <div className="mt-8 border border-border/60 rounded-xl overflow-hidden bg-background shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-muted/40 px-4 py-3 border-b border-border/60 flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-sm">Ask AI about {company.name}</h3>
            </div>

            <div className="h-64 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"}`}>
                            {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`text-sm py-2 px-3 rounded-2xl max-w-[85%] ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-1 py-2 px-3 bg-muted rounded-2xl rounded-tl-sm">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 bg-card border-t border-border/60 flex gap-2">
                <Input
                    placeholder="Ask about pricing, competitors, risks..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                    className="focus-visible:ring-1"
                />
                <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
