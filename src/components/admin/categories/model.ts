import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  subtitle?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// CategorySchema.index({ name: 1 });

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
