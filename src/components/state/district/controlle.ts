import { Request, Response } from "express";
import { districtService } from "./service";

export const districtController = {
  /**
   * Create a new district
   */
  createDistrict: async (req: Request, res: Response) => {
    try {
      const { name, stateId, code, description, isActive } = req.body;
      const createdBy = (req as any)?.user?.id;

      if (!name || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "District name and createdBy are required",
        });
      }

      const district = await districtService.createDistrict({
        name,
        stateId,
        code,
        description,
        createdBy,
        isActive,
      });

      res.status(201).json({
        success: true,
        message: "District created successfully",
        data: district,
      });
    } catch (error: any) {
      console.error("Error creating district:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get all districts with pagination and filters
   */
  getAllDistricts: async (req: Request, res: Response) => {
    try {
      const districts = await districtService.getAllDistricts(req.query);
      res.status(200).json({
        success: true,
        message: "Districts fetched successfully",
        ...districts,
      });
    } catch (error: any) {
      console.error("Error fetching districts:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get district by ID
   */
  getDistrictById: async (req: Request, res: Response) => {
    try {
      const district = await districtService.getDistrictById(req.params.id);
      res.status(200).json({
        success: true,
        message: "District fetched successfully",
        data: district,
      });
    } catch (error: any) {
      console.error("Error fetching district by ID:", error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  /**
   * Update district
   */
  updateDistrict: async (req: Request, res: Response) => {
    try {
      const updated = await districtService.updateDistrict(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "District updated successfully",
        data: updated,
      });
    } catch (error: any) {
      console.error("Error updating district:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Delete district
   */
  deleteDistrict: async (req: Request, res: Response) => {
    try {
      const result = await districtService.deleteDistrict(req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("Error deleting district:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
