import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import { Server } from "socket.io";
import messageRouter from "./routes/messageRoute.js";

const app = express();
const server = http.createServer(app);

// intialisation of sockwt io
export const io = new Server(server, {
  cors: {origin: "*"},
})

//store online users

export const userSocketMap = {};  //{userId: socketId}

// socket connect handler

io.on("connection", (socket) =>{

  const userId = socket.handshake.query.userId;
  console.log("user connected", userId);

  if(userId)userSocketMap[userId] = socket.id

  // emit online user to all connected user
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () =>{
    console.log("user disconnected");
    if(userId)delete userSocketMap[userId];
    // emit online user to all connected user
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  })

})



//middleware setup
app.use(cors());
app.use(express.json({ limit: "4mb" }));
// route setup
app.use("/api/status", (req, res) => {
  res.send("Server is running");
});

app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

//database connection
await connectDB();

const PORT = process.env.PORT || 5000;

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
