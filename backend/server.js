import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import path from "path";
import entryRoutes from "./routes/entry.route.js";
import userRoutes from "./routes/user.route.js";
import chapterRoutes from "./routes/chapter.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body

// routes
app.use("/api/user", userRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/chapters", chapterRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});