"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    fullname: {
        type: String,
        required: true,
    },
    // username: {
    //   type: String,
    //   // required: true,
    //   unique: true,
    // },
    profilePic: {
        type: String,
        default: null,
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", user);
exports.default = User;
