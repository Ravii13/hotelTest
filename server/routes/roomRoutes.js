import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { createRoom, getOwnerRoom, getRoom, toggleRoomAvailability } from "../controllers/roomController.js";
import e from "express";

const roomRouter = express.Router();

roomRouter.post("/", upload.array("images", 4), protect, createRoom);

// Route to get all rooms
roomRouter.get("/", getRoom);
roomRouter.get("/owner", protect, getOwnerRoom); // Route to get rooms for the owner
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability); // Route to toggle room availability


export default roomRouter;












