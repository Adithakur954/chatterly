import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './lib/db.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});