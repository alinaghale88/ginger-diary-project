import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Entry from "./models/entry.model.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json()); // allows us to accept JSON data in the req.body

app.get("/api/entries", async (req, res) => {
    try {
        const entries = await Entry.find({});
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        console.log("error in fetching products:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

app.post("/api/entries", async (req, res) => {
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

app.put("/api/entries/:id", async (req, res) => {
    const {id} = req.params;

    const entry = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid Entry Id"});
    }

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, entry, {new:true});
        res.status(200).json({ success: true, data: updatedEntry });
    } catch(error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
})

app.delete("/api/entries/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await Entry.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Entry deleted" });
    } catch (error) {
        console.log("error in deleting entry:", error.message);
        res.status(404).json({ success: false, message: "Entry not found" });
    }
});

app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:5000");
});