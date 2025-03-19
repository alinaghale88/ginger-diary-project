import mongoose from "mongoose";
import Chapter from "../models/chapter.model.js";
import Entry from "../models/entry.model.js";

// Create a new chapter
export const createChapter = async (req, res) => {
    const { name, description, coverImage } = req.body;
    const user_id = req.user._id;

    if (!name || !description) {
        return res.status(400).json({ success: false, message: "Name and description are required." });
    }

    const newChapter = new Chapter({
        name,
        description,
        coverImage,
        user_id
    });

    try {
        await newChapter.save();
        res.status(201).json({ success: true, data: newChapter });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get all chapters for the user
export const getChapters = async (req, res) => {
    const user_id = req.user._id;
    try {
        const chapters = await Chapter.find({ user_id }).populate('entries');
        res.status(200).json({ success: true, data: chapters });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// Fetch a single chapter by ID
export const getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (!chapter) {
            return res.status(404).json({ success: false, message: "Chapter not found" });
        }
        res.status(200).json({ success: true, data: chapter });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// Update chapter details
export const updateChapter = async (req, res) => {
    const { id } = req.params;
    const { name, description, coverImage } = req.body;

    try {
        const updatedChapter = await Chapter.findByIdAndUpdate(
            id,
            { name, description, coverImage },
            { new: true } // Return the updated chapter
        );

        if (!updatedChapter) {
            return res.status(404).json({ success: false, message: "Chapter not found" });
        }

        res.status(200).json({ success: true, data: updatedChapter });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Delete a chapter by ID
export const deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (!chapter) {
            return res.status(404).json({ success: false, message: "Chapter not found" });
        }

        res.status(200).json({ success: true, message: "Chapter deleted successfully" });
    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

