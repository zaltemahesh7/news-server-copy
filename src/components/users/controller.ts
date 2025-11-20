import { Request, Response } from "express";
import userService from "./service";

const userController = {
  /**
   * Get all users with optional filters & pagination
   */
  getUsers: async (req: Request, res: Response) => {
    try {
      const data = await userService.getUsers(req.query);

      res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        ...data,
      });
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  },

  /**
   * Get User by ID
   */
  getUserById: async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error: any) {
      console.error("Error fetching user:", error.message);
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  },

  /**
   * Change user role
   */
  changeRole: async (req: Request, res: Response) => {
    try {
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          message: "Role is required",
        });
      }

      const updated = await userService.changeRole(req.params.id, role);

      res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: updated,
      });
    } catch (error: any) {
      console.error("Error updating role:", error.message);
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update role",
      });
    }
  },
};

export default userController;
