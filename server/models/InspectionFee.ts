import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInspectionFee extends Document {
  fuelType: string;
  baseRate: number;
  kVARanges: {
    maxKVA: number;
    multiplier: number;
  }[];
  updatedAt: Date;
}

const InspectionFeeSchema: Schema = new Schema<IInspectionFee>(
  {
    fuelType: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["diesel", "petrol", "gas"],
    },
    baseRate: {
      type: Number,
      required: true,
      min: 0,
    },
    kVARanges: [
      {
        maxKVA: {
          type: Number,
          required: true,
          min: 0,
        },
        multiplier: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

InspectionFeeSchema.index({ fuelType: 1 }, { unique: true });

export const InspectionFee: Model<IInspectionFee> = mongoose.model<IInspectionFee>("InspectionFee", InspectionFeeSchema);