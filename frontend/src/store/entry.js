import { create } from "zustand";

export const useEntryStore = create((set) => ({
    entries: [],
    setEntries: (entries) => set({ entries }),
    createEntry: async (newEntry) => {
        if (!newEntry.title || !newEntry.content) {
            return { success: false, message: "Please fill in all fields" };
        }
        const res = await fetch("/api/entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
        });
        const data = await res.json();
        set((state) => ({ entries: [...state.entries, data.data] }));
        return { success: true, message: "Entry created successfully" };
    },
}));