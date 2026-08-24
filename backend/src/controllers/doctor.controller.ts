import { Response } from "express";
import Doctor from "../models/doctor.js";
import Review from "../models/review.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok, okPaginated } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { getAvailableSlotsForDate } from "../services/slot.service.js";

// GET /api/doctors
export const listDoctors = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const {
    search,
    specialty,
    location,
    minExperience,
    maxExperience,
    consultationType,
    minFee,
    maxFee,
    minRating,
    sort,
    page = "1",
    limit = "12",
  } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { isActive: true };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { specialty: { $regex: search, $options: "i" } },
      { hospital: { $regex: search, $options: "i" } },
      { clinic: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  if (specialty) filter.specialty = { $regex: `^${specialty}$`, $options: "i" };
  if (location) filter.location = { $regex: location, $options: "i" };
  if (consultationType) filter.consultationModes = consultationType;

  if (minExperience || maxExperience) {
    filter.experience = {};
    if (minExperience) (filter.experience as any).$gte = Number(minExperience);
    if (maxExperience) (filter.experience as any).$lte = Number(maxExperience);
  }

  if (minFee || maxFee) {
    filter.consultationFee = {};
    if (minFee) (filter.consultationFee as any).$gte = Number(minFee);
    if (maxFee) (filter.consultationFee as any).$lte = Number(maxFee);
  }

  if (minRating) filter.rating = { $gte: Number(minRating) };

  let sortOption: Record<string, 1 | -1> = { rating: -1, reviewCount: -1 };
  switch (sort) {
    case "rating":
      sortOption = { rating: -1 };
      break;
    case "experience":
      sortOption = { experience: -1 };
      break;
    case "fee_low":
      sortOption = { consultationFee: 1 };
      break;
    case "fee_high":
      sortOption = { consultationFee: -1 };
      break;
    case "recommended":
    default:
      sortOption = { rating: -1, reviewCount: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

  const [doctors, total] = await Promise.all([
    Doctor.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Doctor.countDocuments(filter),
  ]);

  res.json(okPaginated("Doctors fetched", doctors, pageNum, limitNum, total));
});

// GET /api/doctors/specialties - distinct list for filter UI
export const listSpecialties = asyncHandler(async (_req: AuthedRequest, res: Response) => {
  const specialties = await Doctor.distinct("specialty", { isActive: true });
  res.json(ok("Specialties fetched", specialties.sort()));
});

// GET /api/doctors/:id
export const getDoctor = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError("Doctor not found", 404);

  const reviews = await Review.find({ doctor: doctor._id })
    .populate("patient", "firstName lastName")
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(ok("Doctor fetched", { doctor, reviews }));
});

// GET /api/doctors/:id/slots?date=YYYY-MM-DD
export const getDoctorSlots = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { date } = req.query as Record<string, string>;
  if (!date) throw new AppError("date query param is required", 400);

  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError("Doctor not found", 404);

  const slots = await getAvailableSlotsForDate(doctor, date);
  res.json(ok("Slots fetched", slots));
});

// POST /api/doctors - creates the caller's own doctor profile (role: Doctor)
export const createDoctorProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const existing = await Doctor.findOne({ user: req.user!._id });
  if (existing) throw new AppError("Doctor profile already exists for this account", 400);

  const {
    specialty,
    qualification,
    registrationNumber,
    experience,
    hospital,
    clinic,
    location,
    languages,
    consultationFee,
    about,
    consultationModes,
  } = req.body;

  if (!specialty) throw new AppError("Specialty is required", 400);

  const doctor = await Doctor.create({
    user: req.user!._id,
    name: `${req.user!.firstName} ${req.user!.lastName}`,
    specialty,
    qualification,
    registrationNumber,
    experience,
    hospital,
    clinic,
    location,
    languages,
    consultationFee,
    about,
    consultationModes,
  });

  res.status(201).json(ok("Doctor profile created", doctor));
});

// PUT /api/doctors/:id - ownership enforced
export const updateDoctor = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError("Doctor not found", 404);

  if (doctor.user.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only edit your own profile", 403);
  }

  const allowedFields = [
    "name",
    "profileImage",
    "specialty",
    "qualification",
    "registrationNumber",
    "experience",
    "hospital",
    "clinic",
    "location",
    "languages",
    "consultationFee",
    "about",
    "consultationModes",
  ];

  for (const field of allowedFields) {
    if (field in req.body) (doctor as any)[field] = req.body[field];
  }

  await doctor.save();
  res.json(ok("Doctor profile updated", doctor));
});

// DELETE /api/doctors/:id - soft delete, ownership enforced
export const deleteDoctor = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) throw new AppError("Doctor not found", 404);

  if (doctor.user.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only delete your own profile", 403);
  }

  doctor.isActive = false;
  await doctor.save();

  res.json(ok("Doctor profile deactivated"));
});
