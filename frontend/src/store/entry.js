import { create } from "zustand";

export const useEntryStore = create((set) => ({
    entries: [],
    setEntries: (entries) => set({ entries }),
    clearEntries: () => set({ entries: [] }),
    createEntry: async (newEntry, user) => {
        if (!user) {
            return { success: false, message: "You must be logged in" };
        }
        if (!newEntry.content) {
            return { success: false, message: "Please fill in all fields" };
        }
        const res = await fetch("/api/entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(newEntry),
        });
        const data = await res.json();
        set((state) => ({ entries: [...state.entries, data.data] }));
        return { success: true, message: "Entry created successfully" };
    },
    fetchEntries: async (user) => {
        if (!user) {
            return
        }
        const res = await fetch("/api/entries", {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const data = await res.json();
        set({ entries: data.data });
    },
    deleteEntry: async (eid, user) => {
        if (!user) {
            return
        }
        const res = await fetch(`/api/entries/${eid}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // Update the UI immediately, without needing a refresh
        set(state => ({ entries: state.entries.filter(entry => entry._id !== eid) }));
        return { success: true, message: data.message };
    },
    updateEntry: async (updatedEntry, user) => {
        if (!user) {
            return { success: false, message: "You must be logged in" };
        }
        if (!updatedEntry.content || updatedEntry.content.trim() === "") {
            return { success: false, message: "Content cannot be empty" };
        }

        const res = await fetch(`/api/entries/${updatedEntry._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(updatedEntry),
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // Update the entry in Zustand store
        set(state => ({
            entries: state.entries.map(entry =>
                entry._id === updatedEntry._id ? data.data : entry
            )
        }));

        return { success: true, message: "Entry updated successfully" };
    }
}));