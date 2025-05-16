"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});
exports.io = io;
function getReceiverSocketId(userId) {
    return socketUserMap[userId];
}
exports.getReceiverSocketId = getReceiverSocketId;
const socketUserMap = {};
io.on("connection", (socket) => {
    console.log("---a user connected---", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId)
        socketUserMap[userId] = socket.id;
    // io.emit is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(socketUserMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete socketUserMap[userId];
        io.emit("getOnlineUsers", Object.keys(socketUserMap));
    });
});
