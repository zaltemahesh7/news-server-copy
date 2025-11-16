import { Request, Response } from "express";
import newsServiceAdmin from "./service";

const newsController = {
  // getNews: async (req: Request, res: Response) => {
  //   try {
  //     const results = await newsServiceAdmin.getNews();
  //     res.status(200).json(results);
  //   } catch (error: any) {
  //     res
  //       .status(error.statusCode || 500)
  //       .json({ message: error.message || "Failed to fetch news" });
  //   }
  // },
  getNewsById: async (req: Request, res: Response) => {},

  getNews: async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const pagination = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
      };

      const result = await newsServiceAdmin.getFilteredNews(filters, pagination);

      res.json(result);
    } catch (error: any) {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "Failed to fetch FilteredNews" });
    }
  },
};

export default newsController;
