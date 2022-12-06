import { Router } from "express";

import categoryController from "../controllers/categoryController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", categoryController.getCategories);
router.post("/", categoryController.createCategory);

export default router;
