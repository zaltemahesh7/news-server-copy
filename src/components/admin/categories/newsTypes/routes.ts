import express from "express";
import newsTypeController from "./controller";
import { protect, authorizeRoles } from "../../../../middlewares/authMiddleware/auth.middleware";

const router = express.Router();

// 🔹 News Type Routes (Chained)
router
  .route("/")
  .get(newsTypeController.getNewsTypes)
  .post(protect, newsTypeController.createNewsType);

router
  .route("/:id")
  .get(newsTypeController.getNewsTypeById)
  .put(protect, newsTypeController.updateNewsType)
  .delete(protect, newsTypeController.deleteNewsType);

export default router;
