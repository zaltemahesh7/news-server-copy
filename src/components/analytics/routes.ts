import { Router } from "express";
import { analyticsController } from "./controller";

const router = Router();

router.get("/users-by-city", analyticsController.usersByCity);

export default router;
