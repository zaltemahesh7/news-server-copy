import { User } from "../../users/auth/model";
import { News, INews } from "./model";


type NewsStatus = "draft" | "pending" | "approved" | "rejected" | "published";
type UserRole = "admin" | "anchor" | "user";

interface NewsCounts {
  total: number;
  byStatus: Record<NewsStatus, number>;
}

interface UserCounts {
  total: number;
  byRole: Record<UserRole, number>;
}

export interface DashboardCounts {
  news: NewsCounts;
  users: UserCounts;
}

const ALL_NEWS_STATUSES: NewsStatus[] = ["draft", "pending", "approved", "rejected", "published"];
const ALL_USER_ROLES: UserRole[] = ["admin", "anchor", "user"];

export const newsService = {
  /**
   * Create a new news article
   */
  createNews: async (newsData: Partial<INews>) => {
    try {
      const { title, content, authorId, categoryId } = newsData;
      if (!title || !content || !authorId || !categoryId) {
        throw new Error("Title, content, authorId, and categoryId are required");
      }

      const mediaImgs = newsData.media?.images?.split(",") || [];
      newsData.media = {
        ...newsData.media,
        images: mediaImgs,
      };

      const formattedTags = newsData.tags?.map((tag) => tag.trim().toLowerCase()) || [];

      const newNews = new News({
        ...newsData,
        tags: formattedTags,
        status: newsData.status || "draft",
        isDeleted: false,
      });

      const savedNews = await newNews.save();
      return savedNews;
    } catch (error: any) {
      console.error("Error creating news:", error.message);
      throw new Error(error.message || "Failed to create news");
    }
  },

  /**
   * Get all news articles (with pagination & filters)
   */
  getAllNews: async (query: any) => {
    try {
      const { page = 1, limit = 10, categoryId, authorId, status } = query;
      const filters: any = { isDeleted: false };

      if (categoryId) filters.categoryId = categoryId;
      if (authorId) filters.authorId = authorId;
      if (status) filters.status = status;

      const skip = (page - 1) * limit;

      const [newsList, total] = await Promise.all([
        News.find(filters)
          .populate("authorId", "name email")
          .populate("categoryId", "name")
          .populate("subcategoryId", "name")
          .populate("districtId", "name")
          .populate("talukaId", "name")
          .populate("newsTypeId", "name")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        News.countDocuments(filters),
      ]);

      return {
        data: newsList,
        pagination: {
          total,
          currentPage: Number(page),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
      throw new Error(error.message || "Failed to fetch news");
    }
  },

  /**
   * Get news by ID
   */
  getNewsById: async (id: string) => {
    try {
      const news = await News.findById(id)
        .populate("authorId", "name email")
        .populate("categoryId", "name")
        .populate("subcategoryId", "name")
        .populate("districtId", "name")
        .populate("talukaId", "name")
        .populate("newsTypeId", "name");

      if (!news || news.isDeleted) {
        throw new Error("News not found");
      }
      return news;
    } catch (error: any) {
      console.error("Error fetching news by ID:", error.message);
      throw new Error(error.message || "Failed to get news");
    }
  },

  /**
   * Update news article
   */
  updateNews: async (id: string, updateData: Partial<INews>) => {
    try {
      if (updateData.tags && Array.isArray(updateData.tags)) {
        updateData.tags = updateData.tags.map((tag) => tag.trim().toLowerCase());
      }

      const mediaImgs = updateData.media?.images?.split(",") || [];
      updateData.media = {
        ...updateData.media,
        images: mediaImgs,
      };

      const updatedNews = await News.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedNews) throw new Error("News not found");
      return updatedNews;
    } catch (error: any) {
      console.error("Error updating news:", error.message);
      throw new Error(error.message || "Failed to update news");
    }
  },

  /**
   * Delete (soft delete) news article
   */
  deleteNews: async (id: string) => {
    try {
      const deletedNews = await News.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

      if (!deletedNews) throw new Error("News not found");
      return { message: "News deleted successfully" };
    } catch (error: any) {
      console.error("Error deleting news:", error.message);
      throw new Error(error.message || "Failed to delete news");
    }
  },

  /**
   * Get aggregated counts for news (by status) and users (by role).
   * - news: ignores soft-deleted (isDeleted: true) items
   * - users: counts all users (optionally filter by isActive if desired)
   */
  getDashboardCounts: async (): Promise<DashboardCounts> => {
    try {
      // News aggregation: group by status (ignore soft-deleted)
      const newsAggPromise = News.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Users aggregation: group by role (optionally filter by isActive if you want)
      const userAggPromise = User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      // Run both aggregations in parallel
      const [newsAggResult, userAggResult] = await Promise.all([newsAggPromise, userAggPromise]);

      // Map aggregation results to objects with guaranteed keys
      const newsByStatus: Record<NewsStatus, number> = ALL_NEWS_STATUSES.reduce(
        (acc, status) => {
          acc[status] = 0;
          return acc;
        },
        {} as Record<NewsStatus, number>
      );

      for (const row of newsAggResult) {
        const status = String(row._id) as NewsStatus;
        if (ALL_NEWS_STATUSES.includes(status)) {
          newsByStatus[status] = row.count;
        }
      }

      const userByRole: Record<UserRole, number> = ALL_USER_ROLES.reduce(
        (acc, role) => {
          acc[role] = 0;
          return acc;
        },
        {} as Record<UserRole, number>
      );

      for (const row of userAggResult) {
        const role = String(row._id) as UserRole;
        if (ALL_USER_ROLES.includes(role)) {
          userByRole[role] = row.count;
        }
      }

      // Totals
      const newsTotal = Object.values(newsByStatus).reduce((s, v) => s + v, 0);
      const userTotal = Object.values(userByRole).reduce((s, v) => s + v, 0);

      return {
        news: {
          total: newsTotal,
          byStatus: newsByStatus,
        },
        users: {
          total: userTotal,
          byRole: userByRole,
        },
      };
    } catch (error: any) {
      console.error("Error in getDashboardCounts:", error?.message || error);
      throw new Error(error?.message || "Failed to fetch dashboard counts");
    }
  },
};

