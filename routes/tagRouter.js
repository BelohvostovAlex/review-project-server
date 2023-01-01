import { Router } from "express";

import tagController from "../controllers/tagController.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", tagController.getTags);
router.post("/", authMiddleware, tagController.createTag);

export default router;
