import { Router } from "express";
import { getChats, getChatByConnectionId, sendMessage } from "../controllers/chats.controllers.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protectRoute, getChats);
router.get("/connection/:connectionId", protectRoute, getChatByConnectionId);
router.post("/send", protectRoute, sendMessage);

export default router;
