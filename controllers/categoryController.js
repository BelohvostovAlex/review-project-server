import categoryService from "../services/categoryService.js";

class CategoryController {
  async getCategories(_, res, next) {
    try {
      const categories = await categoryService.getCategories();

      return res.json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
