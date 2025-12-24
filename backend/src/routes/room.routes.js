import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createRoomLater, getActiveRooms, applyToRoom, handleApplication, getMyRooms, getRoomDetails, joinRoomByCode } from "../controllers/room.controller.js";
import { getSuggestedUsers } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getActiveRooms);
router.post("/create", authMiddleware, createRoomLater);
router.post("/:roomId/request", authMiddleware, applyToRoom);
router.put("/:roomId/applications/:applicationId", authMiddleware, handleApplication);
router.get("/my_rooms", authMiddleware, getMyRooms);
router.get("/:roomId", authMiddleware, getRoomDetails);
router.post("/search", authMiddleware, joinRoomByCode);
router.get( "/:roomId/suggestions", authMiddleware, getSuggestedUsers);

export default router;
