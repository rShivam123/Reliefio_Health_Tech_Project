import { Response } from "express";
import Prescription from "../models/prescription.js";
import Doctor from "../models/doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { notify } from "../services/notification.service.js";

// POST /api/prescriptions (Doctor)
export const createPrescription = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { patientId, consultationId, appointmentId, medicines } = req.body;

  if (!patientId || !consultationId || !Array.isArray(medicines) || medicines.length === 0) {
    throw new AppError("patientId, consultationId and at least one medicine are required", 400);
  }

  const doctor = await Doctor.findOne({ user: req.user!._id });
  if (!doctor) throw new AppError("No doctor profile found for this account", 404);

  const prescription = await Prescription.create({
    patient: patientId,
    doctor: doctor._id,
    consultation: consultationId,
    appointment: appointmentId || undefined,
    medicines,
  });

  await notify(patientId, "New prescription", `Dr. ${doctor.name} added a new prescription for you.`, "prescription");

  res.status(201).json(ok("Prescription created successfully", prescription));
});

// GET /api/prescriptions/patient/:patientId
export const getPrescriptionsForPatient = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { patientId } = req.params;

  const isSelf = req.user!._id.toString() === patientId;
  let doctorFilter: Record<string, unknown> = {};

  if (!isSelf) {
    if (req.user!.role !== "Doctor") throw new AppError("Not authorized to view these prescriptions", 403);
    const doctor = await Doctor.findOne({ user: req.user!._id });
    if (!doctor) throw new AppError("No doctor profile found", 404);
    doctorFilter = { doctor: doctor._id };
  }

  const prescriptions = await Prescription.find({ patient: patientId, ...doctorFilter })
    .populate("doctor", "name specialty")
    .sort({ date: -1 });

  res.json(ok("Prescriptions fetched", prescriptions));
});

// GET /api/prescriptions/mine (Doctor - all prescriptions issued by self)
export const getMyPrescriptions = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user!._id });
  if (!doctor) throw new AppError("No doctor profile found", 404);

  const { search } = req.query as Record<string, string>;

  let prescriptions = await Prescription.find({ doctor: doctor._id })
    .populate("patient", "firstName lastName")
    .sort({ date: -1 });

  if (search) {
    const term = search.toLowerCase();
    prescriptions = prescriptions.filter((p) => {
      const patient = p.patient as any;
      return `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(term);
    });
  }

  res.json(ok("Prescriptions fetched", prescriptions));
});

// GET /api/prescriptions/single/:id
export const getPrescription = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id).populate("doctor", "name specialty").populate("patient", "firstName lastName");
  if (!prescription) throw new AppError("Prescription not found", 404);
  res.json(ok("Prescription fetched", prescription));
});

// PUT /api/prescriptions/:id (Doctor - own only)
export const updatePrescription = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const prescription = await Prescription.findById(req.params.id).populate("doctor");
  if (!prescription) throw new AppError("Prescription not found", 404);

  const doctorDoc = prescription.doctor as any;
  if (doctorDoc.user.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only edit your own prescriptions", 403);
  }

  if (req.body.medicines) prescription.medicines = req.body.medicines;
  await prescription.save();

  res.json(ok("Prescription updated", prescription));
});
