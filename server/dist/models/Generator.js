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
exports.Generator = exports.GeneratorStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var GeneratorStatus;
(function (GeneratorStatus) {
    GeneratorStatus["ACTIVE"] = "active";
    GeneratorStatus["INACTIVE"] = "inactive";
    GeneratorStatus["UNDER_INSPECTION"] = "under_inspection";
    GeneratorStatus["COMPLIANT"] = "compliant";
    GeneratorStatus["NON_COMPLIANT"] = "non_compliant";
})(GeneratorStatus || (exports.GeneratorStatus = GeneratorStatus = {}));
const GeneratorSchema = new mongoose_1.Schema({
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true
});
GeneratorSchema.index({ owner: 1, serialNumber: 1 }, { unique: true });
GeneratorSchema.index({ status: 1 });
exports.Generator = mongoose_1.default.model('Generator', GeneratorSchema);
