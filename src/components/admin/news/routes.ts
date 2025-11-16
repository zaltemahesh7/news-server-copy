import express from "express";
import { newsController } from "./controller";
import { authorizeRoles, protect } from "../../../middlewares/authMiddleware/auth.middleware";
import { upload, uploadToImageKit } from "../../../middlewares/imageKit/upload.middleware";

const router = express.Router();

// CRUD Routes for News
router
  .route("/")
  .post(
    protect,
    authorizeRoles("admin", "anchor"),
    upload.single("image"),
    uploadToImageKit,
    newsController.createNews,
  )
  .get(newsController.getAllNews);

router
  .route("/:id")
  .get(newsController.getNewsById)
  .put(protect, authorizeRoles("admin", "anchor"), newsController.updateNews)
  .delete(protect, authorizeRoles("admin"), newsController.deleteNews);

export default router;
