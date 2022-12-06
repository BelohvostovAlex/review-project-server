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

  async createCategory(req, res, next) {
    try {
      const { title } = req.body;

      const category = await categoryService.createCategory(title);

      return res.json(category);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
