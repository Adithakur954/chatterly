import express from 'express'
import { protectRoute } from '../middleware/auth.js';
import { getUserForSideBar, sendMessage, getMessage, markMessagesAsSeen } from '../controllers/Message.controller.js';

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUserForSideBar);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.put("/mark/:id", protectRoute, markMessagesAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;