import tagService from "../services/tagService.js";

class TagController {
  async getTags(_, res, next) {
    try {
      const tags = await tagService.getAllTags();

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
