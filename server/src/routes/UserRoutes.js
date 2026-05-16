import express from "express";
import { getUserDetail } from "../controllers/UserController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/getUserDetail", AuthMiddleware, getUserDetail);

export default router;