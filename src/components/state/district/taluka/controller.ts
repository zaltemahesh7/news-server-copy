import { Request, Response } from "express";
import { talukaService } from "./service";

export const talukaController = {
  /**
   * Create a new Taluka
   */
  createTaluka: async (req: Request, res: Response) => {
    try {
      const { name, districtId, code, description, isActive } = req.body;
      const createdBy = (req as any)?.user?.id;

      if (!name || !districtId || !createdBy) {
        return res.status(400).json({
          success: false,
          message: "Taluka name, districtId, and createdBy are required",
        });
      }

      const taluka = await talukaService.createTaluka({
        name,
        districtId,
        code,
        description,
        createdBy,
        isActive,
      });

      res.status(201).json({
        success: true,
        message: "Taluka created successfully",
        data: taluka,
      });
    } catch (error: any) {
      console.error("Error creating taluka:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get all Talukas with pagination & filters
   */
  getAllTalukas: async (req: Request, res: Response) => {
    try {
      const result = await talukaService.getAllTalukas(req.query);
      res.status(200).json({
        success: true,
        message: "Talukas fetched successfully",
        ...result,
      });
    } catch (error: any) {
      console.error("Error fetching talukas:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get Taluka by ID
   */
  getTalukaById: async (req: Request, res: Response) => {
    try {
      const taluka = await talukaService.getTalukaById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Taluka fetched successfully",
        data: taluka,
      });
    } catch (error: any) {
      console.error("Error fetching taluka by ID:", error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  /**
   * Update Taluka
   */
  updateTaluka: async (req: Request, res: Response) => {
    try {
      const updated = await talukaService.updateTaluka(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "Taluka updated successfully",
        data: updated,
      });
    } catch (error: any) {
      console.error("Error updating taluka:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Delete Taluka
   */
  deleteTaluka: async (req: Request, res: Response) => {
    try {
      const result = await talukaService.deleteTaluka(req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("Error deleting taluka:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
