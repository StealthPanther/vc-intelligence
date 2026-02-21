"use client";

import { useState, useEffect } from "react";
import { Company, mockCompanies } from "./mock-data";

export interface SavedList {
    id: string;
    name: string;
    companyIds: string[];
}

export function useLocalCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("vc-intel-companies-v2");
            if (stored) {
                setCompanies(JSON.parse(stored));
            } else {
                localStorage.setItem("vc-intel-companies-v2", JSON.stringify(mockCompanies));
                setCompanies(mockCompanies);
            }
        } catch (e) {
            console.error("Failed to load companies from localStorage:", e);
            setCompanies(mockCompanies);
        }
        setIsLoaded(true);
    }, []);

    const updateCompany = (updated: Company) => {
        const newCompanies = companies.map(c => c.id === updated.id ? updated : c);
        setCompanies(newCompanies);
        try {
            localStorage.setItem("vc-intel-companies-v2", JSON.stringify(newCompanies));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
        }
    };

    return { companies, isLoaded, updateCompany };
}

export function useLocalCompany(id: string) {
    const { companies, isLoaded, updateCompany } = useLocalCompanies();
    const company = companies.find((c) => c.id === id);
    return { company, isLoaded, updateCompany };
}

export function useLocalLists() {
    const [lists, setLists] = useState<SavedList[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("vc-intel-lists-v2");
            if (stored) {
                setLists(JSON.parse(stored));
            } else {
                const defaultList: SavedList = { id: "1", name: "Thesis Matches", companyIds: ["1", "3", "7"] };
                localStorage.setItem("vc-intel-lists-v2", JSON.stringify([defaultList]));
                setLists([defaultList]);
            }
        } catch (e) {
            console.error(e);
            setLists([]);
        }
        setIsLoaded(true);
    }, []);

    const saveLists = (newLists: SavedList[]) => {
        setLists(newLists);
        try {
            localStorage.setItem("vc-intel-lists-v2", JSON.stringify(newLists));
        } catch (e) {
            console.error(e);
        }
    };

    const addList = (name: string) => {
        const newList: SavedList = { id: Date.now().toString(), name, companyIds: [] };
        saveLists([...lists, newList]);
    };

    const deleteList = (id: string) => {
        saveLists(lists.filter((l) => l.id !== id));
    };

    const renameList = (id: string, name: string) => {
        saveLists(lists.map((l) => (l.id === id ? { ...l, name } : l)));
    };

    const addToList = (listId: string, companyIds: string[]) => {
        saveLists(
            lists.map((l) =>
                l.id === listId
                    ? { ...l, companyIds: Array.from(new Set([...l.companyIds, ...companyIds])) }
                    : l
            )
        );
    };

    const removeFromList = (listId: string, companyId: string) => {
        saveLists(
            lists.map((l) =>
                l.id === listId
                    ? { ...l, companyIds: l.companyIds.filter((id) => id !== companyId) }
                    : l
            )
        );
    };

    return { lists, isLoaded, addList, deleteList, renameList, addToList, removeFromList };
}
