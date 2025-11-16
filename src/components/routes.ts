import express from "express";
const router = express.Router();

import adminRoures from "./admin/routes";
router.use("/admin", adminRoures);

import newsRoutes from "./news/routes";
router.use("/news", newsRoutes);

import districtRoutes from "./state/district/routes";
router.use("/district", districtRoutes);

import talukaRoutes from "./state/district/taluka/routes";
router.use("/taluka", talukaRoutes);

import userRoutes from "./users/routes";
router.use("/user", userRoutes);

export default router;
