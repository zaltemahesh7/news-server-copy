import { FilterQuery } from "mongoose";
import { News, INews } from "../admin/news/model";

const newsServiceAdmin = {
  /**
   * Get all news or filter by status/category/author
   */
  getNews: async (filters: any = {}) => {
    try {
      const query: any = {};

      if (filters.status) query.status = filters.status;
      if (filters.categoryId) query.categoryId = filters.categoryId;
      if (filters.authorId) query.authorId = filters.authorId;
      if (filters.keyword) query.$text = { $search: filters.keyword };

      const newsList = await News.find(query)
        .populate("authorId", "name email role")
        .populate("categoryId", "name")
        .sort({ createdAt: -1 });

      return newsList;
    } catch (error: any) {
      console.error("Error fetching news:", error.message);
      throw new Error(error.message || "Failed to fetch news");
    }
  },

  getFilteredNews: async (filters: any, pagination: any) => {
    const {
      categoryId,
      newsTypeId,
      subcategoryId,
      districtId,
      talukaId,
      authorId,
      status,
      minViews,
      maxViews,
      minLikes,
      maxLikes,
      search,
      startDate,
      endDate,
      isDeleted = false,
    } = filters;

    const { page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc" } = pagination;

    const query: FilterQuery<INews> = { isDeleted };

    // ===== Basic Filters =====
    if (categoryId) query.categoryId = categoryId;
    if (newsTypeId) query.newsTypeId = newsTypeId;
    if (subcategoryId) query.subcategoryId = subcategoryId;
    if (districtId) query.districtId = districtId;
    if (talukaId) query.talukaId = talukaId;
    if (authorId) query.authorId = authorId;
    if (status) query.status = status;

    // ===== Range Filters =====
    if (minViews || maxViews) {
      query.views = {};
      if (minViews) query.views.$gte = minViews;
      if (maxViews) query.views.$lte = maxViews;
    }

    if (minLikes || maxLikes) {
      query.likes = {};
      if (minLikes) query.likes.$gte = minLikes;
      if (maxLikes) query.likes.$lte = maxLikes;
    }

    // ===== Search (Text Index) =====
    if (search) {
      query.$text = { $search: search };
    }

    // ===== Date Range =====
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    // ===== Sorting =====
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      News.find(query)
        .populate("authorId", "name email")
        .populate("categoryId", "name")
        .populate("subcategoryId", "name")
        .populate("newsTypeId", "name")
        .populate("districtId", "name")
        .populate("talukaId", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      News.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};

export default newsServiceAdmin;
