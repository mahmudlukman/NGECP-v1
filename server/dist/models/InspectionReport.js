"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionReport = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InspectionReportSchema = new mongoose_1.Schema({
    inspection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Inspection',
        required: true,
        unique: true
    },
    generator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Generator',
        required: true
    },
    inspector: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: Date
}, {
    timestamps: true
});
InspectionReportSchema.index({ generator: 1 });
exports.InspectionReport = mongoose_1.default.model('InspectionReport', InspectionReportSchema);
