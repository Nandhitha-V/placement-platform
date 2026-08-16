// server.js — the entry point of our backend

// Import the Express library we just installed
const express = require("express");

// Create an "app" — this represents our entire backend application
const app = express();

// Define the port our server will listen on
// (a "port" is like a specific door number on your computer that programs listen through)
const PORT = 5000;

// Define a route: when someone visits "/" using a GET request, run this function
app.get("/", (req, res) => {
  // req = the incoming request (info about what the client is asking for)
  // res = the response we send back

  res.send("Hello! The Placement Platform backend is running.");
});

// Define a test API route — this is the pattern we'll use for all future API endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is healthy" });
});

// Start the server — make it actually listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});