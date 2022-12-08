import reviewService from "../services/reviewService.js";

class ReviewsController {
  async getReviews(_, res, next) {
    try {
      const reviews = await reviewService.getAllReviews();

      return res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async createReview(req, res, next) {
    try {
      const { creator, title, artItem, text, image, category, tags, grade } =
        req.body;

      const review = await reviewService.createReview(
        creator,
        title,
        artItem,
        text,
        image,
        category,
        tags,
        grade
      );

      return res.json(review);
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async likeReview(req, res, next) {
    try {
      const { likeId } = req.body;
      const { id } = req.params;

      const review = await reviewService.likeReview(id, likeId);

      return res.json(review);
    } catch (error) {
      next(error);
    }
  }

  async getReview(req, res, next) {
    try {
      const { id } = req.params;
      const review = await reviewService.getReview(id);

      return res.json(review);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewsController();
