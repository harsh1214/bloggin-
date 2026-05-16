import express from "express";
import { updateUser, deleteUser } from "../controllers/UserController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

router.patch("/update", AuthMiddleware,  upload.single("profile"), updateUser);
router.delete("/delete", AuthMiddleware, deleteUser);

export default router;