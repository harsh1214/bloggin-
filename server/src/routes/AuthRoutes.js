import express from "express";
import { register, login, logout, me } from "../controllers/AuthController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/me", AuthMiddleware, me);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/deleteUser", logout);

export default router;