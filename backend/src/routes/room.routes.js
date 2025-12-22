import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createRoomLater, getActiveRooms } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getActiveRooms);
router.post("/create", authMiddleware, createRoomLater);

export default router;
