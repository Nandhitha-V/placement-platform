// controllers/authController.js — the actual logic for auth routes

const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Handles POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic check: did the frontend send all required fields?
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password before saving
    // "salt" = random data mixed in so identical passwords don't produce identical hashes
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user in the database with the HASHED password, never the raw one
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send back a success response (never send the password back, even hashed)
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser };