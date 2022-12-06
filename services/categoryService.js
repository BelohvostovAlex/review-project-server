import Category from "../models/Category.js";

class CategoryService {
  async createCategory(title) {
    const isCategoryExists = await Category.findOne({ title });

    if (isCategoryExists) {
      throw ApiError.BadRequest(
        `Category with title: '${title}' is already exists`
      );
    }

    const category = await Category.create({
      title,
    });

    return category;
  }

  async getCategories() {
    const categories = await Category.find();

    return categories;
  }
}

export default new CategoryService();
