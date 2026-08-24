import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import User, { IUser } from "../models/user.js";

export interface AuthedRequest extends Request {
  user?: IUser;
}

interface DecodedToken {
  id: string;
}

const extractToken = (req: Request): string | undefined => {
  if (req.cookies?.token) return req.cookies.token;
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return undefined;
};

/**
 * protect
 * Verifies the JWT (from the httpOnly cookie or an Authorization header),
 * loads the authenticated user and attaches it to req.user.
 * This is the single source of truth for "who is logged in" - the
 * frontend must never be trusted to say who a request is from.
 */
export const protect = asyncHandler(async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    throw new AppError("Not authenticated. Please log in.", 401);
  }

  let decoded: DecodedToken;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
  } catch {
    throw new AppError("Invalid or expired session. Please log in again.", 401);
  }

  const user = await User.findById(decoded.id).select(
    "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpire"
  );

  if (!user) {
    throw new AppError("User no longer exists.", 401);
  }

  req.user = user;
  next();
});

/**
 * requireRole
 * Restricts a route to one or more roles. Must run AFTER protect.
 * Example: router.get("/dashboard", protect, requireRole("Doctor"), ctrl.dashboard)
 */
export const requireRole =
  (...roles: string[]) =>
  (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated.", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to access this resource.", 403));
    }
    next();
  };

/**
 * optionalAuth
 * Attaches req.user if a valid token is present, but never fails the
 * request if it's missing/invalid. Used on public routes (like /doctors)
 * that behave slightly differently for a logged-in visitor.
 */
export const optionalAuth = asyncHandler(async (req: AuthedRequest, res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const user = await User.findById(decoded.id).select(
      "-password -otp -otpExpiry -resetPasswordToken -resetPasswordExpire"
    );
    if (user) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
});
