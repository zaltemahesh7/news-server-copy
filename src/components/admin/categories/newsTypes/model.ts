import mongoose, { Schema, Document } from "mongoose";

export interface INewsType extends Document {
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NewsTypeSchema = new Schema<INewsType>(
  {
    name: {
      type: String,
      required: [true, "News type name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy reference is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// NewsTypeSchema.index({ name: 1 });

export const NewsType = mongoose.model<INewsType>("NewsType", NewsTypeSchema);
