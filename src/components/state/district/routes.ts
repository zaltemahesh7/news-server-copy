import express from "express";
import { authorizeRoles, protect } from "../../../middlewares/authMiddleware/auth.middleware";
import { districtController } from "./controlle";

const router = express.Router();

// 🔹 District CRUD Routes
router
  .route("/")
  .post(protect, authorizeRoles("admin"), districtController.createDistrict)
  .get(districtController.getAllDistricts);

router
  .route("/:id")
  .get(districtController.getDistrictById)
  .put(protect, authorizeRoles("admin"), districtController.updateDistrict)
  .delete(protect, authorizeRoles("admin"), districtController.deleteDistrict);

export default router;
