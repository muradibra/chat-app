"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/signup", auth_controller_1.default.signup);
router.post("/login", auth_controller_1.default.login);
router.post("/logout", auth_controller_1.default.logout);
router.put("/update-profile", auth_middleware_1.protectRoute, auth_controller_1.default.updateUser);
router.get("/check", auth_middleware_1.protectRoute, auth_controller_1.default.check);
exports.default = router;
