import express from 'express';
import { signup, login, checkauth, updateProfile } from '../controllers/User.controller.js'
import { protectRoute } from '../middleware/auth.js';


const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.put("/profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkauth);


export default userRouter;