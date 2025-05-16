import { Router } from "express";
import { protectRoute } from "../middlewares/auth.middleware";
import messageController from "../controllers/message.controller";

const router = Router();

router.get("/user", protectRoute, messageController.getUsersForSidebar);
router.get("/user/search", protectRoute, messageController.searchUser);
router.get("/:id", protectRoute, messageController.getMessages);

router.post("/send/:id", protectRoute, messageController.sendMessage);

export default router;
