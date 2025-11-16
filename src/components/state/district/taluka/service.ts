import { Taluka, ITaluka } from "./model";

export const talukaService = {
  /**
   * Create a new Taluka
   */
  createTaluka: async (talukaData: Partial<ITaluka>) => {
    try {
      if (!talukaData.name || !talukaData.districtId || !talukaData.createdBy) {
        throw new Error("Taluka name, districtId, and createdBy are required");
      }

      const existing = await Taluka.findOne({
        name: talukaData.name,
        districtId: talukaData.districtId,
      });
      if (existing) throw new Error("Taluka already exists in this district");

      const taluka = new Taluka(talukaData);
      return await taluka.save();
    } catch (error: any) {
      console.error("Error creating taluka:", error.message);
      throw new Error(error.message || "Failed to create taluka");
    }
  },

  /**
   * Get all Talukas with optional filters (pagination)
   */
  getAllTalukas: async (query: any) => {
    try {
      const { page = 1, limit = 10, districtId, isActive } = query;
      const filters: any = {};

      if (districtId) filters.districtId = districtId;
      if (typeof isActive !== "undefined") filters.isActive = isActive;

      const skip = (Number(page) - 1) * Number(limit);

      const [talukas, total] = await Promise.all([
        Taluka.find(filters)
          .populate("districtId", "name")
          .populate("createdBy", "name email")
          .sort({ name: 1 })
          .skip(skip)
          .limit(Number(limit)),
        Taluka.countDocuments(filters),
      ]);

      return {
        data: talukas,
        pagination: {
          total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error: any) {
      console.error("Error fetching talukas:", error.message);
      throw new Error(error.message || "Failed to fetch talukas");
    }
  },

  /**
   * Get Taluka by ID
   */
  getTalukaById: async (id: string) => {
    try {
      const taluka = await Taluka.findById(id)
        .populate("districtId", "name")
        .populate("createdBy", "name email");
      if (!taluka) throw new Error("Taluka not found");
      return taluka;
    } catch (error: any) {
      console.error("Error fetching taluka by ID:", error.message);
      throw new Error(error.message || "Failed to get taluka");
    }
  },

  /**
   * Update a Taluka
   */
  updateTaluka: async (id: string, updateData: Partial<ITaluka>) => {
    try {
      const updated = await Taluka.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) throw new Error("Taluka not found");
      return updated;
    } catch (error: any) {
      console.error("Error updating taluka:", error.message);
      throw new Error(error.message || "Failed to update taluka");
    }
  },

  /**
   * Delete a Taluka
   */
  deleteTaluka: async (id: string) => {
    try {
      const deleted = await Taluka.findByIdAndDelete(id);
      if (!deleted) throw new Error("Taluka not found");
      return { message: "Taluka deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting taluka:", error.message);
      throw new Error(error.message || "Failed to delete taluka");
    }
  },
};
