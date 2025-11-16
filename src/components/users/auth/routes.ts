import express from "express";
import authController from "./controller";
import { authorizeRoles, protect } from "../../../middlewares/authMiddleware/auth.middleware";
const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.route("/change-role/:id").post(protect, authorizeRoles("admin"), authController.changeRole);

export default router;
