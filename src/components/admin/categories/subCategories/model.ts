import mongoose, { Schema, Document } from "mongoose";

export interface ISubcategory extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
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

// SubcategorySchema.index({ name: 1, categoryId: 1 }, { unique: true });

export const Subcategory = mongoose.model<ISubcategory>("Subcategory", SubcategorySchema);
