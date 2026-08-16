// models/User.js — defines the shape of a "User" document in MongoDB

const mongoose = require("mongoose");

// A Schema is a blueprint: it describes what fields a document has,
// their types, and rules (required, unique, etc.)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // removes extra whitespace at start/end
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can have the same email
      lowercase: true, // stores email in lowercase to avoid duplicate accounts like Test@x.com vs test@x.com
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // NOTE: we will NEVER store this as plain text.
      // In Step 4, we hash it with bcrypt before saving.
    },
  },
  {
    // Automatically adds "createdAt" and "updatedAt" fields, managed by Mongoose
    timestamps: true,
  }
);

// A Model is what we actually use in our code to create/find/update users.
// Mongoose will create a MongoDB collection called "users" (lowercase, pluralized) automatically.
const User = mongoose.model("User", userSchema);

module.exports = User;