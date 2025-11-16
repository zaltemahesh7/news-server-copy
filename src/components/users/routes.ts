import express from "express";
const router = express.Router();
import authRouter from "./auth/routes";

// Define your routes here
router.use("/auth", authRouter);

export default router;
