import Review from "../models/Review.js";
import authService from "./authService.js";

class ReviewService {
  async getAllReviews() {
    const reviews = await Review.find();

    return reviews;
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
}

export default new ReviewService();
