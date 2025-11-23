import express from "express";
const router = express.Router();
import authRouter from "./auth/routes";
import userController from "./controller";

// Define your routes here
router.use("/auth", authRouter);

router.get("/", userController.getUsers);
router.route("/:id").get(userController.getUserById).put(userController.updateUser);
router.put("/:id/role", userController.changeRole);

export default router;
