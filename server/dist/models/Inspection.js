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
exports.Inspection = exports.InspectionStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["PENDING"] = "pending";
    InspectionStatus["SCHEDULED"] = "scheduled";
    InspectionStatus["COMPLETED"] = "completed";
    InspectionStatus["CANCELLED"] = "cancelled";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
const InspectionSchema = new mongoose_1.Schema({
    generator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Generator',
        required: true
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    inspector: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    report: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'InspectionReport'
    },
    notes: String
}, {
    timestamps: true
});
InspectionSchema.index({ generator: 1, scheduledDate: 1 });
InspectionSchema.index({ owner: 1 });
InspectionSchema.index({ status: 1 });
exports.Inspection = mongoose_1.default.model('Inspection', InspectionSchema);
