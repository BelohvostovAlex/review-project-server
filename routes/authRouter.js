import { Router } from "express";
import { check } from "express-validator";
import authController from "../controllers/authController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";

const router = new Router();

router.post(
  "/signup",
  [
    check("email", "Enter correct email").isEmail(),
    check("password", "Password should be at least three symbol").isLength({
      min: 3,
      max: 20,
    }),
    check("username", "Username cant be empty").notEmpty(),
  ],
  authController.signUp
);

router.post("/signin", authController.signIn);
router.post("/signout", authController.signOut);
router.get("/refresh", authController.refresh);

router.get("/users", authController.getUsers);
// router.get("/users", authMiddleware, authController.getUsers);

export default router;
