import { Response } from "express";
import { Types } from "mongoose";
import Review from "../models/review.js";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";

const recalcDoctorRating = async (doctorId: string) => {
  const stats = await Review.aggregate([
    { $match: { doctor: new Types.ObjectId(doctorId) } },
    { $group: { _id: "$doctor", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const avgRating = stats[0]?.avgRating || 0;
  const count = stats[0]?.count || 0;

  await Doctor.findByIdAndUpdate(doctorId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
};

// GET /api/reviews?doctorId=... (public)
export const listReviews = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { doctorId } = req.query as Record<string, string>;
  if (!doctorId) throw new AppError("doctorId query param is required", 400);

  const reviews = await Review.find({ doctor: doctorId })
    .populate("patient", "firstName lastName")
    .sort({ createdAt: -1 });

  res.json(ok("Reviews fetched", reviews));
});

// GET /api/reviews/mine (Patient) - so the UI knows which completed
// appointments still need a review, without re-fetching per appointment.
export const listMyReviews = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const reviews = await Review.find({ patient: req.user!._id }).sort({ createdAt: -1 });
  res.json(ok("Your reviews fetched", reviews));
});

// POST /api/reviews (Patient, only after a completed appointment)
export const createReview = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { appointmentId, rating, comment } = req.body;

  if (!appointmentId || !rating) {
    throw new AppError("appointmentId and rating are required", 400);
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new AppError("Appointment not found", 404);

  if (appointment.patient.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only review your own appointments", 403);
  }

  if (appointment.status !== "Completed") {
    throw new AppError("You can only review a completed appointment", 400);
  }

  const existing = await Review.findOne({ appointment: appointmentId });
  if (existing) throw new AppError("You have already reviewed this appointment", 400);

  const review = await Review.create({
    patient: req.user!._id,
    doctor: appointment.doctor,
    appointment: appointmentId,
    rating,
    comment: comment || "",
  });

  await recalcDoctorRating(appointment.doctor.toString());

  res.status(201).json(ok("Review submitted successfully", review));
});
