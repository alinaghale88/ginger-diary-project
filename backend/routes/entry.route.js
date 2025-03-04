import express from "express";

import { createEntry, deleteEntry, getEntry, updateEntry, getAllMedia } from "../controllers/entry.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// require auth for all entries routes
router.use(requireAuth);

router.get("/", getEntry);

router.post("/", createEntry);

router.put("/:id", updateEntry)

router.delete("/:id", deleteEntry);

// New route to fetch all media URLs
router.get("/media", getAllMedia);

export default router;