import Tag from "../models/Tag.js";

class TagService {
  async getAllTags() {
    const tags = await Tag.find();

    return tags;
  }

  async createTag(title) {
    const tag = await Tag.create({
      title,
    });

    return tag;
  }
}

export default new TagService();
