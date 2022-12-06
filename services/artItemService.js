import authService from "./authService.js";
import ratingService from "./ratingService.js";

import ArtItem from "../models/ArtItem.js";

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
    const user = await authService.getCurrentUser(userId);
    const newRating = await ratingService.createRating(user.id, rate);

    const updatedArtItem = await ArtItem.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $push: {
          rating: newRating,
        },
      },
      {
        returnDocument: "after",
      }
    );
    const updatedUser = await authService.updateRatedArtItemsCurrentUser(
      userId,
      updatedArtItem
    );

    return updatedArtItem;
  }
}

export default new ArtItemService();
