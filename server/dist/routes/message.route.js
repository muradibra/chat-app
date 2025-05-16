"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const router = (0, express_1.Router)();
router.get("/user", auth_middleware_1.protectRoute, message_controller_1.default.getUsersForSidebar);
router.get("/user/search", auth_middleware_1.protectRoute, message_controller_1.default.searchUser);
router.get("/:id", auth_middleware_1.protectRoute, message_controller_1.default.getMessages);
router.post("/send/:id", auth_middleware_1.protectRoute, message_controller_1.default.sendMessage);
exports.default = router;
