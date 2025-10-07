import { AccountType, IUser, User } from "../models/User";
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

// register user
interface ICreateUser {
  email: string;
  password: string;
  accountType: AccountType;

  // Individual fields
  name?: string;
  phoneNumber?: string;

  // Company fields
  companyName?: string;
  companyRegNumber?: string;
  companyAddress?: string;
  contactPersonName?: string;
  contactPersonPhone?: string;
}

export const createUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        accountType,
        name,
        phoneNumber,
        companyName,
        companyRegNumber,
        companyAddress,
        contactPersonName,
        contactPersonPhone,
      } = req.body;

      // Validate required fields based on account type
      if (accountType === AccountType.INDIVIDUAL && (!name || !phoneNumber)) {
        return next(
          new ErrorHandler(
            "Name and phone number are required for individual accounts",
            400
          )
        );
      }

      if (
        accountType === AccountType.COMPANY &&
        (!companyName || !phoneNumber)
      ) {
        return next(
          new ErrorHandler(
            "Company name and phone number are required for company accounts",
            400
          )
        );
      }

      // Normalize email to lowercase
      const emailLowerCase = email.toLowerCase().trim();

      const isEmailExist = await User.findOne({ email: emailLowerCase });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      // Check for duplicate company registration number
      if (accountType === AccountType.COMPANY && companyRegNumber) {
        const isCompanyRegExist = await User.findOne({ companyRegNumber });
        if (isCompanyRegExist) {
          return next(
            new ErrorHandler("Company registration number already exists", 400)
          );
        }
      }

      const user: ICreateUser = {
        email: emailLowerCase,
        password,
        accountType,
        ...(accountType === AccountType.INDIVIDUAL && { name, phoneNumber }),
        ...(accountType === AccountType.COMPANY && {
          companyName,
          phoneNumber,
          companyRegNumber,
          companyAddress,
          contactPersonName,
          contactPersonPhone,
        }),
      };

      const activationToken = createActivationToken(user);

      const activationUrl = `${config.FRONTEND_URL}/activation/${activationToken}`;

      // Update email data to use correct name field
      const displayName =
        accountType === AccountType.INDIVIDUAL
          ? name
          : companyName || contactPersonName;

      const data = { user: { name: displayName }, activationUrl };

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
          activationToken: activationToken,
        });
      } catch (error: any) {
        return next(
          new ErrorHandler(
            `Failed to send activation email: ${error.message}`,
            400
          )
        );
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Function to create an activation token
export const createActivationToken = (user: any): string => {
  const token = jwt.sign({ user }, config.ACTIVATION_SECRET as Secret, {
    expiresIn: "5m",
  });
  return token;
};

// activate user
interface IActivationRequest {
  activation_token: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token } = req.body as IActivationRequest;
      if (!activation_token) {
        return next(new ErrorHandler("Please provide activation token", 400));
      }

      const newUser = jwt.verify(
        activation_token,
        config.ACTIVATION_SECRET as string
      ) as { user: ICreateUser };

      if (!newUser) {
        return next(new ErrorHandler("Invalid token", 400));
      }

      const { email, password, accountType, ...otherFields } = newUser.user;

      let user = await User.findOne({ email });

      if (user) {
        return next(new ErrorHandler("User already exist", 400));
      }

      // Create user with all fields
      user = await User.create({
        email,
        password,
        accountType,
        ...otherFields,
      });

      res.status(201).json({
        success: true,
        message: "Email verified & user created successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await User.findOne({ email }).select("+password");

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
            403
          )
        );
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ============================================
// REFRESH ACCESS TOKEN
// ============================================
export const refreshAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        refresh_token,
        config.REFRESH_TOKEN_SECRET as Secret
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
            403
          )
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
          companyName: user.companyName,
          isActive: user.isActive,
        },
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(
          new ErrorHandler("Refresh token expired. Please login again", 401)
        );
      }
      if (error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid refresh token", 401));
      }
      return next(new ErrorHandler("Could not refresh token", 401));
    }
  }
);

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
            403
          )
        );
      }

      const resetToken = createActivationToken(user);
      const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

      // Use correct name field based on account type
      const displayName = user.accountType === AccountType.INDIVIDUAL 
        ? user.name 
        : user.companyName || user.contactPersonName;

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
  }
);

// update user password
interface IResetPassword {
  newPassword: string;
}

// reset password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
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
            400
          )
        );

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler(
            "Password must be between at least 6 characters!",
            400
          )
        );
      }

      user.password = newPassword.trim();
      await user.save();

      res.status(201).json({
        success: true,
        message: `Password Reset Successfully', 'Now you can login with new password!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
