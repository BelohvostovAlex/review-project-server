import authService from "./authService.js";
import ratingService from "./ratingService.js";

import ArtItem from "../models/ArtItem.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js";

class ArtItemService {
  async getAllArtItems() {
    const artItems = await ArtItem.find();

    return artItems;
  }

  async createArtItem(title) {
    const isArtItemExists = await ArtItem.findOne({ title });

    if (isArtItemExists) {
      throw ApiError.BadRequest(
        `Art item with title: '${title}' is already exists`
      );
    }
    const artItem = await ArtItem.create({
      title,
    });

    return artItem;
  }

  async rateArtItem(id, userId, rate) {
    const user = await User.findOne({ _id: userId, ratedArtItems: id });

    if (user) {
      const updatedRating = await ratingService.updateRating(id, userId, rate);
      const allRatings = await Rating.find({ artItem: id });
      const allRates = allRatings.reduce((acc, curr) => acc + curr.rate, 0);
      const newAverageRating = (allRates / allRatings.length).toFixed(2);

      const updatedArtItem = await ArtItem.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            averageRating: newAverageRating,
          },
        },
        {
          returnDocument: "after",
        }
      );
      await authService.updateRatedArtItemsCurrentUser(
        userId,
        updatedArtItem._id
      );
      return updatedArtItem;
    }

    const newRating = await ratingService.createRating(userId, rate, id);
    const allRatings = await Rating.find({ artItem: id });
    const allRates = allRatings.reduce((acc, curr) => acc + curr.rate, 0);
    const newAverageRating = (allRates / allRatings.length).toFixed(2);
    const updatedArtItem = await ArtItem.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          rating: newRating,
        },
        $set: {
          averageRating: newAverageRating,
        },
      },
      {
        returnDocument: "after",
      }
    );

    await authService.updateRatedArtItemsCurrentUser(
      userId,
      updatedArtItem._id
    );

    return updatedArtItem;
  }
}

export default new ArtItemService();
