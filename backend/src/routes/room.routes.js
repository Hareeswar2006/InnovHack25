import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createRoomLater } from "../controllers/room.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoomLater);

export default router;
