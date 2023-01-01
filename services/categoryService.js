import Category from "../models/Category.js";

class CategoryService {
  async getCategories() {
    const categories = await Category.find();

    return categories;
  }
}

export default new CategoryService();
