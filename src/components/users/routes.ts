import express from "express";
const router = express.Router();
import authRouter from "./auth/routes";
import userController from "./controller";

// Define your routes here
router.use("/auth", authRouter);

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id/role", userController.changeRole);

export default router;
