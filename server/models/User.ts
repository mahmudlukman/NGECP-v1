import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";

export enum UserRole {
  USER = "user",
  EDITOR = "editor",
  ADMIN = "admin",
}

export enum AccountType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  accountType: AccountType;

  // Individual fields
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;

  // Company fields
  companyName?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;

  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  getJwtToken(): string;
  getRefreshToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
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
    firstName: {
      type: String,
      required: function (this: IUser) {
        return this.accountType === AccountType.INDIVIDUAL;
      },
    },
    lastName: {
      type: String,
      required: function (this: IUser) {
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
      required: function (this: IUser) {
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ companyRegNumber: 1 }, { sparse: true });

// Hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT token
UserSchema.methods.getJwtToken = function (): string {
  return jwt.sign({ id: this._id }, config.JWT_SECRET_KEY as string, {
    expiresIn: config.JWT_EXPIRES || "15m",
  });
};

// JWT Refresh Token (long-lived)
UserSchema.methods.getRefreshToken = function (): string {
  return jwt.sign({ id: this._id }, config.REFRESH_TOKEN_SECRET as string, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES || "7d", // Long-lived: 7 days
  });
};

// Compare password
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
