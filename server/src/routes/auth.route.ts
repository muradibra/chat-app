import { Router } from "express";
import authController from "../controllers/auth.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.put("/update-profile", protectRoute, authController.updateUser);

router.get("/check", protectRoute, authController.check);

export default router;
