import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name: name || "",
      email,
      password,
    });

    req.session.userId = user._id;

    res.status(201).json({
      message: "Registered successfully",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    req.session.userId = user._id;

    res.json({
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/me", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
