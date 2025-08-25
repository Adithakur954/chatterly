import express from "express";
import { signup, login, checkauth, updateProfile } from "../controllers/User.controller.js";
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

// ✅ these match frontend calls in AuthContext.jsx
userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/check", protectRoute, checkauth);
userRouter.put("/profile", protectRoute, updateProfile);

export default userRouter;
