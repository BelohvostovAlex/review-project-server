import Tag from "../models/Tag.js";

class TagService {
  async getAllTags(page, limit) {
    const total = await Tag.countDocuments();

    const tags = await Tag.find()
      .skip(page * limit)
      .limit(limit);

    return { tags, total, page: page + 1, limit };
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
