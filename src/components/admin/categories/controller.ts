import { Request, Response } from "express";
import { categoryService } from "./service";

export const categoryController = {
  // Create a new category
  createCategory: async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      payload.createdBy = (req as any)?.user?.id;
      const category = await categoryService.createCategory(payload);
      res.status(201).json({ success: true, message: "Category created successfully", category });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ succes: false, message: error.message || "Failed to create category" });
    }
  },

  // Get all categories
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await categoryService.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Failed to get category" });
    }
  },

  // Get category by ID
  getCategoryById: async (req: Request, res: Response) => {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.status(200).json({ success: true, data: category });
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ success: false, message: error.message || "Failed to get category" });
    }
  },

  // Update category
  updateCategory: async (req: Request, res: Response) => {
    try {
      const updated = await categoryService.updateCategory(req.params.id, req.body);
      res.status(200).json({ success: true, message: "Category updated successfully", updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Delete category
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const result = await categoryService.deleteCategory(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
