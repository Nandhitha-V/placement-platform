// controllers/authController.js — the actual logic for auth routes

// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function: creates a signed JWT containing the user's ID
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },           // payload: data stored inside the token
    process.env.JWT_SECRET,   // secret key used to sign it (only our server knows this)
    { expiresIn: "30d" }      // token becomes invalid after 30 days
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // log them in immediately after registering
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Handles POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Deliberately vague message — don't reveal whether it was the email or password that was wrong
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the submitted password against the stored HASH
    // bcrypt.compare hashes the submitted password the same way and checks if they match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Credentials correct — issue a token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };