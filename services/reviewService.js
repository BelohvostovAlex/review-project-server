import Review from "../models/Review.js";
import User from "../models/User.js";
import authService from "./authService.js";

class ReviewService {
  async getAllReviews() {
    const reviews = await Review.find();

    return reviews;
  }
  async getReview(id) {
    const review = await Review.findOne({ _id: id });

    if (!review) {
      throw ApiError.BadRequest(`Review is not found`);
    }

    return review;
  }
  async createReview(
    creator,
    title,
    artItem,
    text,
    image,
    category,
    tags,
    grade
  ) {
    const isReviewExists = await Review.findOne({ creator, title });

    if (isReviewExists) {
      throw ApiError.BadRequest(
        `You had already wrote the review to this art item`
      );
    }

    const newReview = await Review.create({
      creator,
      title,
      artItem,
      text,
      image,
      category,
      tags,
      grade,
    });

    const updatedUser = await authService.updateCreatedReviewsUser(
      creator,
      newReview
    );

    return newReview;
  }
  async likeReview(id, likeId) {
    const isReviewAlreadyLiked = await Review.findOne({
      likes: { $in: likeId },
    });
    console.log(isReviewAlreadyLiked);
    if (isReviewAlreadyLiked) {
      const review = await Review.updateOne(
        {
          _id: id,
        },
        {
          $pull: {
            likes: likeId,
          },
        },
        {
          returnDocument: "after",
        }
      );
      await User.updateOne(
        {
          _id: likeId,
        },
        {
          $pull: {
            likedReviews: id,
          },
        },
        {
          returnDocument: "after",
        }
      );
      return review;
    }
    const review = await Review.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          likes: likeId,
        },
      },
      {
        returnDocument: "after",
      }
    );
    await User.updateOne(
      {
        _id: likeId,
      },
      {
        $push: {
          likedReviews: id,
        },
      },
      {
        returnDocument: "after",
      }
    );
    return review;
  }
}

export default new ReviewService();
