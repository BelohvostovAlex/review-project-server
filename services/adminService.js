import Category from "../models/Category.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";

class AdminService {
  async getAllUsers() {
    const users = await User.find();

    return users;
  }

  async deleteUser(id) {
    await User.findByIdAndDelete({ _id: id });
    await Review.deleteMany({ creator: id });
    await Review.updateMany(
      { likes: { $in: id } },
      {
        $pull: {
          likes: id,
        },
      },
      {
        returnDocument: "after",
      }
    );

    await Comment.deleteMany({ sender: id });
    await Rating.deleteMany({ user: id });
  }

  async changeUserStatus(id, status) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { status },
      },
      {
        returnDocument: "after",
      }
    );
  }

  async changeUserRole(id, role) {
    await User.findByIdAndUpdate(
      { _id: id },
      {
        $set: { role },
      },
      {
        returnDocument: "after",
      }
    );
  }

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

  async deleteCategory(id) {
    await Category.findByIdAndDelete({ _id: id });
  }
}

export default new AdminService();
