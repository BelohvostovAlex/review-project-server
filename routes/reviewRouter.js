import { Router } from "express";

import reviewController from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", reviewController.getReviews);
router.get("/search", reviewController.searchReviews);
router.get("/:id", reviewController.getReview);
router.get("/related/:id", reviewController.getRelatedReviews);
router.get("/tag/:id", reviewController.getAllReviewsByTag);
router.get("/creator/:id", reviewController.getCreatorReviews);
router.get("/creator-likes/:id", reviewController.getCreatorLikes);
router.post("/", authMiddleware, reviewController.createReview);
router.post("/new-comment", authMiddleware, reviewController.createComment);
router.patch("/:id", authMiddleware, reviewController.updateReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);
router.patch("/like/:id", authMiddleware, reviewController.likeReview);

export default router;
