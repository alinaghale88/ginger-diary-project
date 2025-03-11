import { create } from "zustand";

export const useChapterStore = create((set) => ({
    chapters: [],
    setChapters: (chapters) => set({ chapters }),
    fetchChapters: async (user) => {
        if (!user) return;
        const res = await fetch("/api/chapters", {
            headers: {
                'Authorization': `Bearer ${user.token}`,
            },
        });
        const data = await res.json();
        set({ chapters: data.data });
    },
    createChapter: async (newChapter, user) => {
        if (!user) {
            return { success: false, message: "You must be logged in" };
        }
        const res = await fetch("/api/chapters", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(newChapter),
        });
        const data = await res.json();
        if (data.success) {
            set((state) => ({
                chapters: [...state.chapters, data.data],
            }));
        }
        return data;
    },
}));
