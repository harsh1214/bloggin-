import express from "express";
import { blogs, mostViewedBlogs, recentBlogs, myBlogs, likedBlogs, draftBlogs, searchBlogs, increaseView } from "../controllers/BlogControllers.js";
import { getBlog, createBlog, uploadEditorImage, updateBlog, deleteBlog } from "../controllers/CrudBlogControllers.js";
import {AuthMiddleware} from "../middleware/AuthMiddleware.js";
import upload from "../middleware/UploadMiddleware.js";

const router = express.Router();

router.get("/blogs", AuthMiddleware, blogs);
router.get("/getBlog", AuthMiddleware, getBlog);
router.get("/popular", mostViewedBlogs);
router.get("/recent", recentBlogs);
router.post("/createBlog", AuthMiddleware, upload.single("banner"), createBlog);
router.post("/uploadEditorImage", AuthMiddleware, upload.single("image"), uploadEditorImage);
router.get("/search", searchBlogs);
router.get("/my", AuthMiddleware, myBlogs);
router.get("/liked", AuthMiddleware, likedBlogs);
router.get("/drafts", AuthMiddleware, draftBlogs);
router.patch("/view/:id", increaseView);
router.put("/update/:id", AuthMiddleware, upload.single("banner"), updateBlog);
router.delete("/delete/:id", AuthMiddleware, deleteBlog );

export default router;