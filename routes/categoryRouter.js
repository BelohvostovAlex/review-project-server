import { Router } from "express";

import categoryController from "../controllers/categoryController.js";

const router = new Router();

router.get("/", categoryController.getCategories);

export default router;
