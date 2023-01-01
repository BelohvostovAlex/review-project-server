import { Router } from "express";

import artItemController from "../controllers/artItemController.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", artItemController.getArtItems);
router.post("/", authMiddleware, artItemController.createArtItem);
router.patch("/rate", authMiddleware, artItemController.rateArtItem);

export default router;
