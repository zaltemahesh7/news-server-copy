import { Subcategory, ISubcategory } from "./model";
import { Category } from "../model";

export const subcategoryService = {
  /**
   * Create a new subcategory
   */
  createSubcategory: async (subcategoryData: Partial<ISubcategory>) => {
    try {
      const { name, categoryId, createdBy } = subcategoryData;

      if (!name || !categoryId || !createdBy) {
        throw new Error("Subcategory name, categoryId, and createdBy are required");
      }

      // Check if category exists
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) throw new Error("Category not found");

      // Check duplicate name under same category
      const existing = await Subcategory.findOne({ name, categoryId });
      if (existing) throw new Error("Subcategory already exists in this category");

      const newSubcategory = new Subcategory(subcategoryData);
      return { success: true, data: await newSubcategory.save() };
    } catch (error: any) {
      console.error("Error creating subcategory:", error.message);
      throw new Error(error.message || "Failed to create subcategory");
    }
  },

  /**
   * Get all subcategories (optionally filtered by category)
   */
  getSubcategories: async (categoryId?: string) => {
    try {
      const query = categoryId ? { categoryId } : {};
      return {
        success: true,
        data: await Subcategory.find(query)
          .populate("categoryId", "name")
          .populate("createdBy", "name email role")
          .sort({ createdAt: -1 }),
      };
    } catch (error: any) {
      console.error("Error fetching subcategories:", error.message);
      throw new Error(error.message || "Failed to fetch subcategories");
    }
  },

  /**
   * Get subcategory by ID
   */
  getSubcategoryById: async (id: string) => {
    try {
      const subcategory = await Subcategory.findById(id)
        .populate("categoryId", "name")
        .populate("createdBy", "name email role");
      if (!subcategory) throw new Error("Subcategory not found");
      return { success: true, data: subcategory };
    } catch (error: any) {
      console.error("Error fetching subcategory:", error.message);
      throw new Error(error.message || "Failed to fetch subcategory");
    }
  },

  /**
   * Update subcategory details
   */
  updateSubcategory: async (id: string, updateData: Partial<ISubcategory>) => {
    try {
      const updated = await Subcategory.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) throw new Error("Subcategory not found");
      return { success: true, message: "Subcategory updated successfully", data: updated };
    } catch (error: any) {
      console.error("Error updating subcategory:", error.message);
      throw new Error(error.message || "Failed to update subcategory");
    }
  },

  /**
   * Delete subcategory
   */
  deleteSubcategory: async (id: string) => {
    try {
      const deleted = await Subcategory.findByIdAndDelete(id);
      if (!deleted) throw new Error("Subcategory not found");
      return { success: true, message: "Subcategory deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting subcategory:", error.message);
      throw new Error(error.message || "Failed to delete subcategory");
    }
  },
};
