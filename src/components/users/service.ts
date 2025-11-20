import mongoose from "mongoose";
import { User } from "./auth/model";

const userService = {
  /**
   * Get all users with optional filters & pagination
   */
  getUsers: async (query: any) => {
    try {
      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 20;
      const skip = (page - 1) * limit;

      const filters: any = {};

      if (query.role) filters.role = query.role;
      if (query.isActive) filters.isActive = query.isActive === "true";

      const users = await User.find(filters)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const count = await User.countDocuments(filters);

      return {
        users,
        pagination: {
          total: count,
          page,
          limit,
          pages: Math.ceil(count / limit),
        },
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const user = await User.findById(id).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  /**
   * Change user's role
   */
  changeRole: async (id: string, newRole: string) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid user ID");
      }

      const allowedRoles = ["admin", "anchor", "user"];
      if (!allowedRoles.includes(newRole)) {
        throw new Error("Invalid role value");
      }

      const updatedUser = await User.findByIdAndUpdate(id, { role: newRole }, { new: true }).select(
        "-password",
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};

export default userService;
