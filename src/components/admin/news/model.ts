import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  subcategoryId: mongoose.Types.ObjectId;
  districtId: mongoose.Types.ObjectId;
  talukaId: mongoose.Types.ObjectId;
  newsTypeId: mongoose.Types.ObjectId;
  tags?: string[];
  tagsText?: string;
  thumbnail?: string;
  media?: {
    images?: string[];
    videos?: string[];
  };
  status: "draft" | "pending" | "approved" | "rejected" | "published";
  scheduledAt?: Date;
  publishedAt?: Date;
  views: number;
  likes: number;
  dislikes: number;
  moderation?: {
    reviewedBy?: mongoose.Types.ObjectId;
    remarks?: string;
    reviewedAt?: Date;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: 20,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      // required: [true, "Subcategory is required"],
    },
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: [true, "District is required"],
    },
    talukaId: {
      type: Schema.Types.ObjectId,
      ref: "Taluka",
      required: [true, "Taluka is required"],
    },
    newsTypeId: {
      type: Schema.Types.ObjectId,
      ref: "NewsType",
      required: [true, "NewsType is required"],
    },
    tags: {
      type: [String],
      default: [],
    },
    tagsText: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    media: {
      images: [{ type: String }],
      videos: [{ type: String }],
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "published"],
      default: "draft",
    },
    scheduledAt: { type: Date },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    moderation: {
      reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
      remarks: { type: String, trim: true },
      reviewedAt: { type: Date },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

// Flatten tags array into string for text indexing
NewsSchema.pre("save", function (next) {
  if (this.tags && Array.isArray(this.tags)) {
    this.tagsText = this.tags.join(" ");
  }
  next();
});

// Safe text index (no array indexing error)
NewsSchema.index({ title: "text", content: "text", tagsText: "text" });

export const News = mongoose.model<INews>("News", NewsSchema);
