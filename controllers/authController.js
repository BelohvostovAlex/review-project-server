import { validationResult } from "express-validator";

import { ApiError } from "../exceptions/api-error.js";
import authService from "../services/authService.js";

class AuthController {
  async signUp(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest(errors.array()[0].msg, errors.array()));
      }
      const { email, password, username } = req.body;

      const userData = await authService.signUp(email, password, username);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const userData = await authService.signIn(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signInWithGoogle(req, res, next) {
    try {
      const { email, username } = req.user;

      const userData = await authService.signInWithGoogle(email, username);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const token = await authService.signOut(refreshToken);

      res.clearCookie("refreshToken");

      return res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await authService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await authService.getUser(id);

      return res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
