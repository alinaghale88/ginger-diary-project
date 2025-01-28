import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true // createdAt, updatedAt
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
