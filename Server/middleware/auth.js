import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

export const protectRoute = asyncHandler(async (req, res, next) => {
  let token = null;

  // ✅ Option 1: Custom "token" header
  if (req.headers.token) {
    token = req.headers.token;
  }

  // ✅ Option 2: Standard "Authorization: Bearer <token>"
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ No token provided
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // Support either `id` or `userid` in payload
    const userId = decoded.id || decoded.userid;

    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Look up user in DB
    const user = await User.findById(decoded.id).select("-password");
    console.log("User from DB:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
});
