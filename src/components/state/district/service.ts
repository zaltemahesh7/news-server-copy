import { District, IDistrict } from "./model";

export const districtService = {
  /**
   * Create a new district
   */
  createDistrict: async (districtData: Partial<IDistrict>) => {
    try {
      if (!districtData.name || !districtData.createdBy) {
        throw new Error("District name and createdBy are required");
      }

      const existing = await District.findOne({ name: districtData.name });
      if (existing) {
        throw new Error("District with this name already exists");
      }

      const district = new District(districtData);
      return await district.save();
    } catch (error: any) {
      console.error("Error creating district:", error.message);
      throw new Error(error.message || "Failed to create district");
    }
  },

  /**
   * Get all districts with optional filters
   */
  getAllDistricts: async (query: any) => {
    try {
      const { page = 1, limit = 10, stateId, isActive } = query;
      const filters: any = {};

      if (stateId) filters.stateId = stateId;
      if (typeof isActive !== "undefined") filters.isActive = isActive;

      const skip = (Number(page) - 1) * Number(limit);

      const [districts, total] = await Promise.all([
        District.find(filters)
          // .populate("stateId", "name")
          .populate("createdBy", "name email")
          .sort({ name: 1 })
          .skip(skip)
          .limit(Number(limit)),
        District.countDocuments(filters),
      ]);

      return {
        data: districts,
        pagination: {
          total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error: any) {
      console.error("Error fetching districts:", error.message);
      throw new Error(error.message || "Failed to fetch districts");
    }
  },

  /**
   * Get a district by ID
   */
  getDistrictById: async (id: string) => {
    try {
      const district = await District.findById(id)
        .populate("stateId", "name")
        .populate("createdBy", "name email");
      if (!district) throw new Error("District not found");
      return district;
    } catch (error: any) {
      console.error("Error fetching district by ID:", error.message);
      throw new Error(error.message || "Failed to get district");
    }
  },

  /**
   * Update a district
   */
  updateDistrict: async (id: string, updateData: Partial<IDistrict>) => {
    try {
      const updated = await District.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updated) throw new Error("District not found");
      return updated;
    } catch (error: any) {
      console.error("Error updating district:", error.message);
      throw new Error(error.message || "Failed to update district");
    }
  },

  /**
   * Delete a district
   */
  deleteDistrict: async (id: string) => {
    try {
      const deleted = await District.findByIdAndDelete(id);
      if (!deleted) throw new Error("District not found");
      return { message: "District deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting district:", error.message);
      throw new Error(error.message || "Failed to delete district");
    }
  },
};
