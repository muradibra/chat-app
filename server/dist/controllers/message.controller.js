"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../mongoose/schemas/user.model"));
const message_model_1 = __importDefault(require("../mongoose/schemas/message.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const socket_1 = require("../utils/socket");
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const users = yield user_model_1.default.find({
            _id: { $ne: loggedInUserId },
        }).select("-password -__v");
        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    }
    catch (error) {
        console.log("Error in getUsersForSidebar controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { id: userToChatId } = req.params;
        const myId = (_b = req.user) === null || _b === void 0 ? void 0 : _b._id;
        const messages = yield message_model_1.default.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        res.status(200).json({
            message: "Messages fetched successfully",
            messages,
        });
    }
    catch (error) {
        console.log("Error in getMessages controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = (_c = req.user) === null || _c === void 0 ? void 0 : _c._id;
        let imageUrl = "";
        if (image) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = yield message_model_1.default.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });
        res.status(200).json({
            message: "Message sent successfully",
            newMessage,
        });
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
    }
    catch (error) {
        console.log("Error in sendMessage controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const { fullname } = req.query;
        const loggedInUserId = (_d = req.user) === null || _d === void 0 ? void 0 : _d._id;
        const users = yield user_model_1.default.find({
            _id: { $ne: loggedInUserId },
            fullname: { $regex: fullname, $options: "i" },
        }).select("-password -__v");
        res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    }
    catch (error) {
        console.log("Error in searchUser controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const messageController = {
    getUsersForSidebar,
    getMessages,
    sendMessage,
    searchUser,
};
exports.default = messageController;
