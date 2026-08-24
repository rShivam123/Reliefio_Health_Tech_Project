import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  // Mongoose validation error
  if (err?.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");
    return res.status(400).json({ success: false, message });
  }

  // Duplicate key error (e.g. double-booked slot, duplicate email)
  if (err?.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    return res.status(409).json({
      success: false,
      message: field
        ? `This ${field} is already taken or that time slot is already booked.`
        : "Duplicate entry.",
    });
  }

  // Invalid ObjectId
  if (err?.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format." });
  }

  return res.status(500).json({ success: false, message: "Internal server error." });
};
