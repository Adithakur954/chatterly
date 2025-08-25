import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO setup
export const io = new Server(server, {
  cors: { origin: "*" },
});

export const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));

// ✅ Routes
app.get("/api/status", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

// ✅ Connect to DB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
