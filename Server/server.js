import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './lib/db.js';
import userRoute from './routes/userRoute.js';
import messageRoute from './routes/messageRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {}; // {userId: socketId}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  socket.on('typing', ({ recipientId }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('typing', { from: userId });
    }
  });

  socket.on('stopTyping', ({ recipientId }) => {
    const recipientSocketId = userSocketMap[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('stopTyping', { from: userId });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    for (let userId in userSocketMap) {
      if (userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        break;
      }
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

server.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

export { io, userSocketMap };