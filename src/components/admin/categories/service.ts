import { Category, ICategory } from "./model";

export const categoryService = {
  /**
   * Create a new category
   */
  createCategory: async (categoryData: Partial<ICategory>) => {
    try {
      if (!categoryData.name || !categoryData.createdBy) {
        throw new Error("Category name and createdBy are required");
      }

      const existing = await Category.findOne({ name: categoryData.name });
      if (existing) throw new Error("Category already exists");

      const newCategory = new Category(categoryData);
      return await newCategory.save();
    } catch (error: any) {
      console.error("Error creating category:", error.message);
      throw new Error(error.message || "Failed to create category");
    }
  },

  /**
   * Get all categories
   */
  getCategories: async () => {
    try {
      return await Category.find().populate("createdBy", "name").sort({ createdAt: -1 });
    } catch (error: any) {
      console.error("Error fetching categories:", error.message);
      throw new Error(error.message || "Failed to fetch categories");
    }
  },

  /**
   * Get single category by ID
   */
  getCategoryById: async (id: string) => {
    try {
      const category = await Category.findById(id).populate("createdBy", "name email");
      if (!category) throw new Error("Category not found");
      return category;
    } catch (error: any) {
      console.error("Error fetching category:", error.message);
      throw new Error(error.message || "Failed to get category");
    }
  },

  /**
   * Update a category
   */
  updateCategory: async (id: string, updateData: Partial<ICategory>) => {
    try {
      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedCategory) throw new Error("Category not found");
      return updatedCategory;
    } catch (error: any) {
      console.error("Error updating category:", error.message);
      throw new Error(error.message || "Failed to update category");
    }
  },

  /**
   * Delete a category
   */
  deleteCategory: async (id: string) => {
    try {
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) throw new Error("Category not found");
      return { success: true, message: "Category deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting category:", error.message);
      throw new Error(error.message || "Failed to delete category");
    }
  },
};
