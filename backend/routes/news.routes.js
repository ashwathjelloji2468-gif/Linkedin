import { Router } from "express";
import { getNews, getNewsById, likeNews, commentNews } from "../controllers/news.controllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protectRoute, getNews);
router.get("/:id", protectRoute, getNewsById);
router.post("/like/:id", protectRoute, likeNews);
router.post("/comment/:id", protectRoute, commentNews);

export default router;
