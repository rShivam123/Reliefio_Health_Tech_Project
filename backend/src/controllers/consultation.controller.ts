import { Response } from "express";
import Consultation from "../models/consultation.js";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { notify } from "../services/notification.service.js";

// POST /api/consultations (Doctor)
export const createConsultation = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { appointmentId, diagnosis, notes } = req.body;
  if (!appointmentId) throw new AppError("appointmentId is required", 400);

  const appointment = await Appointment.findById(appointmentId).populate("doctor");
  if (!appointment) throw new AppError("Appointment not found", 404);

  const doctorDoc = appointment.doctor as any;
  if (doctorDoc.user.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only start consultations for your own appointments", 403);
  }

  let consultation = await Consultation.findOne({ appointment: appointmentId });
  if (consultation) {
    consultation.diagnosis = diagnosis ?? consultation.diagnosis;
    consultation.notes = notes ?? consultation.notes;
    await consultation.save();
  } else {
    consultation = await Consultation.create({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: doctorDoc._id,
      diagnosis: diagnosis || "",
      notes: notes || "",
    });
  }

  if (appointment.status !== "Completed") {
    appointment.status = "Confirmed";
    await appointment.save();
  }

  res.status(201).json(ok("Consultation saved", consultation));
});

// GET /api/consultations/:id
export const getConsultation = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const consultation = await Consultation.findById(req.params.id).populate("doctor").populate("patient", "firstName lastName");
  if (!consultation) throw new AppError("Consultation not found", 404);
  res.json(ok("Consultation fetched", consultation));
});

// GET /api/consultations/appointment/:appointmentId
export const getConsultationByAppointment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const consultation = await Consultation.findOne({ appointment: req.params.appointmentId });
  res.json(ok("Consultation fetched", consultation));
});

// PUT /api/consultations/:id
export const updateConsultation = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const consultation = await Consultation.findById(req.params.id).populate("doctor");
  if (!consultation) throw new AppError("Consultation not found", 404);

  const doctorDoc = consultation.doctor as any;
  if (doctorDoc.user.toString() !== req.user!._id.toString()) {
    throw new AppError("You can only edit your own consultations", 403);
  }

  const { diagnosis, notes, markCompleted } = req.body;
  if (diagnosis !== undefined) consultation.diagnosis = diagnosis;
  if (notes !== undefined) consultation.notes = notes;

  if (markCompleted) {
    consultation.status = "Completed";
    await Appointment.findByIdAndUpdate(consultation.appointment, { status: "Completed" });
    await notify(consultation.patient, "Consultation completed", "Your doctor marked your consultation as completed.", "consultation");
  }

  await consultation.save();
  res.json(ok("Consultation updated", consultation));
});
