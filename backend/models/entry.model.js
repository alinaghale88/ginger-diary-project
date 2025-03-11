import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    media: [{ type: String }], // Array of image URLs
    user_id: {
        type: String,
        required: true
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter'
    } // Reference to the Chapter model
}, {
    timestamps: true // createdAt, updatedAt
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
