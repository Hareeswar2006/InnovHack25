import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/auth.middleware.js";
import { uploadResume } from "../controllers/profile.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-resume", authMiddleware, upload.single("resume"), uploadResume);

export default router;
