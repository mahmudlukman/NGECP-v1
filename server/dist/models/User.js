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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.AccountType = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["EDITOR"] = "editor";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountType;
(function (AccountType) {
    AccountType["INDIVIDUAL"] = "individual";
    AccountType["COMPANY"] = "company";
})(AccountType || (exports.AccountType = AccountType = {}));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    },
    accountType: {
        type: String,
        enum: Object.values(AccountType),
        required: true,
    },
    // Individual fields
    name: {
        type: String,
        required: function () {
            return this.accountType === AccountType.INDIVIDUAL;
        },
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    // Company fields
    companyName: {
        type: String,
        required: function () {
            return this.accountType === AccountType.COMPANY;
        },
    },
    companyRegNumber: {
        type: String,
        unique: true,
        sparse: true,
    },
    companyAddress: String,
    contactPersonName: String,
    contactPersonPhone: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    minimize: false,
    timestamps: true,
});
// Hash password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcryptjs_1.default.hash(this.password, 10);
    next();
});
// JWT token
UserSchema.methods.getJwtToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, config_1.default.JWT_SECRET_KEY, {
        expiresIn: config_1.default.JWT_EXPIRES || "15m",
    });
};
// JWT Refresh Token (long-lived)
UserSchema.methods.getRefreshToken = function () {
    return jsonwebtoken_1.default.sign({ id: this._id }, config_1.default.REFRESH_TOKEN_SECRET, {
        expiresIn: config_1.default.REFRESH_TOKEN_EXPIRES || "7d", // Long-lived: 7 days
    });
};
// Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
exports.User = mongoose_1.default.model("User", UserSchema);
