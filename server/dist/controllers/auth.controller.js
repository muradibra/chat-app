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
const bcrypt_1 = require("../utils/bcrypt");
const token_1 = require("../utils/token");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, fullname } = req.body;
        if (!email || !password || !fullname) {
            res.status(400).json({ message: "Please fill all fields" });
            return;
        }
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters long" });
            return;
        }
        const user = yield user_model_1.default.findOne({
            email,
        });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const newUser = yield user_model_1.default.create({
            email,
            password: (0, bcrypt_1.hashPassword)(password),
            fullname: fullname,
        });
        if (newUser) {
            (0, token_1.generateToken)(newUser._id.toString(), res);
            res.status(201).json({
                message: "User created successfully",
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    fullname: newUser.fullname,
                    profilePic: newUser.profilePic,
                },
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({
            email,
        });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        if (!(0, bcrypt_1.comparePassword)(password, user.password)) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        (0, token_1.generateToken)(user._id.toString(), res);
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                fullname: user.fullname,
                profilePic: user.profilePic,
            },
        });
    }
    catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.log("Error in logout controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { profilePic } = req.body;
        if (!profilePic) {
            res.status(400).json({ message: "Please provide a profile picture" });
            return;
        }
        const uploadedResponse = yield cloudinary_1.default.uploader.upload(profilePic);
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { profilePic: uploadedResponse.secure_url }, { new: true });
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                _id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                fullname: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullname,
                profilePic: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profilePic,
            },
        });
    }
    catch (error) {
        console.log("Error in updateUser controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const check = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            user: req.user,
        });
    }
    catch (error) {
        console.log("Error in check controller: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
const authController = {
    signup,
    login,
    logout,
    updateUser,
    check,
};
exports.default = authController;
