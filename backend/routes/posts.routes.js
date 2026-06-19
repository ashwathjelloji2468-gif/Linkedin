import { Router } from "express";
import { activeCheck, createPost, getAllPosts, deletePost, commentPost,  getCommentsByPost, deleteComment,  likePost } from "../controllers/posts.controllers.js";
import { protectRoute } from '../middleware/authMiddleware.js';
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.route("/", activeCheck);
router.post('/create', upload.none(), createPost);
router.get("/", protectRoute, getAllPosts);
router.delete("/delete/:postId", protectRoute, deletePost);
router.post("/comment/:postId", protectRoute, commentPost);
router.get("/:postId/comments", protectRoute, getCommentsByPost);
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment);
router.post("/like/:postId", protectRoute, likePost);
export default router;
