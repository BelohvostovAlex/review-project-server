import Tag from "../models/Tag.js";

class TagService {
  async getAllTags() {
    const tags = await Tag.find();

    return tags;
  }

  async createTag(title) {
    const isTagExists = await Tag.findOne({ title });

    if (isTagExists) {
      throw ApiError.BadRequest(
        `Tag ${title} is already exists, please create another one`
      );
    }
    const tag = await Tag.create({
      title,
    });

    return tag;
  }
}

export default new TagService();
