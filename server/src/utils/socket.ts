import { Server } from "socket.io";
import { createServer } from "http";
import express from "express";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId: string) {
  return socketUserMap[userId];
}

const socketUserMap: {
  [key: string]: string;
} = {};

io.on("connection", (socket) => {
  console.log("---a user connected---", socket.id);

  const userId = socket.handshake.query.userId as string;
  if (userId) socketUserMap[userId] = socket.id;

  // io.emit is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(socketUserMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);

    delete socketUserMap[userId];
    io.emit("getOnlineUsers", Object.keys(socketUserMap));
  });
});

export { app, server, io };
