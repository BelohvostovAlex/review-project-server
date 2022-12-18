import artItemService from "../services/artItemService.js";

class ArtItemController {
  async getArtItems(_, res, next) {
    try {
      const artItems = await artItemService.getAllArtItems();

      return res.json(artItems);
    } catch (error) {
      next(error);
    }
  }

  async createArtItem(req, res, next) {
    try {
      const { title } = req.body;

      const artItem = await artItemService.createArtItem(title);

      return res.json(artItem);
    } catch (error) {
      next(error);
    }
  }

  async rateArtItem(req, res, next) {
    try {
      const { id, userId, rate } = req.body;

      const artItem = await artItemService.rateArtItem(id, userId, rate);

      return res.json(artItem);
    } catch (error) {
      next(error);
    }
  }
}

export default new ArtItemController();
