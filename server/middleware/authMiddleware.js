// middleware/authMiddleware.js — protects routes that require login

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Tokens are sent in the request header like: "Authorization: Bearer eyJhbGc..."
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Split "Bearer eyJhbGc..." and take just the token part
      token = req.headers.authorization.split(" ")[1];

      // Verify the token's signature using our secret — throws an error if invalid/expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // decoded = { id: "...", iat: ..., exp: ... } — the payload we signed earlier

      // Look up the user in the DB using the ID from the token,
      // and attach it to req.user so later route code can access "who is making this request"
      // .select("-password") excludes the password field, even though it's hashed, we never need to send it around
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Everything checks out — pass control to the actual route handler
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };