import express from "express";
import newsController from "./controller";
const router = express.Router();

// import newsRoutes from '';

router.route("/").get(newsController.getNews);

export default router;
