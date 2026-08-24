import { Response } from "express";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok, okPaginated } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";
import { isSlotTaken, getAvailableSlotsForDate } from "../services/slot.service.js";
import { notify } from "../services/notification.service.js";

// POST /api/appointments (Patient)
export const createAppointment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { doctorId, date, time, consultationType, reason, notes } = req.body;

  if (!doctorId || !date || !time || !reason) {
    throw new AppError("doctorId, date, time and reason are required", 400);
  }

  const doctor = await Doctor.findById(doctorId);
  if (!doctor || !doctor.isActive) throw new AppError("Doctor not found", 404);

  // Re-validate against the doctor's actual configured availability,
  // never trust that the frontend only offered valid slots.
  const validSlots = await getAvailableSlotsForDate(doctor, date);
  if (!validSlots.includes(time)) {
    throw new AppError("This slot is no longer available. Please choose another time.", 409);
  }

  const taken = await isSlotTaken(doctorId, date, time);
  if (taken) {
    throw new AppError("This slot has just been booked by someone else. Please choose another time.", 409);
  }

  const appointment = await Appointment.create({
    patient: req.user!._id,
    doctor: doctorId,
    date,
    time,
    consultationType: consultationType || "Online",
    reason,
    notes: notes || "",
    status: "Pending",
  });

  await notify(
    doctor.user,
    "New appointment request",
    `${req.user!.firstName} ${req.user!.lastName} requested an appointment on ${date} at ${time}.`,
    "appointment",
    `/physician/appointments/${appointment._id}`
  );

  res.status(201).json(ok("Appointment booked successfully", appointment));
});

// GET /api/appointments (role-aware)
export const listAppointments = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { status, page = "1", limit = "20", scope } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};

  if (req.user!.role === "Doctor") {
    const doctor = await Doctor.findOne({ user: req.user!._id });
    if (!doctor) return res.json(okPaginated("Appointments fetched", [], 1, 20, 0));
    filter.doctor = doctor._id;
  } else {
    filter.patient = req.user!._id;
  }

  if (status) filter.status = status;

  const today = new Date().toISOString().slice(0, 10);
  if (scope === "today") filter.date = today;
  if (scope === "upcoming") filter.date = { $gte: today };
  if (scope === "past") filter.date = { $lt: today };

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const [appointments, total] = await Promise.all([
    Appointment.find(filter)
      .populate("patient", "firstName lastName email phone")
      .populate({ path: "doctor", select: "name specialty profileImage consultationFee" })
      .sort({ date: -1, time: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(filter),
  ]);

  res.json(okPaginated("Appointments fetched", appointments, pageNum, limitNum, total));
});

const assertOwnership = async (appointmentId: string, req: AuthedRequest) => {
  const appointment = await Appointment.findById(appointmentId).populate("doctor");
  if (!appointment) throw new AppError("Appointment not found", 404);

  const isPatient = appointment.patient.toString() === req.user!._id.toString();
  const isDoctor =
    req.user!.role === "Doctor" && (appointment.doctor as any).user?.toString() === req.user!._id.toString();

  if (!isPatient && !isDoctor) {
    throw new AppError("You don't have permission to access this appointment.", 403);
  }

  return { appointment, isPatient, isDoctor };
};

// GET /api/appointments/:id
export const getAppointment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { appointment } = await assertOwnership(String(req.params.id), req);
  await appointment.populate("patient", "firstName lastName email phone dateOfBirth gender bloodGroup allergies currentMedications");
  res.json(ok("Appointment fetched", appointment));
});

// PUT /api/appointments/:id (status transitions, reschedule)
export const updateAppointment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { appointment, isPatient, isDoctor } = await assertOwnership(String(req.params.id), req);
  const { status, date, time, cancellationReason } = req.body;

  const doctorAllowed = ["Confirmed", "Cancelled", "Completed"];
  const patientAllowed = ["Cancelled"];

  if (status) {
    if (isDoctor && !doctorAllowed.includes(status)) {
      throw new AppError(`Doctors cannot set status to ${status}`, 400);
    }
    if (isPatient && !isDoctor && !patientAllowed.includes(status)) {
      throw new AppError("Patients can only cancel an appointment", 400);
    }
    appointment.status = status;
    if (status === "Cancelled" && cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }
  }

  // Reschedule (doctor or patient can propose a new date/time while still Pending)
  if (date || time) {
    if (appointment.status === "Completed" || appointment.status === "Cancelled") {
      throw new AppError("Cannot reschedule a completed or cancelled appointment", 400);
    }
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    appointment.status = "Pending";
  }

  await appointment.save();

  const doctorDoc = appointment.doctor as any;
  const notifyTargetUser = isDoctor ? appointment.patient : doctorDoc.user;
  const actorLabel = isDoctor ? "Your doctor" : "The patient";

  if (status === "Cancelled") {
    await notify(notifyTargetUser, "Appointment cancelled", `${actorLabel} cancelled the appointment on ${appointment.date}.`, "appointment");
  } else if (status === "Confirmed") {
    await notify(appointment.patient, "Appointment confirmed", `Your appointment on ${appointment.date} at ${appointment.time} was confirmed.`, "appointment");
  } else if (date || time) {
    await notify(notifyTargetUser, "Appointment rescheduled", `${actorLabel} proposed a new time: ${appointment.date} at ${appointment.time}.`, "appointment");
  }

  res.json(ok("Appointment updated", appointment));
});

// DELETE /api/appointments/:id - only own pending appointment (patient)
export const deleteAppointment = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { appointment, isPatient } = await assertOwnership(String(req.params.id), req);

  if (!isPatient) throw new AppError("Only the patient who booked can delete this appointment", 403);
  if (appointment.status !== "Pending") {
    throw new AppError("Only pending appointments can be deleted. Cancel it instead.", 400);
  }

  await appointment.deleteOne();
  res.json(ok("Appointment deleted"));
});
