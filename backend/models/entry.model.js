import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    }
}, {
    timestamps: true // createdAt, updatedAt
});

const Entry = mongoose.model('Entry', entrySchema);

export default Entry;
