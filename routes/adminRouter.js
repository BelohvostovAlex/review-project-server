import { Router } from "express";

import adminController from "../controllers/adminController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.get(
  "/users",
  authMiddleware,
  isAdminMiddleware,
  adminController.getUsers
);
router.delete(
  "/users/:id",
  authMiddleware,
  isAdminMiddleware,
  adminController.deleteUser
);
router.patch(
  "/users/status/:id",
  authMiddleware,
  isAdminMiddleware,
  adminController.changeUserStatus
);
router.patch(
  "/users/role/:id",
  authMiddleware,
  isAdminMiddleware,
  adminController.changeUserRole
);

router.post(
  "/create-category",
  authMiddleware,
  isAdminMiddleware,
  adminController.createCategory
);

router.delete(
  "/category/:id",
  authMiddleware,
  isAdminMiddleware,
  adminController.deleteCategory
);

export default router;
