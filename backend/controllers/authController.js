// controllers/authController.js

import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password });

    if (user) {
      return res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
 

  try {

    // Always validate req.body first
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing",
      });
    }
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email and explicitly select password
    // because in the schema password has select: false
    const user = await User.findOne({ email }).select("+password");

    // Check user and password
    if (user && (await user.matchPassword(password))) {
      return res.json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get current logged in user
// @route  GET /api/auth/profile
// @access Private
export const getProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware after verifying token
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc   Update current user profile
// @route  PUT /api/auth/me
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      // Add more fields if you want to update them, e.g. email, avatar, etc.

      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
