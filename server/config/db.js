// config/db.js — handles connecting our app to MongoDB

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() takes our connection string and establishes a connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Exit the process if DB connection fails — no point running a backend without a DB
    process.exit(1);
  }
};

module.exports = connectDB;