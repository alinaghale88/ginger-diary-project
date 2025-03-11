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
