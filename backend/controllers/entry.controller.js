import mongoose from "mongoose";
import Entry from "../models/entry.model.js";

export const getEntry = async (req, res) => {
    try {
        const user_id = req.user._id
        const entries = await Entry.find({ user_id });
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

// Fetch all media URLs for a user
export const getAllMedia = async (req, res) => {
    try {
        const user_id = req.user._id;
        const entries = await Entry.find({ user_id });

        const mediaUrls = entries.reduce((acc, entry) => {
            return acc.concat(entry.media || []);
        }, []);

        res.status(200).json({ success: true, media: mediaUrls });
    } catch (error) {
        console.error("Error fetching media:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
