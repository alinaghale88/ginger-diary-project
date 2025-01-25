import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Entry from "./models/entry.model.js";

dotenv.config();

const app = express();

app.post("/entries", async (req, res) => {
    const entry = req.body; // user will send this data

    if(!entry.title || !entry.content) {
        return res.status(400).json({ success: false, message: "Please enter all fields" })
    }

    const newEntry = new Entry(entry);

    try {
        await newEntry.save();
        res.status(201).json({ success: true, data: newEntry }); // Status 201: Something created
    } catch (error) {
        console.error("Error in Create entry:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");
});