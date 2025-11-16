import { Request, Response } from "express";
import { newsService } from "./service";

export const newsController = {
  /**
   * Create a new news article
   */
  createNews: async (req: Request, res: Response) => {
    try {
      const {
        title,
        content,
        categoryId,
        districtId,
        talukaId,
        newsTypeId,
        tags,
        thumbnail,
        media,
        status,
        scheduledAt,
      } = req.body;
      const authorId = (req as any)?.user?.id; // user from auth middleware

      if (!title || !content || !authorId || !categoryId) {
        return res.status(400).json({
          success: false,
          message: "Title, content, authorId, and categoryId are required",
        });
      }

      const news = await newsService.createNews({
        title,
        content,
        authorId,
        categoryId,
        districtId,
        talukaId,
        newsTypeId,
        tags,
        thumbnail,
        media,
        status,
        scheduledAt,
      });

      return res.status(201).json({
        success: true,
        message: "News created successfully",
        data: news,
      });
    } catch (error: any) {
      console.error("Error in createNews:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get all news with pagination and filters
   */
  getAllNews: async (req: Request, res: Response) => {
    try {
      const newsList = await newsService.getAllNews(req.query);
      res.status(200).json({
        success: true,
        message: "News fetched successfully",
        ...newsList,
      });
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Get single news by ID
   */
  getNewsById: async (req: Request, res: Response) => {
    try {
      const news = await newsService.getNewsById(req.params.id);
      res.status(200).json({
        success: true,
        message: "News fetched successfully",
        data: news,
      });
    } catch (error: any) {
      console.error("Error fetching news by ID:", error.message);
      res.status(404).json({ success: false, message: error.message });
    }
  },

  /**
   * Update news article
   */
  updateNews: async (req: Request, res: Response) => {
    try {
      const updated = await newsService.updateNews(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: "News updated successfully",
        data: updated,
      });
    } catch (error: any) {
      console.error("Error updating news:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  /**
   * Delete (soft delete) news
   */
  deleteNews: async (req: Request, res: Response) => {
    try {
      const result = await newsService.deleteNews(req.params.id);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("Error deleting news:", error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  },
};
