import { Request, Response } from "express";
import analyticsService from "./service";

export const analyticsController = {
  usersByCity: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const response = await analyticsService.getActiveUsersByCity({
        startDate: startDate as string,
        endDate: endDate as string,
      });

      const rows = response?.rows || [];

      res.json({
        success: true,
        data: rows,
      });
    } catch (err: any) {
      console.error("Error fetching users by city:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users by city",
        error: err?.message || err,
      });
    }
  },
};
