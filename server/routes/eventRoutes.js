import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// protected route
router.post("/", verifyToken, authorizeRoles("organizer"), createEvent);

export default router;