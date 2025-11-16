import mongoose, { Schema, Document } from "mongoose";

export interface IDistrict extends Document {
  name: string;
  stateId?: mongoose.Types.ObjectId; // optional if linked to states
  code?: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>(
  {
    name: {
      type: String,
      required: [true, "District name is required"],
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    stateId: {
      type: Schema.Types.ObjectId,
      ref: "State", // optional, use if you have a State model
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

// Index for faster searches
// DistrictSchema.index({ name: 1 });

export const District = mongoose.model<IDistrict>("District", DistrictSchema);
