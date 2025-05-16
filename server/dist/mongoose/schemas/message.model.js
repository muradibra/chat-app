"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const message = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
}, { timestamps: true });
const Message = (0, mongoose_1.model)("Message", message);
exports.default = Message;
