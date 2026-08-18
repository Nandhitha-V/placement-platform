// server.js — the entry point of our backend

// Load environment variables from .env into process.env
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// This middleware lets Express read JSON data sent in request bodies (needed for req.body to work)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello! The Placement Platform backend is running.");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Mount our auth routes under /api/auth
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});