// routes/authRoutes.js

import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js"; // or { protect } if exported as named

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
