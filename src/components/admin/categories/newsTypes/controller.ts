import { Request, Response } from "express";
import newsTypeService from "./service";

const newsTypeController = {
  // Create a new news type
  createNewsType: async (req: Request, res: Response) => {
    try {
      const payload = req.body;
      payload.createdBy = (req as any)?.user?.id;
      const newsType = await newsTypeService.createNewsType(payload);
      res.status(201).json({ success: true, message: "News type created successfully", newsType });
    } catch (error: any) {
      res
        .status(error.statusCode || 400)
        .json({ success: false, message: error.message || "Failed to create news type" });
    }
  },

  // Get all news types
  getNewsTypes: async (_req: Request, res: Response) => {
    try {
      const newsTypes = await newsTypeService.getNewsTypes();
      res.status(200).json(newsTypes);
    } catch (error: any) {
      res
        .status(error.statusCode || 400)
        .json({ success: false, message: error.message || "Failed to fetch news types" });
    }
  },

  // Get news type by ID
  getNewsTypeById: async (req: Request, res: Response) => {
    try {
      const newsType = await newsTypeService.getNewsTypeById(req.params.id);
      res.status(200).json(newsType);
    } catch (error: any) {
      res
        .status(error.statusCode || 400)
        .json({ success: false, message: error.message || "Failed to get news type" });
    }
  },

  // Update news type
  updateNewsType: async (req: Request, res: Response) => {
    try {
      const updated = await newsTypeService.updateNewsType(req.params.id, req.body);
      res.status(200).json({ message: "News type updated successfully", updated });
    } catch (error: any) {
      res.status(error.statusCode || 400).json({ success: false, message: error.message });
    }
  },

  // Delete news type
  deleteNewsType: async (req: Request, res: Response) => {
    try {
      const result = await newsTypeService.deleteNewsType(req.params.id);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(error.statusCode || 400)
        .json({ success: false, message: error.message || "Failed to delete news type" });
    }
  },
};

export default newsTypeController;
