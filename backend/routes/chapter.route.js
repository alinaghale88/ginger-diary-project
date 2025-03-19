import express from "express";
import { createChapter, getChapters, getChapterById, updateChapter, deleteChapter } from "../controllers/chapter.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.use(requireAuth); // Protect routes with authentication

router.post("/", createChapter);
router.get("/", getChapters);
router.get("/:id", getChapterById);
router.put('/:id', updateChapter);
router.delete('/:id', deleteChapter);

export default router;
