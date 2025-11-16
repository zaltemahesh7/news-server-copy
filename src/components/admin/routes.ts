import express from "express";
const router = express.Router();

import newsRoutes from "./news/routes";
router.use("/news", newsRoutes);

import categoryRoutes from "./categories/routes";
router.use("/category", categoryRoutes);

export default router;
