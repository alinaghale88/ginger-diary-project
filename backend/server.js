import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import entryRoutes from "./routes/entry.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // allows us to accept JSON data in the req.body

// routes
app.use("/api/entries", entryRoutes);
app.use("/api/user", userRoutes);

app.listen(5000, () => {
    connectDB();
    console.log("Server started at http://localhost:" + PORT);
});