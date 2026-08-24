import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateOTP from "../utils/generateOTP.js";
import generateToken from "../utils/generateToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const publicUser = (user: any) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isVerified: user.isVerified,
});

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password, role } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    throw new AppError("Please fill all required fields", 400);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  // Public signup is always a Patient account. Doctor and Lab accounts are
  // provisioned separately (seeded for demo / onboarded by an admin in a
  // real deployment) so that anyone can't self-grant clinical access.
  const safeRole = role === "Doctor" || role === "Lab" ? "Patient" : role || "Patient";

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    role: safeRole,
    otp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
    isVerified: false,
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your Reliefio Health Account",
    html: `<h2>Welcome to Reliefio Health</h2><p>Your OTP is</p><h1>${otp}</h1><p>Valid for 5 minutes.</p>`,
    otp,
  });

  res.status(201).json(ok("OTP sent successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isVerified) {
    throw new AppError("Please verify your email first", 403);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user._id.toString());

  res.cookie("token", token, COOKIE_OPTIONS);

  res.json(ok("Login successful", { user: publicUser(user), token }));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json(ok("Logged out successfully"));
});

export const getMe = asyncHandler(async (req: AuthedRequest, res: Response) => {
  if (!req.user) throw new AppError("Not authenticated", 401);
  res.json(ok("Current user", { user: publicUser(req.user) }));
});

export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.otp !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError("OTP expired", 400);
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  res.status(200).json(ok("Account verified successfully"));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() });

  if (!user) {
    throw new AppError("No account found with this email", 404);
  }

  const otp = generateOTP();

  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Reliefio Health - Reset Password OTP",
    html: `<h2>Reset Password</h2><p>Your OTP is:</p><h1>${otp}</h1><p>Valid for 5 minutes.</p>`,
    otp,
  });

  res.status(200).json(ok("OTP sent successfully"));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new AppError("Email, OTP and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.otp !== otp) {
    throw new AppError("Invalid OTP", 400);
  }

  if (user.otpExpiry && user.otpExpiry < new Date()) {
    throw new AppError("OTP expired. Please request a new one.", 400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.status(200).json(ok("Password reset successfully. Please log in."));
});

// PUT /api/auth/change-password (logged-in user, from a Settings page)
export const changePassword = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters", 400);
  }

  // req.user was loaded via `protect` with the password field excluded -
  // fetch it again with the password included just for this check.
  const user = await User.findById(req.user!._id).select("+password");
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json(ok("Password changed successfully"));
});
