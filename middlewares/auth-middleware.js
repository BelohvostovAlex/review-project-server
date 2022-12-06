import { ApiError } from "../exceptions/api-error.js";
import tokenService from "../services/tokenService.js";

export const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    const isCustomAccessToken = token.length < 500;
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    if (accessToken && isCustomAccessToken) {
      const userData = tokenService.validateAccessToken(accessToken);
      console.log("userData my Token", userData);

      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }

      req.user = userData;
    }

    if (accessToken && !isCustomAccessToken) {
      const userData = tokenService.validateAccessGoogleToken(accessToken);
      console.log("userData google Token", userData);

      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }

      req.user = userData;
    }

    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
};

export const isAdminMiddleware = (req, res, next) => {
  try {
    const regularUser = req.user.role;
    if (regularUser === 0) {
      return next(ApiError.Forbidden());
    }

    next();
  } catch (error) {
    return next(ApiError.Forbidden());
  }
};
