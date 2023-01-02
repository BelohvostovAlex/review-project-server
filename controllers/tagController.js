import tagService from "../services/tagService.js";

class TagController {
  async getTags(req, res, next) {
    try {
      const page = parseInt(req.query.page) - 1 || 0;
      const limit = parseInt(req.query.limit) || 0;

      const tags = await tagService.getAllTags(page, limit);

      return res.json(tags);
    } catch (error) {
      next(error);
    }
  }

  async createTag(req, res, next) {
    try {
      const { title } = req.body;

      const tag = await tagService.createTag(title);

      return res.json(tag);
    } catch (error) {
      next(error);
    }
  }
}

export default new TagController();
