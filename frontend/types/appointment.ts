import { Doctor } from "./doctor";

export type AppointmentStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface AppointmentPatient {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  allergies?: string[];
  currentMedications?: string[];
}

export interface Appointment {
  _id: string;
  patient: AppointmentPatient | string;
  doctor: Doctor | string;
  date: string;
  time: string;
  consultationType: "Online" | "In-Person";
  reason: string;
  notes: string;
  status: AppointmentStatus;
  paymentStatus: "Pending" | "Paid";
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  doctorId: string;
  date: string;
  time: string;
  consultationType: "Online" | "In-Person";
  reason: string;
  notes?: string;
}
