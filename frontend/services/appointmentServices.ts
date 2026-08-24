import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Appointment, CreateAppointmentPayload } from "@/types/appointment";

export const createAppointment = async (payload: CreateAppointmentPayload): Promise<ApiResponse<Appointment>> => {
  const res = await api.post("/appointments", payload);
  return res.data;
};

export const getMyAppointments = async (params?: {
  status?: string;
  scope?: "today" | "upcoming" | "past";
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Appointment[]>> => {
  const res = await api.get("/appointments", { params });
  return res.data;
};

export const getAppointmentById = async (id: string): Promise<ApiResponse<Appointment>> => {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
};

export const updateAppointment = async (
  id: string,
  payload: { status?: string; date?: string; time?: string; cancellationReason?: string }
): Promise<ApiResponse<Appointment>> => {
  const res = await api.put(`/appointments/${id}`, payload);
  return res.data;
};

export const deleteAppointment = async (id: string) => {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
};
