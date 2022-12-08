import { Router } from "express";

import artItemController from "../controllers/artItemController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", artItemController.getArtItems);
router.get("/:id", artItemController.getArtItem);
router.post("/", artItemController.createArtItem);
router.post("/rate", artItemController.rateArtItem);
// router.post("/rate", authMiddleware, tagController.createTag);

export default router;
