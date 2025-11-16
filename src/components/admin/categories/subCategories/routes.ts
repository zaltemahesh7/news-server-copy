import express from "express";
import { subcategoryController } from "./controller";
import { protect } from "../../../../middlewares/authMiddleware/auth.middleware";
const router = express.Router();

// 🔹 Subcategory Routes (Chained)
router
  .route("/")
  .get(subcategoryController.getSubcategories)
  .all(protect)
  .post(subcategoryController.createSubcategory);

router
  .route("/:id")
  .get(subcategoryController.getSubcategoryById)
  .all(protect)
  .put(subcategoryController.updateSubcategory)
  .delete(subcategoryController.deleteSubcategory);
export default router;
