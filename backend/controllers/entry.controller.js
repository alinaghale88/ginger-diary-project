import mongoose from "mongoose";
import Entry from "../models/entry.model.js";
import Chapter from "../models/chapter.model.js";

// Fetch all entries for the Dashboard page
export const getEntry = async (req, res) => {
    try {
        const user_id = req.user._id;
        const entries = await Entry.find({ user_id })
            .select("content createdAt chapter") // Fetch only necessary fields
            .populate({ path: "chapter", select: "name" }) // Populate chapter name
            .sort({ createdAt: -1 });

        // Generate excerpts instead of sending full content
        const processedEntries = entries.map(entry => ({
            _id: entry._id,
            createdAt: entry.createdAt,
            chapter: entry.chapter,
            excerpt: entry.content.replace(/<[^>]*>/g, "").substring(0, 210) + "..."
        }));

        res.status(200).json({ success: true, data: processedEntries });
    } catch (error) {
        console.error("Error fetching entries:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Fetch a single entry by ID for the ViewEntry page
export const getEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await Entry.findById(id).populate("chapter", "name");

        if (!entry) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }

        res.status(200).json({ success: true, data: entry }); // Full content is sent
    } catch (error) {
        console.error("Error fetching entry:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Fetch all entries for a specific chapter
export const getEntryByChapterId = async (req, res) => {
    try {
        const user_id = req.user._id;
        const { chapterId } = req.params; // Get chapter ID from URL params

        if (!mongoose.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({ success: false, message: "Invalid Chapter ID" });
        }

        const entries = await Entry.find({ user_id, chapter: chapterId })
            .select("content createdAt chapter")
            .populate({ path: "chapter", select: "name" })
            .sort({ createdAt: -1 });

        const processedEntries = entries.map(entry => ({
            _id: entry._id,
            createdAt: entry.createdAt,
            chapter: entry.chapter,
            excerpt: entry.content.replace(/<[^>]*>/g, "").substring(0, 210) + "..."
        }));

        res.status(200).json({ success: true, data: processedEntries });
    } catch (error) {
        console.error("Error fetching entries by chapter ID:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const createEntry = async (req, res) => {
    const entry = req.body; // user will send this data
    const user_id = req.user._id;
    if (!entry.content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" })
    }
    const newEntry = new Entry({ ...entry, user_id });

    try {
        await newEntry.save();
        // Update the chapter's entries array
        const chapter = await Chapter.findById(entry.chapter);
        if (chapter) {
            chapter.entries.push(newEntry._id); // Push the new entry ID to the chapter's entries
            await chapter.save();
        }
        res.status(201).json({ success: true, data: newEntry }); // Status 201: Something created
    } catch (error) {
        console.error("Error in Create entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const updateEntry = async (req, res) => {
    const { id } = req.params;
    const entry = req.body; // Entry data coming from the request

    // Validate the Entry ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Entry Id" });
    }

    // Ensure the content is not empty
    if (!entry.content || entry.content.trim() === "") {
        return res.status(400).json({ success: false, message: "Content cannot be empty" });
    }

    try {
        // Find the current entry
        const currentEntry = await Entry.findById(id).populate("chapter");

        if (!currentEntry) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }

        // If the chapter is changing, we need to update the chapter's entries array
        const currentChapter = currentEntry.chapter;
        const newChapter = entry.chapter;

        if (currentChapter && currentChapter._id.toString() !== newChapter) {
            // If the chapter is changing, remove the entry ID from the old chapter's entries array
            currentChapter.entries = currentChapter.entries.filter(entryId => !entryId.equals(id));
            await currentChapter.save();
        }

        // Now handle the new chapter assignment, if any
        if (newChapter && newChapter !== currentEntry.chapter?.toString()) {
            const chapterToUpdate = await Chapter.findById(newChapter);
            if (chapterToUpdate) {
                // Add the entry to the new chapter's entries array
                chapterToUpdate.entries.push(id);
                await chapterToUpdate.save();
            }
        }

        // Now update the entry itself with the new chapter
        const updatedEntry = await Entry.findByIdAndUpdate(id, entry, { new: true });

        res.status(200).json({ success: true, data: updatedEntry });

    } catch (error) {
        console.error("Error in updating entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const deleteEntry = async (req, res) => {
    const { id } = req.params;

    // Validate the Entry ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Entry Id" });
    }

    try {
        // Find the entry to be deleted
        const entryToDelete = await Entry.findById(id).populate("chapter");

        if (!entryToDelete) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }

        // Remove the entry ID from the chapter's entries array
        if (entryToDelete.chapter) {
            const chapter = entryToDelete.chapter;
            chapter.entries = chapter.entries.filter(entryId => !entryId.equals(id));
            await chapter.save();
        }

        // Delete the entry from the Entry collection
        await Entry.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Function to fetch all media URLs
export const getAllMedia = async (req, res) => {
    try {
        const user_id = req.user._id;
        const entries = await Entry.find({ user_id });

        const groupedMedia = {};

        entries.forEach(entry => {
            if (entry.media && entry.media.length > 0) {
                const date = new Date(entry.createdAt);
                const year = date.getFullYear();
                const month = date.getMonth(); // Numeric (0 = January, 11 = December)
                const monthName = date.toLocaleString('default', { month: 'long' });

                const key = `${year}-${monthName}`; // Example: "2025-March"

                if (!groupedMedia[key]) {
                    groupedMedia[key] = { month, media: [] };
                }
                groupedMedia[key].media.push(...entry.media);
            }
        });

        // Sort by year (descending) and month (descending within each year)
        const sortedMedia = Object.keys(groupedMedia)
            .sort((a, b) => {
                const [yearA, monthA] = a.split('-');
                const [yearB, monthB] = b.split('-');

                if (yearA !== yearB) return yearB - yearA; // Sort years in descending order
                return groupedMedia[b].month - groupedMedia[a].month; // Sort months in descending order
            })
            .reduce((acc, key) => {
                acc[key] = groupedMedia[key].media;
                return acc;
            }, {});

        res.status(200).json({ success: true, media: sortedMedia });
    } catch (error) {
        console.error("Error fetching media:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
