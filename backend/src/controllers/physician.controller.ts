import { Response } from "express";
import Doctor from "../models/doctor.js";
import Appointment from "../models/appointment.js";
import Consultation from "../models/consultation.js";
import Prescription from "../models/prescription.js";
import LabReport from "../models/labReport.js";
import Notification from "../models/notification.js";
import User from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { ok } from "../utils/ApiResponse.js";
import { AuthedRequest } from "../middleware/auth.middleware.js";

const getOwnDoctor = async (req: AuthedRequest) => {
  const doctor = await Doctor.findOne({ user: req.user!._id });
  if (!doctor) {
    throw new AppError("No doctor profile found for this account. Please complete your profile first.", 404);
  }
  return doctor;
};

// GET /api/physician/dashboard
export const getDashboard = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  const today = new Date().toISOString().slice(0, 10);

  const [todaysAppointments, pendingAppointments, completedConsultations, allPatientIds, unreadNotifications, todaysConfirmed] =
    await Promise.all([
      Appointment.find({ doctor: doctor._id, date: today }).populate("patient", "firstName lastName").sort({ time: 1 }),
      Appointment.countDocuments({ doctor: doctor._id, status: "Pending" }),
      Appointment.countDocuments({ doctor: doctor._id, status: "Completed" }),
      Appointment.distinct("patient", { doctor: doctor._id }),
      Notification.countDocuments({ user: req.user!._id, isRead: false }),
      Appointment.find({ doctor: doctor._id, date: today, status: { $in: ["Confirmed", "Completed"] } }),
    ]);

  const todaysEarnings = todaysConfirmed.length * doctor.consultationFee;

  res.json(
    ok("Dashboard fetched", {
      doctorName: doctor.name,
      todaysAppointments,
      todaysAppointmentCount: todaysAppointments.length,
      pendingAppointments,
      completedConsultations,
      totalPatients: allPatientIds.length,
      todaysEarnings,
      unreadNotifications,
    })
  );
});

// GET /api/physician/appointments
export const getPhysicianAppointments = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  const { scope, status } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { doctor: doctor._id };
  const today = new Date().toISOString().slice(0, 10);

  if (scope === "today") filter.date = today;
  if (scope === "upcoming") filter.date = { $gte: today };
  if (scope === "past") filter.date = { $lt: today };
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate("patient", "firstName lastName email phone")
    .sort({ date: 1, time: 1 });

  res.json(ok("Appointments fetched", appointments));
});

// GET /api/physician/patients
export const getPhysicianPatients = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  const { search } = req.query as Record<string, string>;

  const patientIds = await Appointment.distinct("patient", { doctor: doctor._id });

  const userFilter: Record<string, unknown> = { _id: { $in: patientIds } };
  if (search) {
    userFilter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const patients = await User.find(userFilter).select("firstName lastName email phone gender dateOfBirth");

  const enriched = await Promise.all(
    patients.map(async (p) => {
      const [lastVisit, nextAppointment] = await Promise.all([
        Appointment.findOne({ doctor: doctor._id, patient: p._id, status: "Completed" }).sort({ date: -1 }),
        Appointment.findOne({
          doctor: doctor._id,
          patient: p._id,
          status: { $in: ["Pending", "Confirmed"] },
          date: { $gte: new Date().toISOString().slice(0, 10) },
        }).sort({ date: 1 }),
      ]);
      return {
        ...p.toObject(),
        lastVisit: lastVisit?.date || null,
        nextAppointment: nextAppointment?.date || null,
      };
    })
  );

  res.json(ok("Patients fetched", enriched));
});

// GET /api/physician/patients/:id
export const getPhysicianPatientDetail = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  const patientId = req.params.id;

  const hasRelationship = await Appointment.exists({ doctor: doctor._id, patient: patientId });
  if (!hasRelationship) {
    throw new AppError("This patient has no appointment history with you.", 403);
  }

  const [patient, appointments, consultations, prescriptions, labReports] = await Promise.all([
    User.findById(patientId).select("firstName lastName email phone gender dateOfBirth bloodGroup allergies currentMedications"),
    Appointment.find({ doctor: doctor._id, patient: patientId }).sort({ date: -1 }),
    Consultation.find({ doctor: doctor._id, patient: patientId }).sort({ createdAt: -1 }),
    Prescription.find({ doctor: doctor._id, patient: patientId }).sort({ date: -1 }),
    LabReport.find({ patient: patientId, verificationStatus: "Published" }).sort({ publishedAt: -1 }),
  ]);

  if (!patient) throw new AppError("Patient not found", 404);

  res.json(ok("Patient detail fetched", { patient, appointments, consultations, prescriptions, labReports }));
});

// GET /api/physician/profile
export const getPhysicianProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user!._id });
  res.json(ok("Profile fetched", doctor));
});

// PUT /api/physician/profile
export const updatePhysicianProfile = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await Doctor.findOne({ user: req.user!._id });
  if (!doctor) throw new AppError("No doctor profile found. Please create one first.", 404);

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
  res.json(ok("Profile updated", doctor));
});

// GET /api/physician/availability
export const getAvailability = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  res.json(ok("Availability fetched", doctor.availability));
});

// PUT /api/physician/availability
export const updateAvailability = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const doctor = await getOwnDoctor(req);
  const { workingDays, slotDuration } = req.body;

  if (workingDays) doctor.availability.workingDays = workingDays;
  if (slotDuration) doctor.availability.slotDuration = slotDuration;

  await doctor.save();
  res.json(ok("Availability updated", doctor.availability));
});
