import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createPost, getAnnouncements, getRooms } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createPost);
router.get("/announcements", getAnnouncements);
router.get("/rooms", getRooms);

export default router;