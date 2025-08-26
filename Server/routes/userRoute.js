import express from "express";
import { 
  signup, 
  login, 
  checkauth, 
  updateProfile, 
  getUsersForSidebar // 👈 1. Import the new function
} from "../controllers/User.controller.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/check", protectRoute, checkauth);
userRouter.put("/profile", protectRoute, updateProfile);

// ✅ 2. Add the new route for the ChatContext to use
userRouter.get("/all", protectRoute, getUsersForSidebar); 

export default userRouter;