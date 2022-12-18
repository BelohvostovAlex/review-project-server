import { Router } from "express";

import tagController from "../controllers/tagController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", tagController.getTags);
router.post("/", tagController.createTag);

export default router;
