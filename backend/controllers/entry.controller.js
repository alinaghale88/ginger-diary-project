import mongoose from "mongoose";
import Entry from "../models/entry.model.js";
import Chapter from "../models/chapter.model.js";

export const getEntry = async (req, res) => {
    try {
        const user_id = req.user._id
        const entries = await Entry.find({ user_id }).populate({
            path: "chapter",
            select: "name"
        });
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        console.log("error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const createEntry = async (req, res) => {
    const entry = req.body; // user will send this data
    const user_id = req.user._id;
    if (!entry.content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" })
    }
    const newEntry = new Entry({ ...entry, user_id });

    try {
        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry }); // Status 201: Something created
    } catch (error) {
        console.error("Error in Create entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const updateEntry = async (req, res) => {
    const { id } = req.params;

    const entry = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Entry Id" });
    }

    if (!entry.content || entry.content.trim() === "") {
        return res.status(400).json({ success: false, message: "Content cannot be empty" });
    }

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, entry, { new: true });
        res.status(200).json({ success: true, data: updatedEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteEntry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Entry Id" });
    }

    try {
        await Entry.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Entry deleted" });
    } catch (error) {
        console.log("error in deleting entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

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
