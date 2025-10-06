import mongoose, { Schema, Document, Model } from 'mongoose';

export enum InspectionStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface IInspection extends Document {
  generator: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  scheduledDate: Date;
  completedDate?: Date;
  status: InspectionStatus;
  payment: mongoose.Types.ObjectId;
  inspector?: mongoose.Types.ObjectId;
  report?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InspectionSchema: Schema = new Schema(
  {
    generator: {
      type: Schema.Types.ObjectId,
      ref: 'Generator',
      required: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    completedDate: Date,
    status: {
      type: String,
      enum: Object.values(InspectionStatus),
      default: InspectionStatus.PENDING
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    report: {
      type: Schema.Types.ObjectId,
      ref: 'InspectionReport'
    },
    notes: String
  },
  {
    timestamps: true
  }
);

InspectionSchema.index({ generator: 1, scheduledDate: 1 });
InspectionSchema.index({ owner: 1 });
InspectionSchema.index({ status: 1 });

export const Inspection: Model<IInspection> = mongoose.model<IInspection>('Inspection', InspectionSchema);
