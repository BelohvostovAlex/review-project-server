import TwitterStrategy from "passport-twitter";
import dotenv from "dotenv";

import tokenService from "../../services/tokenService.js";

import User from "../../models/User.js";
import { UserDto } from "../../dtos/user-dto.js";

dotenv.config();

export const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CLIENT_ID,
    consumerSecret: process.env.TWITTER_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/twitter/callback`,
    includeEmail: true,
  },
  async function (_, __, profile, cb) {
    const candidate = await User.findOne({ email: profile.emails[0].value });

    if (!candidate) {
      const isUniqueUserName = await User.findOne({
        username: profile.username,
      });

      if (isUniqueUserName) {
        throw ApiError.BadRequest(
          `Username is already used, please choose another`
        );
      }

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
      throw ApiError.BadRequest(`User is blocked, contact with admin.`);
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
