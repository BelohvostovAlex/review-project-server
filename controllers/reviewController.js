import reviewService from "../services/reviewService.js";

class ReviewsController {
  async getReviews(req, res, next) {
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 8;
      const search = req.query.search || "";
      const category = req.query.category || "";
      let sort = req.query.sort || "updatedAt";

      req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

      let sortBy = {};
      if (sort !== "rating") {
        if (sort[1]) {
          sortBy[sort[0]] = sort[1];
        } else {
          sortBy[sort[0]] = "desc";
        }
      }

      const reviews = await reviewService.getAllReviews(
        page,
        limit,
        search,
        sortBy,
        category,
        sort
      );

      return res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getAllReviewsByTag(req, res, next) {
    try {
      const tag = req.query.tag;
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 8;

      const reviews = await reviewService.getAllReviewsByTag(page, limit, tag);

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
      const { id } = req.params;
      const { creator, title, artItem, text, image, category, tags, grade } =
        req.body;

      const updatedReview = await reviewService.updateReview(
        id,
        creator,
        title,
        artItem,
        text,
        image,
        category,
        tags,
        grade
      );

      return res.json(updatedReview);
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      await reviewService.deleteReview(id);

      return res.json({
        success: true,
        message: "Your review was successfully deleted",
      });
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

  async getRelatedReviews(req, res, next) {
    try {
      const { id } = req.params;
      const reviews = await reviewService.getRelatedReviews(id);

      return res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getCreatorReviews(req, res, next) {
    try {
      const { id } = req.params;
      const reviews = await reviewService.getCreatorReviews(id);

      return res.json(reviews);
    } catch (error) {
      next(error);
    }
  }

  async getCreatorLikes(req, res, next) {
    try {
      const { id } = req.params;
      const likes = await reviewService.getCreatorLikes(id);

      return res.json(likes);
    } catch (error) {
      next(error);
    }
  }

  async createComment(req, res, next) {
    try {
      const { id, userId, text } = req.body;
      const comment = await reviewService.createComment(id, userId, text);

      return res.json(comment);
    } catch (error) {
      next(error);
    }
  }
}

export default new ReviewsController();
