import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Doctor, DoctorAvailability } from "@/types/doctor";
import { Appointment } from "@/types/appointment";

export interface PhysicianDashboard {
  doctorName: string;
  todaysAppointments: Appointment[];
  todaysAppointmentCount: number;
  pendingAppointments: number;
  completedConsultations: number;
  totalPatients: number;
  todaysEarnings: number;
  unreadNotifications: number;
}

export interface PhysicianPatient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  lastVisit: string | null;
  nextAppointment: string | null;
}

export const getPhysicianDashboard = async (): Promise<ApiResponse<PhysicianDashboard>> => {
  const res = await api.get("/physician/dashboard");
  return res.data;
};

export const getPhysicianAppointments = async (params?: {
  scope?: "today" | "upcoming" | "past";
  status?: string;
}): Promise<ApiResponse<Appointment[]>> => {
  const res = await api.get("/physician/appointments", { params });
  return res.data;
};

export const getPhysicianPatients = async (search?: string): Promise<ApiResponse<PhysicianPatient[]>> => {
  const res = await api.get("/physician/patients", { params: search ? { search } : undefined });
  return res.data;
};

export const getPhysicianPatientDetail = async (id: string) => {
  const res = await api.get(`/physician/patients/${id}`);
  return res.data;
};

export const getPhysicianProfile = async (): Promise<ApiResponse<Doctor | null>> => {
  const res = await api.get("/physician/profile");
  return res.data;
};

export const updatePhysicianProfile = async (payload: Partial<Doctor>) => {
  const res = await api.put("/physician/profile", payload);
  return res.data;
};

export const getPhysicianAvailability = async (): Promise<ApiResponse<DoctorAvailability>> => {
  const res = await api.get("/physician/availability");
  return res.data;
};

export const updatePhysicianAvailability = async (payload: Partial<DoctorAvailability>) => {
  const res = await api.put("/physician/availability", payload);
  return res.data;
};
