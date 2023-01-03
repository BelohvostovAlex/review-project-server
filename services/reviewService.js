import Comment from "../models/Comment.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import authService from "./authService.js";

class ReviewService {
  async getAllReviews(page, limit, search, sortBy, category, sort) {
    const reviews = await Review.find()
      .populate([
        "artItem",
        {
          path: "artItem",
          populate: { path: "rating" },
        },
        "tags",
      ])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);
    if (sort[0] === "rating") {
      reviews.sort((a, b) => b.artItem.averageRating - a.artItem.averageRating);
    }

    const total = await Review.countDocuments();

    return {
      reviews,
      total,
      page: page + 1,
      limit,
    };
  }
  async getReview(id) {
    const review = await Review.findOne({ _id: id }).populate([
      "artItem",
      {
        path: "artItem",
        populate: { path: "rating" },
      },
      "tags",
      "comments",
      {
        path: "comments",
        populate: { path: "sender" },
      },
    ]);

    if (!review) {
      throw ApiError.BadRequest(`Review is not found`);
    }

    return review;
  }

  async getRelatedReviews(id) {
    const reviews = await Review.find({ artItem: id }).populate([
      "artItem",
      {
        path: "artItem",
        populate: { path: "rating" },
      },
      "tags",
    ]);

    if (!reviews) {
      throw ApiError.BadRequest(`Reviews are not found`);
    }

    return reviews;
  }

  async getAllReviewsByTag(id) {
    const reviews = await Review.find({
      tags: { $in: id },
    })
      .populate([
        "artItem",
        {
          path: "artItem",
          populate: { path: "rating" },
        },
        "tags",
      ])
      .limit(10);

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

    await authService.updateCreatedReviewsUser(creator, newReview);

    return newReview;
  }
  async likeReview(id, likeId) {
    const isReviewAlreadyLiked = await Review.findOne({
      _id: id,
      likes: { $in: likeId },
    });

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
    const review = await Review.findOneAndUpdate(
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
  async getCreatorLikes(id) {
    const reviews = await Review.find({ creator: id }).populate(["likes"]);
    const likes = reviews.reduce((acc, curr) => acc + curr.likes.length, 0);

    return likes;
  }

  async getCreatorReviews(id) {
    const reviews = await Review.find({ creator: id }).populate([
      "artItem",
      {
        path: "artItem",
        populate: { path: "rating" },
      },
      "tags",
    ]);

    return reviews;
  }

  async deleteReview(id) {
    await Review.deleteOne({ _id: id });
  }

  async updateReview(
    id,
    creator,
    title,
    artItem,
    text,
    image,
    category,
    tags,
    grade
  ) {
    const updatedReview = await Review.updateOne(
      { _id: id },
      {
        creator,
        title,
        artItem,
        text,
        image,
        category,
        tags,
        grade,
        updatedAt: Date.now(),
      },
      {
        returnDocument: "after",
      }
    );
    if (!updatedReview) {
      throw ApiError.BadRequest(`Cant update a review...`);
    }
    return updatedReview;
  }

  async createComment(id, userId, text) {
    const comment = await Comment.create({
      review: id,
      sender: userId,
      text: text,
    });

    if (!comment) {
      throw ApiError.BadRequest(`Cant create a comment...`);
    }

    await Review.updateOne(
      {
        _id: id,
      },
      {
        $push: {
          comments: comment,
        },
      },
      {
        returnDocument: "after",
      }
    );

    return comment;
  }
}

export default new ReviewService();
