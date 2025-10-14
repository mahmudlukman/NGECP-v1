import mongoose, { Schema, Document, Model } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  inspection?: mongoose.Types.ObjectId;
  amount: number;
  status: PaymentStatus;
  paymentMethod?: string;
  transactionReference: string;
  paymentDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    inspection: {
      type: Schema.Types.ObjectId,
      ref: 'Inspection',
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    paymentMethod: String,
    transactionReference: {
      type: String,
      required: true,
      unique: true
    },
    paymentDate: Date,
    metadata: Schema.Types.Mixed
  },
  {
    timestamps: true
  }
);

PaymentSchema.index({ user: 1 });
PaymentSchema.index({ status: 1 });

export const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', PaymentSchema);
