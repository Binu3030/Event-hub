// import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);

// export default router;










import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middelware/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Protected route (ADD this, don't replace above)
router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

export default router;