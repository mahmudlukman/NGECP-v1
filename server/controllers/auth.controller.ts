import { AccountType, User } from "../models/User";
import bcrypt from "bcryptjs";
import ErrorHandler from "../utils/errorHandler";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwtToken";
import config from "../config";

const disposableDomains = [
  "tempmail.com",
  "throwaway.com",
  "throwawaymail.com",
  "guerrillamail.com",
  "mailinator.com",
  "10minutemail.com",
  "yopmail.com",
  "temp-mail.org",
  "trashmail.com",
  "dropmail.me",
];

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 20;

const isValidPasswordLength = (password: string): boolean =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH;

// --------------------------------------------------
// Create User Interface
// --------------------------------------------------

interface ICreateUser {
  email: string;
  password: string;
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
}

// @desc       Create new individual or corporate user
// @route      POST /api/v1/register
// @access     Public
export const createUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      email,
      password,
      accountType,
      name,
      phoneNumber,
      organizationName,
      organizationRegNumber,
      organizationAddress,
      contactPersonName,
      contactPersonPhone,
    } = req.body;

    if (!email || !password || !accountType) {
      return next(
        new ErrorHandler(
          "Please provide email, password and account type",
          400,
        ),
      );
    }

    if (
      accountType !== AccountType.INDIVIDUAL &&
      accountType !== AccountType.ORGANIZATION
    ) {
      return next(new ErrorHandler("Invalid account type", 400));
    }

    if (accountType === AccountType.INDIVIDUAL && (!name || !phoneNumber)) {
      return next(
        new ErrorHandler(
          "Name and phone number are required for individual accounts",
          400,
        ),
      );
    }

    if (
      accountType === AccountType.ORGANIZATION &&
      (!organizationName || !phoneNumber)
    ) {
      return next(
        new ErrorHandler(
          "Organization name and phone number are required for Organization accounts",
          400,
        ),
      );
    }

    if (!isValidPasswordLength(password)) {
      return next(
        new ErrorHandler(
          `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters!`,
          400,
        ),
      );
    }

    const emailLowerCase = email.toLowerCase().trim();

    const isEmailExist = await User.findOne({
      email: emailLowerCase,
    });

    if (isEmailExist) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const domain = emailLowerCase.split("@")[1];

    if (domain && disposableDomains.includes(domain)) {
      return next(
        new ErrorHandler("Please use a permanent email address", 400),
      );
    }

    if (accountType === AccountType.ORGANIZATION && organizationRegNumber) {
      const isOrganizationRegExist = await User.findOne({
        organizationRegNumber,
      });

      if (isOrganizationRegExist) {
        return next(
          new ErrorHandler(
            "organization registration number already exists",
            400,
          ),
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: ICreateUser = {
      email: emailLowerCase,
      password: hashedPassword,
      accountType,

      ...(accountType === AccountType.INDIVIDUAL && {
        name,
        phoneNumber,
      }),

      ...(accountType === AccountType.ORGANIZATION && {
        organizationName,
        phoneNumber,
        organizationRegNumber,
        organizationAddress,
        contactPersonName,
        contactPersonPhone,
      }),
    };

    const activationToken = createActivationToken(user);

    const activationUrl = `${config.FRONTEND_URL}/activation/${activationToken}`;

    const displayName =
      accountType === AccountType.INDIVIDUAL
        ? name
        : organizationName || contactPersonName;

    const data = {
      user: {
        name: displayName,
      },
      activationUrl,
    };

    try {
      await sendMail({
        email: user.email,
        subject: "Activate your account",
        template: "activation-mail.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email: ${user.email} to activate your account!`,

        ...(config.NODE_ENV !== "production" && {
          activationToken,
        }),
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(
          `Failed to send activation email: ${error.message}`,
          400,
        ),
      );
    }
  },
);

// Signs the activation payload.
export const createActivationToken = (user: ICreateUser): string => {
  return jwt.sign(
    {
      user,
      purpose: "activation",
    },
    config.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    },
  );
};

// activate user
interface IActivationRequest {
  activation_token: string;
}

// @desc       Activate new user
// @route      POST /api/user/activate
// @access     public
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token } = req.body as IActivationRequest;

    if (!activation_token) {
      return next(new ErrorHandler("Please provide activation token", 400));
    }

    let decoded: {
      user: ICreateUser;
      purpose: string;
    };

    try {
      decoded = jwt.verify(
        activation_token,
        config.ACTIVATION_SECRET as string,
      ) as {
        user: ICreateUser;
        purpose: string;
      };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(
          new ErrorHandler(
            "Activation link has expired. Please sign up again.",
            400,
          ),
        );
      }

      return next(new ErrorHandler("Invalid activation token", 400));
    }

    if (decoded.purpose !== "activation") {
      return next(new ErrorHandler("Invalid activation token", 400));
    }

    const { email, password, accountType, ...otherFields } = decoded.user;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return next(new ErrorHandler("User already exist", 400));
    }

    const newUser = new User({
      email,
      password,
      accountType,
      ...otherFields,
    });

    newUser.$locals.skipHash = true;

    await newUser.save();
    try {
      const displayName =
        accountType === AccountType.INDIVIDUAL
          ? newUser.name
          : newUser.organizationName || newUser.contactPersonName;

      await sendMail({
        email: newUser.email,
        subject: "Welcome to NGECP 🎉",
        template: "welcome-mail.ejs",
        data: {
          user: {
            name: displayName,
          },
          siteUrl: config.FRONTEND_URL,
        },
      });
    } catch (error: any) {
      console.error(`Failed to send welcome email to ${newUser.email}:`, error);
    }
    sendToken(newUser, 201, res);
  },
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

// @desc       Login user
// @route      POST /api/login
// @access     public
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as ILoginRequest;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const emailLowerCase = email.toLowerCase().trim();

    const user = await User.findOne({ email: emailLowerCase }).select(
      "+password",
    );

    if (!user) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid credentials", 400));
    }

    const { isActive } = user;
    if (!isActive) {
      return next(
        new ErrorHandler(
          "This account has been suspended! Try to contact the admin",
          403,
        ),
      );
    }

    sendToken(user, 200, res);
  },
);

// @desc       Logout user
// @route      POST /api/logout
// @access     public
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // Clear both tokens
    res.cookie("access_token", "", {
      maxAge: 1,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.cookie("refresh_token", "", {
      maxAge: 1,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);

// @desc       Refresh Access Token
// @route      POST /api/token/refresh
// @access     public
export const refreshAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401),
        );
      }

      const decoded = jwt.verify(
        refresh_token,
        config.REFRESH_TOKEN_SECRET as Secret,
      ) as { id: string };

      if (!decoded) {
        return next(new ErrorHandler("Invalid refresh token", 401));
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (!user.isActive) {
        return next(
          new ErrorHandler(
            "This account has been suspended! Try to contact the admin",
            403,
          ),
        );
      }

      const newAccessToken = user.getJwtToken();
      const newRefreshToken = user.getRefreshToken();

      res.cookie("access_token", newAccessToken, accessTokenOptions);
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

      // Update response to include correct user fields
      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          accountType: user.accountType,
          name: user.name,
          organizationName: user.organizationName,
          isActive: user.isActive,
        },
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(
          new ErrorHandler("Refresh token expired. Please login again", 401),
        );
      }
      if (error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid refresh token", 401));
      }
      return next(new ErrorHandler("Could not refresh token", 401));
    }
  },
);

// @desc       Forgot password
// @route      POST /api/password/forgot
// @access     public
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      if (!email) {
        return next(new ErrorHandler("Please provide a valid email!", 400));
      }

      const emailLowerCase = email.toLowerCase();
      const user = await User.findOne({ email: emailLowerCase });
      if (!user) {
        return next(new ErrorHandler("User not found, invalid request!", 400));
      }

      const { isActive } = user;
      if (!isActive) {
        return next(
          new ErrorHandler(
            "This account has been suspended! Try to contact the admin",
            403,
          ),
        );
      }

      const resetToken = createActivationToken(user);
      const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

      // Use correct name field based on account type
      const displayName =
        user.accountType === AccountType.INDIVIDUAL
          ? user.name
          : user.organizationName || user.contactPersonName;

      const data = { user: { name: displayName }, resetUrl };

      try {
        await sendMail({
          email: user.email,
          subject: "Reset your password",
          template: "forgot-password-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to reset your password!`,
          resetToken: resetToken,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// update user password
interface IResetPassword {
  newPassword: string;
}

// @desc       Reset password
// @route      POST /api/password/reset
// @access     public
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { newPassword } = req.body as IResetPassword;
    const { id } = req.query;

    if (!id) {
      return next(new ErrorHandler("No user ID provided!", 400));
    }

    const user = await User.findById(id).select("+password");

    if (!user) {
      return next(new ErrorHandler("user not found!", 400));
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword)
      return next(
        new ErrorHandler(
          "New password must be different from the previous one!",
          400,
        ),
      );

    if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
      return next(
        new ErrorHandler(
          "Password must be between at least 6 characters!",
          400,
        ),
      );
    }

    user.password = newPassword.trim();
    await user.save();

    res.status(201).json({
      success: true,
      message: `Password Reset Successfully', 'Now you can login with new password!`,
    });
  },
);
