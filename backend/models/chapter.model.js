// chapter.model.js
import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    coverImage: {
        type: String
    }, // Store URL to the cover image
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, // References to User model
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entry" }] // References to Entry model
}, { timestamps: true });

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;
