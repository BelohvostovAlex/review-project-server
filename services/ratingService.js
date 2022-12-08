import Rating from "../models/Rating.js";

class RatingService {
  async createRating(user, rate, artItem) {
    const rating = await Rating.create({
      user,
      rate,
      artItem,
    });

    return rating;
  }

  async updateRating(artItem, user, rate) {
    const rating = await Rating.updateOne(
      {
        user,
        artItem,
      },
      {
        $set: {
          rate,
        },
      },
      {
        returnDocument: "after",
      }
    );
    return rating;
  }
}

export default new RatingService();
