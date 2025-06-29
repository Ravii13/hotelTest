import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";


const hotelRouter = express.Router();

// Route to get all hotels
hotelRouter.post("/",ClerkExpressRequireAuth, protect, registerHotel);

export default hotelRouter;