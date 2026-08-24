import api from "../lib/axios";
import { ApiResponse } from "@/types/common";
import { Consultation } from "@/types/consultation";

export const createOrUpdateConsultation = async (payload: {
  appointmentId: string;
  diagnosis?: string;
  notes?: string;
}): Promise<ApiResponse<Consultation>> => {
  const res = await api.post("/consultations", payload);
  return res.data;
};

export const getConsultationByAppointment = async (appointmentId: string): Promise<ApiResponse<Consultation | null>> => {
  const res = await api.get(`/consultations/appointment/${appointmentId}`);
  return res.data;
};

export const updateConsultation = async (
  id: string,
  payload: { diagnosis?: string; notes?: string; markCompleted?: boolean }
): Promise<ApiResponse<Consultation>> => {
  const res = await api.put(`/consultations/${id}`, payload);
  return res.data;
};
