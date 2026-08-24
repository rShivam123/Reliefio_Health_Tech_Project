import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Doctor, DoctorFilters, Review } from "@/types/doctor";

export const getDoctors = async (filters: DoctorFilters): Promise<ApiResponse<Doctor[]>> => {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = String(value);
    }
  });
  const res = await api.get("/doctors", { params });
  return res.data;
};

export const getSpecialties = async (): Promise<ApiResponse<string[]>> => {
  const res = await api.get("/doctors/specialties");
  return res.data;
};

export const getDoctorById = async (id: string): Promise<ApiResponse<{ doctor: Doctor; reviews: Review[] }>> => {
  const res = await api.get(`/doctors/${id}`);
  return res.data;
};

export const getDoctorSlots = async (id: string, date: string): Promise<ApiResponse<string[]>> => {
  const res = await api.get(`/doctors/${id}/slots`, { params: { date } });
  return res.data;
};

export const createDoctorProfile = async (payload: Partial<Doctor>) => {
  const res = await api.post("/doctors", payload);
  return res.data;
};

export const updateDoctorProfile = async (id: string, payload: Partial<Doctor>) => {
  const res = await api.put(`/doctors/${id}`, payload);
  return res.data;
};
