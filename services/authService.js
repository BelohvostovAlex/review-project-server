import bcrypt from "bcrypt";

import User from "../models/User.js";
import { UserDto } from "../dtos/user-dto.js";
import tokenService from "./tokenService.js";
import { ApiError } from "../exceptions/api-error.js";

class AuthService {
  async signUp(email, password, username) {
    const candidate = await User.findOne({
      email,
    });

    if (candidate) {
      throw ApiError.BadRequest(`User with email: ${email} already exists`);
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashPassword,
      username,
    });

    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({
      ...userDto,
    });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async signIn(email, password) {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      throw ApiError.BadRequest(`User with dat email: ${email} is not found`);
    }

    if (candidate && !candidate.password && candidate.fromGoogle) {
      throw ApiError.BadRequest(
        `User with dat email: ${email} can login only via google`
      );
    }

    if (candidate && !candidate.password && candidate.fromTwitter) {
      throw ApiError.BadRequest(
        `User with dat email: ${email} can login only via twitter`
      );
    }

    if (candidate.status === "Blocked") {
      throw ApiError.BadRequest(`User is blocked, contact with admin`);
    }

    const isPasswordEqual = await bcrypt.compare(password, candidate.password);

    if (!isPasswordEqual) {
      throw ApiError.BadRequest("Incorrect password");
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        email: candidate.email,
      },
      {
        $set: {
          lastEnter: Date.now(),
          enteredBySocial: false,
          fromGoogle: false,
          fromGithub: false,
        },
      },
      {
        returnDocument: "after",
      }
    );

    const userDto = new UserDto(updatedUser);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async signOut(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async signInWithGoogle(email, username) {
    const candidate = await User.findOne({ email });

    if (!candidate) {
      const user = await User.create({
        email,
        username,
        fromGoogle: true,
      });

      const userDto = new UserDto(user);

      const tokens = tokenService.generateTokens({
        ...userDto,
      });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        ...tokens,
        user: userDto,
      };
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

    return {
      ...tokens,
      user: userDto,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getCurrentUser(userId) {
    try {
      const candidate = await User.findOne({ _id: userId });

      if (!candidate) {
        throw ApiError.BadRequest(`User is not found`);
      }

      return candidate;
    } catch (error) {
      console.log(error);
    }
  }

  async updateRatedArtItemsCurrentUser(userId, artItem) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            ratedArtItems: artItem,
          },
        },
        {
          returnDocument: "after",
        }
      );

      if (!updatedUser) {
        throw ApiError.ServerError();
      }

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCreatedReviewsUser(creator, reviewId) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: creator,
        },
        {
          $push: {
            createdReviews: reviewId,
          },
        },
        {
          returnDocument: "after",
        }
      );

      if (!updatedUser) {
        throw ApiError.ServerError();
      }

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async updateLikedReviewsUser(id, reviewId) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: {
            likedReviews: reviewId,
          },
        },
        {
          returnDocument: "after",
        }
      );

      if (!updatedUser) {
        throw ApiError.ServerError();
      }

      return updatedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(id) {
    const candidate = await User.findOne({ _id: id });

    if (!candidate) {
      throw ApiError.BadRequest(`User is not found`);
    }

    return candidate;
  }
}

export default new AuthService();
