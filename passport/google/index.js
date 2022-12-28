import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../../models/User";
import tokenService from "../../services/tokenService";
import { UserDto } from "../../dtos/user-dto";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      scope: ["profile"],
      state: true,
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(profile);

      const candidate = await User.findOne({ email });

      if (!candidate) {
        const user = await User.create({
          email: profile.email,
          username: profile.displayName,
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

      const updatedUser = await User.findOneAndUpdate(
        {
          email: candidate.email,
        },
        {
          $set: {
            lastEnter: Date.now(),
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
