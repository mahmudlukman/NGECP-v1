import mongoose, { Schema, Document, Model } from 'mongoose';

export enum GeneratorStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_INSPECTION = 'under_inspection',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant'
}

export interface IGenerator {
  owner: mongoose.Types.ObjectId;
  generatorId: string;
  brand: string;
  model: string;
  serialNumber: string;
  capacity: string;
  yearOfManufacture: number;
  fuelType: string;
  location: {
    address: string;
    state: string;
    lga: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  status: GeneratorStatus;
  registrationDate: Date;
  lastInspectionDate?: Date;
  nextInspectionDue?: Date;
  complianceScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const GeneratorSchema: Schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    generatorId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true
    },
    capacity: {
      type: String,
      required: true
    },
    yearOfManufacture: {
      type: Number,
      required: true
    },
    fuelType: {
      type: String,
      required: true
    },
    location: {
      address: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      lga: {
        type: String,
        required: true
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    status: {
      type: String,
      enum: Object.values(GeneratorStatus),
      default: GeneratorStatus.ACTIVE
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    lastInspectionDate: Date,
    nextInspectionDue: Date,
    complianceScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

GeneratorSchema.index({ owner: 1, serialNumber: 1 }, { unique: true });
GeneratorSchema.index({ status: 1 });

export const Generator: Model<IGenerator & Document> = mongoose.model<IGenerator & Document>('Generator', GeneratorSchema);
