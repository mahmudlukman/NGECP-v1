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
  ORGANIZATION = "organization",
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  accountType: AccountType;

  // Individual fields
  name?: string;
  phoneNumber?: string;

  // organization fields
  organizationName?: string;
  organizationRegNumber?: string;
  organizationAddress?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;

  isActive: boolean;
  suspendedByAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTime?: Date;
  getJwtToken(): string;
  getRefreshToken(): string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
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
      required: function (this: IUser) {
        return this.accountType === AccountType.INDIVIDUAL;
      },
    },
    phoneNumber: {
      type: String,
      required: true,
    },

    // organization fields
    organizationName: {
      type: String,
      required: function (this: IUser) {
        return this.accountType === AccountType.ORGANIZATION;
      },
    },
    organizationRegNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    organizationAddress: String,
    contactPersonName: String,
    contactPersonPhone: String,

    isActive: {
      type: Boolean,
      default: true,
    },
    suspendedByAdmin: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordTime: Date,
  },
  {
    minimize: false,
    timestamps: true,
  },
);

// Hash password
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || this.$locals.skipHash) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }

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
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
