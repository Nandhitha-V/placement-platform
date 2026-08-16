// server.js — the entry point of our backend

// Load environment variables from .env into process.env
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server
connectDB();

app.get("/", (req, res) => {
  res.send("Hello! The Placement Platform backend is running.");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const User = require("./models/User");