import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'
import connectDB from './configs/db.js'; // Import the database connection function
import clerkWebhooks from './controllers/clerkWebhooks.js';

connectDB(); // Call the function to connect to the database

const app = express();

app.use(cors());// Enable CORS for all routes

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(clerkMiddleware()); // Use Clerk middleware for authentication

//Api to handle Clerk webhooks
app.use("/api/clerk", clerkWebhooks)

app.get('/', (req, res) => {
  res.send('Hello User!');
});

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

















