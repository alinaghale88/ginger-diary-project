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
    getChapterById: async (id, user) => {
        const res = await fetch(`/api/chapters/${id}`, {
            headers: {
                'Authorization': `Bearer ${user.token}`, // 🔹 Include Token
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data.data; // Ensure it returns the chapter object
    },
    updateChapter: async (id, chapterData, user) => {
        try {
            const response = await fetch(`/api/chapters/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify(chapterData),
            });

            const data = await response.json();
            if (data.success) {
                return { success: true, chapter: data.chapter };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Error updating chapter:", error);
            return { success: false, message: "Failed to update chapter" };
        }
    },

    deleteChapter: async (id, user) => {
        try {
            const res = await fetch(`/api/chapters/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const data = await res.json();
            return data;
        } catch (error) {
            console.error("Error deleting chapter:", error);
            return { success: false };
        }
    },

}));
