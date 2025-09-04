import express from 'express';
import { signup, login, logout, getUserForSideBar } from '../controllers/User.controller.js';
import { protectRoute } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/sidebar', protectRoute, getUserForSideBar);

export default router;