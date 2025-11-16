import { NewsType, INewsType } from "./model";

const newsTypeService = {
  /**
   * Create a new news type
   */
  createNewsType: async (data: Partial<INewsType>) => {
    try {
      if (!data.name || !data.createdBy) {
        throw new Error("Name and createdBy are required");
      }

      const existingType = await NewsType.findOne({ name: data.name });
      if (existingType) {
        throw new Error("News type already exists");
      }

      const newType = new NewsType(data);
      return await newType.save();
    } catch (error: any) {
      console.error("Error creating news type:", error.message);
      throw new Error(error.message || "Failed to create news type");
    }
  },

  /**
   * Get all news types
   */
  getNewsTypes: async () => {
    try {
      return await NewsType.find().populate("createdBy", "name email role").sort({ createdAt: -1 });
    } catch (error: any) {
      console.error("Error fetching news types:", error.message);
      throw new Error(error.message || "Failed to fetch news types");
    }
  },

  /**
   * Get single news type by ID
   */
  getNewsTypeById: async (id: string) => {
    try {
      const newsType = await NewsType.findById(id).populate("createdBy", "name email");
      if (!newsType) throw new Error("News type not found");
      return newsType;
    } catch (error: any) {
      console.error("Error fetching news type:", error.message);
      throw new Error(error.message || "Failed to get news type");
    }
  },

  /**
   * Update a news type
   */
  updateNewsType: async (id: string, updateData: Partial<INewsType>) => {
    try {
      const updatedType = await NewsType.findByIdAndUpdate(id, updateData, { new: true });
      if (!updatedType) throw new Error("News type not found");
      return updatedType;
    } catch (error: any) {
      console.error("Error updating news type:", error.message);
      throw new Error(error.message || "Failed to update news type");
    }
  },

  /**
   * Delete a news type
   */
  deleteNewsType: async (id: string) => {
    try {
      const deleted = await NewsType.findByIdAndDelete(id);
      if (!deleted) throw new Error("News type not found");
      return { message: "News type deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting news type:", error.message);
      throw new Error(error.message || "Failed to delete news type");
    }
  },
};

export default newsTypeService;