import express from "express";
import { toggleLike } from "../controllers/LikeController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/toggleLike', AuthMiddleware, toggleLike);

export default router;