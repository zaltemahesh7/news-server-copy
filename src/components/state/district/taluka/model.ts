import mongoose, { Schema, Document } from "mongoose";

export interface ITaluka extends Document {
  name: string;
  districtId: mongoose.Types.ObjectId;
  code?: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TalukaSchema = new Schema<ITaluka>(
  {
    name: {
      type: String,
      required: [true, "Taluka name is required"],
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    districtId: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: [true, "District reference is required"],
    },
    code: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
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
  { timestamps: true, versionKey: false },
);

// 🔹 Index for faster searching by name and district
TalukaSchema.index({ name: 1, districtId: 1 }, { unique: true });

export const Taluka = mongoose.model<ITaluka>("Taluka", TalukaSchema);
