import 'dotenv/config.js';
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Routes
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const upload = multer();
app.use((req, res, next) => {
  console.log("--- DEBUG ---");
  console.log("Method:", req.method);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Raw Body:", req.body); // If this is undefined, middleware is missing
  next();
});

// --- MIDDLEWARE ---
app.use(cors());
// Set a single limit for JSON parsing
app.use(express.json({ limit: "5mb" })); 
app.use(express.urlencoded({ extended: true }));


// Serve static files
app.use(express.static("/Users/jashwath/Desktop/PROJECTS/linkedin-clone/backend/uploads"));

// --- ROUTES ---
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

app.get("/", (req, res) => {
  res.send("LinkedIn Clone Backend API is running!");
});

// --- DATABASE & SERVER START ---
const start = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined in your .env file!");

    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");

    const PORT = process.env.PORT || 9080;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

start();