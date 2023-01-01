import { Router } from "express";
import { check } from "express-validator";
import dotenv from "dotenv";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import TwitterStrategy from "passport-twitter";

dotenv.config();

import authController from "../controllers/authController.js";
import {
  authMiddleware,
  isAdminMiddleware,
} from "../middlewares/auth-middleware.js";
import User from "../models/User.js";
import { UserDto } from "../dtos/user-dto.js";
import tokenService from "../services/tokenService.js";
import authService from "../services/authService.js";
import { ApiError } from "../exceptions/api-error.js";

const router = new Router();

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL:
        "https://review-project-server-production.up.railway.app/auth/twitter/callback",
      includeEmail: true,
    },
    async function (_, __, profile, cb) {
      const candidate = await User.findOne({ email: profile.emails[0].value });

      if (!candidate) {
        const user = await User.create({
          email: profile.emails[0].value,
          username: profile.username,
          enteredBySocial: true,
          fromTwitter: true,
        });

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({
          ...userDto,
        });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        const userData = {
          ...tokens,
          user: userDto,
        };

        return cb(null, userData);
      }

      if (candidate.status === "Blocked") {
        throw ApiError.BadRequest(`User is blocked, contact with admin`);
      }

      const updatedUser = await User.findOneAndUpdate(
        {
          email: candidate.email,
        },
        {
          $set: {
            lastEnter: Date.now(),
            enteredBySocial: true,
          },
        },
        {
          returnDocument: "after",
        }
      );

      const userDto = new UserDto(updatedUser);

      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      const userData = {
        ...tokens,
        user: userDto,
      };

      return cb(null, userData);
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://review-project-server-production.up.railway.app/auth/google/callback",
      scope: ["profile", "email"],
      state: true,
    },
    async function (_, __, profile, cb) {
      const candidate = await User.findOne({ email: profile.emails[0].value });

      if (!candidate) {
        const user = await User.create({
          email: profile.emails[0].value,
          username: profile.displayName,
          enteredBySocial: true,
          fromGoogle: true,
        });

        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({
          ...userDto,
        });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        const userData = {
          ...tokens,
          user: userDto,
        };

        return cb(null, userData);
      }

      if (candidate.status === "Blocked") {
        throw ApiError.BadRequest(`User is blocked, contact with admin`);
      }

      const updatedUser = await User.findOneAndUpdate(
        {
          email: candidate.email,
        },
        {
          $set: {
            lastEnter: Date.now(),
            enteredBySocial: true,
          },
        },
        {
          returnDocument: "after",
        }
      );

      const userDto = new UserDto(updatedUser);

      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);
      const userData = {
        ...tokens,
        user: userDto,
      };

      return cb(null, userData);
    }
  )
);

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

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
router.get("/users/:id", authController.getUser);

router.get(
  "/twitter",
  passport.authenticate("twitter", { scope: ["profile", "email"] })
);

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: `${process.env.CLIENT_URL + "/signin"}`,
  }),
  function (req, res) {
    const { user } = req;
    res.cookie("refreshToken", user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect(process.env.CLIENT_URL);
  }
);

//google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL + "/signin"}`,
    failureMessage: true,
  }),
  function (req, res) {
    const { user } = req;
    res.cookie("refreshToken", user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect(process.env.CLIENT_URL);
  }
);
router.get("/get-user", (req, res) => {
  console.log("yes");
  res.send(req.user);
});

router.get("/social-logout", async (req, res) => {
  if (req.user) {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.send("done");
    });
  }
});

// twitter

export default router;
