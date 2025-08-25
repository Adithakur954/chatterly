import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";



export const protectRoute = asyncHandler(async (req, res, next) => {
  
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userid).select("-password");
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    
    next();
});