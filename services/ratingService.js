import Rating from "../models/Rating.js";

class RatingService {
  async createRating(user, rate) {
    const rating = await Rating.create({
      user,
      rate,
    });

    return rating;
  }
}

export default new RatingService();
