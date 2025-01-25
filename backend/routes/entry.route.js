import express from "express";

import { createEntry, deleteEntry, getEntry, updateEntry } from "../controllers/entry.controller.js";

const router = express.Router();

router.get("/", getEntry);

router.post("/", createEntry);

router.put("/:id", updateEntry)

router.delete("/:id", deleteEntry);

export default router;