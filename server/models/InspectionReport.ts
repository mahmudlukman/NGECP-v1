import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInspectionReport extends Document {
  inspection: mongoose.Types.ObjectId;
  generator: mongoose.Types.ObjectId;
  inspector: mongoose.Types.ObjectId;
  reportDate: Date;
  
  overallCompliance: boolean;
  complianceScore: number;
  
  emissionsTest: {
    passed: boolean;
    co2Level?: number;
    noxLevel?: number;
    particulateLevel?: number;
    notes?: string;
  };
  
  noiseLevel: {
    passed: boolean;
    decibelReading?: number;
    notes?: string;
  };
  
  fuelEfficiency: {
    passed: boolean;
    rating?: string;
    notes?: string;
  };
  
  maintenanceStatus: {
    passed: boolean;
    issues?: string[];
    notes?: string;
  };
  
  safetyCompliance: {
    passed: boolean;
    issues?: string[];
    notes?: string;
  };
  
  recommendations: string[];
  requiredActions?: string[];
  nextInspectionDate?: Date;
  
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];
  
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvalDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const InspectionReportSchema: Schema = new Schema(
  {
    inspection: {
      type: Schema.Types.ObjectId,
      ref: 'Inspection',
      required: true,
      unique: true
    },
    generator: {
      type: Schema.Types.ObjectId,
      ref: 'Generator',
      required: true
    },
    inspector: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reportDate: {
      type: Date,
      default: Date.now
    },
    overallCompliance: {
      type: Boolean,
      required: true
    },
    complianceScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    emissionsTest: {
      passed: {
        type: Boolean,
        required: true
      },
      co2Level: Number,
      noxLevel: Number,
      particulateLevel: Number,
      notes: String
    },
    noiseLevel: {
      passed: {
        type: Boolean,
        required: true
      },
      decibelReading: Number,
      notes: String
    },
    fuelEfficiency: {
      passed: {
        type: Boolean,
        required: true
      },
      rating: String,
      notes: String
    },
    maintenanceStatus: {
      passed: {
        type: Boolean,
        required: true
      },
      issues: [String],
      notes: String
    },
    safetyCompliance: {
      passed: {
        type: Boolean,
        required: true
      },
      issues: [String],
      notes: String
    },
    recommendations: [String],
    requiredActions: [String],
    nextInspectionDate: Date,
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String
    }],
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date
  },
  {
    timestamps: true
  }
);

InspectionReportSchema.index({ inspection: 1 });
InspectionReportSchema.index({ generator: 1 });

export const InspectionReport: Model<IInspectionReport> = mongoose.model<IInspectionReport>('InspectionReport', InspectionReportSchema);
