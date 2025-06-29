import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/',ClerkExpressRequireAuth(), protect, getUserData)

// Route to store recent searched cities
userRouter.post('/store-recent-search',ClerkExpressRequireAuth(), protect, storeRecentSearchedCities)

export default userRouter;




