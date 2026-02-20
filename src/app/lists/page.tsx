"use client";

import { useState } from "react";
import { useLocalLists, useLocalCompanies } from "@/lib/storage";
import { ListCard } from "@/components/ListCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export default function ListsPage() {
    const { lists, isLoaded: listsLoaded, addList, deleteList, addToList } = useLocalLists();
    const { companies, isLoaded: companiesLoaded } = useLocalCompanies();

    const [isNewListOpen, setIsNewListOpen] = useState(false);
    const [newListName, setNewListName] = useState("");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (!listsLoaded || !companiesLoaded) {
        return (
            <div className="p-6 md:p-10 space-y-6 max-w-[1400px] mx-auto">
                <Skeleton className="h-10 w-[200px]" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-[250px] w-full" />
                </div>
            </div>
        );
    }

    const handleCreateList = () => {
        if (newListName.trim()) {
            addList(newListName.trim());
            setNewListName("");
            setIsNewListOpen(false);
            toast.success("List created");
        }
    };

    const openAddCompanies = (listId: string) => {
        setActiveListId(listId);
        setSearchQuery("");
        setSelectedIds([]);
        setIsAddOpen(true);
    };

    const handleAddSubmit = () => {
        if (activeListId && selectedIds.length > 0) {
            addToList(activeListId, selectedIds);
            setIsAddOpen(false);
            toast.success(`Added ${selectedIds.length} companies to list`);
        } else {
            setIsAddOpen(false);
        }
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.sector.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">My Lists</h1>
                    <p className="text-muted-foreground">Manage thesis matches and tracked startups.</p>
                </div>
                <Button onClick={() => setIsNewListOpen(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    New List
                </Button>
            </div>

            {lists.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/20">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No lists created yet</h3>
                    <p className="text-muted-foreground max-w-sm mb-6">Create your first list to start tracking startups that match your investment thesis.</p>
                    <Button onClick={() => setIsNewListOpen(true)}>Create a List</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {lists.map(list => (
                        <ListCard
                            key={list.id}
                            list={list}
                            allCompanies={companies}
                            onDelete={deleteList}
                            onAddCompanies={openAddCompanies}
                        />
                    ))}
                </div>
            )}

            {/* New List Modal */}
            <Dialog open={isNewListOpen} onOpenChange={setIsNewListOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New List</DialogTitle>
                        <DialogDescription>
                            Give your new list a name to organize your tracking.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Input
                                id="name"
                                placeholder="e.g. Q4 AI Infrastructure targets"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateList(); }}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewListOpen(false)}>Cancel</Button>
                        <Button type="submit" onClick={handleCreateList} disabled={!newListName.trim()}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Companies Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Companies to List</DialogTitle>
                        <DialogDescription>
                            Search and select companies to track.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or sector..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <ScrollArea className="h-[300px] border rounded-md p-2">
                            {filteredCompanies.length === 0 ? (
                                <div className="p-4 text-center text-sm text-muted-foreground">No companies match your search.</div>
                            ) : (
                                <div className="space-y-1">
                                    {filteredCompanies.map(c => {
                                        const activeList = lists.find(l => l.id === activeListId);
                                        const isAlreadyInList = activeList?.companyIds.includes(c.id);

                                        return (
                                            <div
                                                key={c.id}
                                                className={`flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors ${isAlreadyInList ? 'opacity-50' : ''}`}
                                            >
                                                <Checkbox
                                                    id={`company-${c.id}`}
                                                    disabled={isAlreadyInList}
                                                    checked={isAlreadyInList || selectedIds.includes(c.id)}
                                                    onCheckedChange={(checked) => {
                                                        if (checked) {
                                                            setSelectedIds([...selectedIds, c.id]);
                                                        } else {
                                                            setSelectedIds(selectedIds.filter(id => id !== c.id));
                                                        }
                                                    }}
                                                />
                                                <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => {
                                                    if (!isAlreadyInList) {
                                                        if (selectedIds.includes(c.id)) setSelectedIds(selectedIds.filter(id => id !== c.id));
                                                        else setSelectedIds([...selectedIds, c.id]);
                                                    }
                                                }}>
                                                    <label
                                                        htmlFor={`company-${c.id}`}
                                                        className="text-sm font-medium leading-none cursor-pointer"
                                                    >
                                                        {c.name} {isAlreadyInList && <span className="text-xs text-muted-foreground font-normal ml-1">(Already in list)</span>}
                                                    </label>
                                                    <p className="text-xs text-muted-foreground">
                                                        {c.sector} • {c.stage}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddSubmit} disabled={selectedIds.length === 0}>
                            Add {selectedIds.length > 0 ? selectedIds.length : ''} Companies
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
