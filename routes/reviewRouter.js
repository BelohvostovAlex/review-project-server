import { Router } from "express";

import reviewController from "../controllers/reviewController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.get("/", reviewController.getReviews);
// router.post("/", reviewController.createReview);
router.post("/", authMiddleware, reviewController.createReview);
router.patch("/:id", authMiddleware, reviewController.updateReview);
router.delete("/:id", authMiddleware, reviewController.deleteReview);
router.patch("/:id/like", authMiddleware, reviewController.likeReview);

export default router;

// router.post(
//   "/create-review",
//   [
//     check("text", "Enter correct email").notEmpty(),
//     check("title", "Password should be at least three symbol").isLength({
//       min: 3,
//       max: 20,
//     }),
//   ],
//   () => console.log('e')
// );
