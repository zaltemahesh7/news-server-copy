import express from "express";
import { authorizeRoles, protect } from "../../../../middlewares/authMiddleware/auth.middleware";
import { talukaController } from "./controller";

const router = express.Router();

// 🔹 Taluka CRUD Routes
router
  .route("/")
  .post(protect, authorizeRoles("admin"), talukaController.createTaluka)
  .get(talukaController.getAllTalukas);

router
  .route("/:id")
  .get(talukaController.getTalukaById)
  .put(protect, authorizeRoles("admin"), talukaController.updateTaluka)
  .delete(protect, authorizeRoles("admin"), talukaController.deleteTaluka);

export default router;
