import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// database connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri || !(mongoUri.startsWith("mongodb://") || mongoUri.startsWith("mongodb+srv://"))) {
  console.error("Invalid MONGO_URI. Set a valid MongoDB URI in server/.env, e.g. mongodb://user:pass@host/db or mongodb+srv://...");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("DB connected"))
  .catch(err => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});