import adminService from "../services/adminService.js";
import categoryService from "../services/categoryService.js";

class AdminController {
  async getUsers(_, res, next) {
    try {
      const users = await adminService.getAllUsers();

      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      await adminService.deleteUser(id);

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async changeUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await adminService.changeUserStatus(id, status);

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async changeUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      await adminService.changeUserRole(id, role);

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const { title } = req.body;
      const category = await adminService.createCategory(title);

      return res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;

      await adminService.deleteCategory(id);

      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
