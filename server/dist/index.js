"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./config/db");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const socket_1 = require("./utils/socket");
socket_1.app.set("trust proxy", 1);
socket_1.app.use(express_1.default.json({ limit: "1mb" }));
socket_1.app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
socket_1.server.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
