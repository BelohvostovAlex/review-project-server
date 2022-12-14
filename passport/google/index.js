import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";

import tokenService from "../../services/tokenService.js";

import User from "../../models/User.js";
import { UserDto } from "../../dtos/user-dto.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    scope: ["profile", "email"],
    state: true,
  },
  async function (_, __, profile, cb) {
    const candidate = await User.findOne({ email: profile.emails[0].value });

    if (!candidate) {
      const isUniqueUserName = await User.findOne({
        username: profile.displayName,
      });

      if (isUniqueUserName) {
        throw ApiError.BadRequest(
          `Username is already used, please choose another.`
        );
      }

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
);
