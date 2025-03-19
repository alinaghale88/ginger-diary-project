import express from "express";

import { createEntry, deleteEntry, getEntry, updateEntry, getAllMedia, getEntryById, getEntryByChapterId } from "../controllers/entry.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// require auth for all entries routes
router.use(requireAuth);

router.get("/", getEntry); // get all entries 

router.get("/media", getAllMedia); // get all media

router.get("/:id", getEntryById); // get entry by id

router.post("/", createEntry);

router.put("/:id", updateEntry)

router.delete("/:id", deleteEntry);

router.get("/chapter/:chapterId", getEntryByChapterId);

export default router;