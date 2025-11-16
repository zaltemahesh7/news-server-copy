import { IUser, User } from "./model";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../../middlewares/authMiddleware/auth.middleware";
import mongoose from "mongoose";

const authService = {
  registerUser: async (userData: Partial<IUser>) => {
    try {
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        const error: any = new Error("Name, email, and password are required");
        error.statusCode = 400;
        throw error;
      }

      // Check for existing user
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email is already registered");
      }

      // Create and save new user
      const newUser = new User(userData);
      const savedUser = await newUser.save();

      // Return without password
      const { password, ...userWithoutPassword } = savedUser.toObject();
      return userWithoutPassword;
    } catch (error: any) {
      throw error;
    }
  },

  loginUser: async (email: string, password: string) => {
    try {
      // Validate input
      if (!email || !password) {
        const error = new Error("Email and password are required");
        throw error;
      }

      // Find user by email
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        throw new Error("User not found");
      }

      // Compare password
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT
      const token = generateToken(user.id, user.email, user.role);

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user.toObject();
      return {
        message: "Login successful",
        token,
        user: userWithoutPassword,
      };
    } catch (error: any) {
      throw error;
    }
  },

  changeRole: async (id: any, role: any = "user") => {
    try {
      // Validate required fields
      if (!id) {
        const error: any = new Error("User ID is required");
        error.statusCode = 400;
        throw error;
      }

      // Validate role input
      const validRoles = ["user", "admin", "moderator"]; // Add your valid roles here
      if (!validRoles.includes(role)) {
        const error: any = new Error(`Invalid role. Must be one of: ${validRoles.join(", ")}`);
        error.statusCode = 400;
        throw error;
      }

      // Validate ID format (if using MongoDB ObjectId)
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const error: any = new Error("Invalid user ID format");
        error.statusCode = 400;
        throw error;
      }

      // Check for existing user and update role
      const existingUser = await User.findByIdAndUpdate(
        id,
        { role: role },
        { new: true, runValidators: true }, // Return updated document and run validators
      );

      // Verify user was found and updated
      if (!existingUser) {
        const error: any = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      // Log the role change for audit purposes
      console.log(`User ${existingUser._id} role changed to: ${role}`);

      return {
        success: true,
        message: `User role updated successfully to ${role}`,
        user: {
          id: existingUser._id,
          email: existingUser.email, // or other identifying fields
          role: existingUser.role,
        },
      };
    } catch (error: any) {
      // Enhance error information
      if (error.name === "CastError") {
        error.message = "Invalid user ID format";
        error.statusCode = 400;
      }

      console.error(`Error changing role for user ${id}:`, error.message);
      throw error;
    }
  },
};

export default authService;
