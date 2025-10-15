// models/InspectionFee.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInspectionFee extends Document {
  amount: number;
  description: string;
  updatedBy?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const InspectionFeeSchema: Schema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 5000,
    },
    description: {
      type: String,
      default: "Standard inspection fee for all generator types",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one fee document exists
InspectionFeeSchema.index({}, { unique: true });

export const InspectionFee: Model<IInspectionFee> =
  mongoose.model<IInspectionFee>("InspectionFee", InspectionFeeSchema);
